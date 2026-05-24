import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@portal-sekolah/types';

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

export function handleAxiosError(error: AxiosError<ApiErrorResponse>): never {
  const status = error.response?.status || 500;
  const data = error.response?.data;
  
  const message = data?.message || error.message || 'Terjadi kesalahan sistem internal';
  const errors = data?.errors;
  
  throw new AppApiError(message, status, errors);
}
