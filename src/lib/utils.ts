import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

// Re-exports for convenience
export { ROLES, ROLE_LABELS, DASHBOARD_ROUTES, PUBLIC_ROUTES } from '@/lib/constants';
export { canAccess, hasPermission, hasRole } from '@/lib/auth';
export { formatDisplayId, getReadableInvoiceRef, isUuid } from '@/lib/formatters';

// Classname merger (shadcn-ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date helpers
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    ...options,
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    timeStyle: 'short',
  }).format(d);
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 600);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return 'Baru saja';
  if (diffInMins < 60) return `${diffInMins} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays === 1) return 'Kemarin';
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
  
  return formatDate(d);
}

// Formatting helpers
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Validation Schemas
export const phoneSchema = z
  .string()
  .min(10, { message: 'Nomor telepon minimal 10 digit' })
  .max(15, { message: 'Nomor telepon maksimal 15 digit' })
  .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,11}$/, {
    message: 'Format nomor telepon Indonesia tidak valid (cth: 0812xxxxxxxx)',
  });

export const nisnSchema = z
  .string()
  .length(10, { message: 'NISN harus tepat 10 digit' })
  .regex(/^[0-9]+$/, { message: 'NISN hanya boleh berisi angka' });

export const nipSchema = z
  .string()
  .min(9, { message: 'NIP minimal 9 karakter' })
  .max(18, { message: 'NIP maksimal 18 karakter' })
  .regex(/^[0-9]+$/, { message: 'NIP hanya boleh berisi angka' });

export const emailSchema = z
  .string()
  .email({ message: 'Alamat email tidak valid' });

export const passwordSchema = z
  .string()
  .min(8, { message: 'Kata sandi minimal 8 karakter' })
  .regex(/[A-Z]/, { message: 'Kata sandi harus mengandung minimal satu huruf besar' })
  .regex(/[a-z]/, { message: 'Kata sandi harus mengandung minimal satu huruf kecil' })
  .regex(/[0-9]/, { message: 'Kata sandi me ngandung minimal satu angka' });
