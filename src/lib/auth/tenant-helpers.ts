import { User } from '@/types';

/**
 * Validasi apakah pengguna memiliki hak akses terhadap tenant_id tertentu.
 * SUPER_ADMIN dilewati (bypass) karena mengelola semua tenant global.
 */
export function validateTenantAccess(user: User | null, targetTenantId: string | null): boolean {
  if (!user) return false;
  
  // SUPER_ADMIN dapat mengakses semua tenant
  if (user.role === 'SUPER_ADMIN') {
    return true;
  }
  
  // Role lainnya wajib memiliki tenantId dan harus cocok dengan target tenant
  if (!user.tenantId || !targetTenantId) {
    return false;
  }
  
  return user.tenantId === targetTenantId;
}

/**
 * Cek apakah user wajib terikat dengan tenant (semua role selain SUPER_ADMIN)
 */
export function isTenantRequired(role: User['role']): boolean {
  return role !== 'SUPER_ADMIN';
}
