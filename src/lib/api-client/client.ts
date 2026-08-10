import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getEnv } from '@/lib/config';
import { handleAxiosError } from './error-handler';

const env = getEnv();

// Konfigurasi retry default
const MAX_RETRY = 2; // maksimal 2x percobaan ulang
const BASE_BACKOFF_MS = 1000; // delay awal retry

// Tambahkan properti internal retry ke tipe config axios
declare module 'axios' {
  export interface AxiosRequestConfig {
    __retryCount?: number;
    // Set true di config request untuk menonaktifkan retry sama sekali
    skipRetry?: boolean;
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000, // Timeout 15 detik (endpoint berat seperti tagihan tidak gampang timeout)
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

// Setter untuk dynamic token
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setTenantId = (_tenantId: string | null) => {
  // Deprecated in single tenant mode
};

// Request Interceptor untuk inject token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor untuk auto unwrap / unwrap error dan Retry Strategy
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config;

    // Hanya retry bila: ada config, tidak ditandai skipRetry, dan belum melebihi batas.
    // Network Error TIDAK di-retry: jika server benar-benar tidak merespons,
    // mengulang hanya membuat user menunggu lebih lama tanpa hasil.
    const isRetryable =
      !!config &&
      !config.skipRetry &&
      (config.__retryCount ?? 0) < MAX_RETRY &&
      (
        error.code === 'ECONNABORTED' ||               // timeout
        (error.response && error.response.status! >= 500) // error server
      );

    if (isRetryable) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;

      // Exponential backoff: 1s, 2s, 4s, ...
      const delay = BASE_BACKOFF_MS * Math.pow(2, (config.__retryCount ?? 1) - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(config);
    }

    // Setelah retry habis (atau tidak bisa di-retry), lemparkan error terstandar.
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error);
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: async <T>(url: string, config = {}): Promise<T> => {
    const res = await api.get<T>(url, config);
    return res.data;
  },
  post: async <T>(url: string, data = {}, config = {}): Promise<T> => {
    const res = await api.post<T>(url, data, config);
    return res.data;
  },
  put: async <T>(url: string, data = {}, config = {}): Promise<T> => {
    const res = await api.put<T>(url, data, config);
    return res.data;
  },
  patch: async <T>(url: string, data = {}, config = {}): Promise<T> => {
    const res = await api.patch<T>(url, data, config);
    return res.data;
  },
  delete: async <T>(url: string, config = {}): Promise<T> => {
    const res = await api.delete<T>(url, config);
    return res.data;
  },
};
