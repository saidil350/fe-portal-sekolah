import { useAuthStore } from '../stores/auth-store';

export function useTenant() {
  const { tenantId, user, setTenant } = useAuthStore();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return {
    tenantId,
    tenantName: user?.tenantId ? `Sekolah Tenant ${user.tenantId}` : 'Super Portal', // Simulasi dinamis
    isSuperAdmin,
    setTenant,
  };
}
