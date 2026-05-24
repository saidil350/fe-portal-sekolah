import { Role } from '@portal-sekolah/types';

export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  LANDING: '/',
};

export const DASHBOARD_ROUTES: Record<Role, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  ADMIN_IT: '/dashboard/admin',
  KEPALA_SEKOLAH: '/dashboard/kepala-sekolah',
  GURU: '/dashboard/guru',
  STAFF: '/dashboard/staff',
  SISWA: '/dashboard/siswa',
};

export const COMMON_DASHBOARD_PREFIX = '/dashboard';
