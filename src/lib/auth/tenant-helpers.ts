import { User } from '@/types';

/**
 * Validasi apakah pengguna memiliki hak akses (Single-Tenant Mode).
 */
export function validateTenantAccess(user: User | null, _targetTenantId?: string | null): boolean {
  return !!user;
}

/**
 * Cek apakah user wajib terikat dengan tenant (Deprecated di Single-Tenant)
 */
export function isTenantRequired(_role?: User['role']): boolean {
  return false;
}
