import { Role } from '@/types';

export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  LANDING: '/',
};

export const DASHBOARD_ROUTES: Record<Role, string> = {
  ADMIN_IT: '/dashboard/admin',
  KEPALA_SEKOLAH: '/dashboard/kepala-sekolah',
  BENDAHARA: '/dashboard/bendahara',
  GURU: '/dashboard/guru',
  STAFF: '/dashboard/staff',
  SISWA: '/dashboard/siswa',
};

export const COMMON_DASHBOARD_PREFIX = '/dashboard';
