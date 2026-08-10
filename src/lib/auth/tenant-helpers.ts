import { User } from '@/types';

/**
 * Validasi apakah pengguna memiliki hak akses terhadap tenant_id tertentu.
 */
export function validateTenantAccess(user: User | null, targetTenantId: string | null): boolean {
  if (!user) return false;
  
  if (!user.tenantId || !targetTenantId) {
    return false;
  }
  
  return user.tenantId === targetTenantId;
}

/**
 * Cek apakah user wajib terikat dengan tenant
 */
export function isTenantRequired(_role?: User['role']): boolean {
  return true;
}
