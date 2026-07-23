import { useAuthStore } from '../stores/auth-store';

export function useTenant() {
  const { tenantId, user, setTenant } = useAuthStore();

  const isSuperAdmin = false;

  return {
    tenantId,
    tenantName: user?.tenantId ? `Sekolah Tenant ${user.tenantId}` : 'Portal Sekolah',
    isSuperAdmin,
    setTenant,
  };
}
