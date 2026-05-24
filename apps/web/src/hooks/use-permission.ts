import { useAuthStore } from '../stores/auth-store';
import { Permission, Role } from '@portal-sekolah/types';
import { hasPermission, canAccess } from '@portal-sekolah/auth';

export function usePermission() {
  const { user } = useAuthStore();

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(user, permission);
  };

  const checkAccess = (requirements: { roles?: Role[]; permissions?: Permission[] }): boolean => {
    return canAccess(user, requirements);
  };

  return {
    userRole: user?.role || null,
    hasPermission: checkPermission,
    canAccess: checkAccess,
  };
}
