import { Role, Permission, User } from '@/types';
import { ROLE_HIERARCHY } from '@/lib/constants';
import { PERMISSION_MATRIX } from './permissions';

/**
 * Cek apakah user memiliki minimal role tertentu (berdasarkan bobot hierarki)
 */
export function hasAtLeastRole(userRole: Role, requiredRole: Role): boolean {
  const userWeight = ROLE_HIERARCHY[userRole] || 0;
  const requiredWeight = ROLE_HIERARCHY[requiredRole] || 0;
  return userWeight >= requiredWeight;
}

/**
 * Cek apakah user memiliki role spesifik
 */
export function hasRole(user: User | null, roles: Role | Role[]): boolean {
  if (!user) return false;
  const roleList = Array.isArray(roles) ? roles : [roles];
  return roleList.includes(user.role);
}

/**
 * Cek apakah user memiliki izin (permission) tertentu
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  const userPermissions = PERMISSION_MATRIX[user.role] || [];
  return userPermissions.includes(permission);
}

/**
 * Cek akses berdasarkan role dan permission
 */
export function canAccess(
  user: User | null,
  requirements: { roles?: Role[]; permissions?: Permission[] }
): boolean {
  if (!user) return false;

  const { roles, permissions } = requirements;

  // Jika butuh role spesifik
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.role);
    if (!hasRequiredRole) return false;
  }

  // Jika butuh permission spesifik
  if (permissions && permissions.length > 0) {
    const hasAllPermissions = permissions.every((p) => hasPermission(user, p));
    if (!hasAllPermissions) return false;
  }

  return true;
}
