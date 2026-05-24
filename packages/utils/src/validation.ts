import { z } from 'zod';

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
  .regex(/[0-9]/, { message: 'Kata sandi harus mengandung minimal satu angka' });
