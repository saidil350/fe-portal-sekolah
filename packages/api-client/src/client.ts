import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getEnv } from '@portal-sekolah/config';
import { handleAxiosError } from './error-handler';

const env = getEnv();

export const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;
let activeTenantId: string | null = null;

// Setter untuk dynamic token dan tenant
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const setTenantId = (tenantId: string | null) => {
  activeTenantId = tenantId;
};

// Request Interceptor untuk inject token dan tenantId
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    if (activeTenantId && config.headers) {
      config.headers['X-Tenant-ID'] = activeTenantId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor untuk auto unwrap / unwrap error
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
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
  patch: async <T>(url: string, data = {}, config = {}): Promise<T> => {
    const res = await api.patch<T>(url, data, config);
    return res.data;
  },
  delete: async <T>(url: string, config = {}): Promise<T> => {
    const res = await api.delete<T>(url, config);
    return res.data;
  },
};
