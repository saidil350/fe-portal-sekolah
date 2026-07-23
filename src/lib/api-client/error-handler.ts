import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types';

export class AppApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;
  public code?: string;

  constructor(message: string, status: number, errors?: Record<string, string[]>, code?: string) {
    super(message);
    this.name = 'AppApiError';
    this.status = status;
    this.errors = errors;
    this.code = code;
  }
}

export function handleAxiosError(error: AxiosError): never {
  const data = error.response?.data as ApiErrorResponse | undefined;

  // Tidak ada response dari server sama sekali => masalah jaringan / server down / CORS.
  // Beri pesan yang jelas agar tidak membingungkan pengguna dengan "Network Error".
  if (!error.response) {
    const isTimeout = error.code === 'ECONNABORTED';
    const message = isTimeout
      ? 'Permintaan melebihi batas waktu. Server terlalu lama merespons.'
      : 'Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan server tersedia.';
    throw new AppApiError(message, 0, undefined, error.code);
  }

  const status = error.response.status;
  const message = data?.message || error.message || 'Terjadi kesalahan sistem internal';
  const errors = data?.errors;

  throw new AppApiError(message, status, errors);
}
