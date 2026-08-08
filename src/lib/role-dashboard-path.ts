import { Role } from '@/types';

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  ADMIN_IT: '/dashboard/admin',
  KEPALA_SEKOLAH: '/dashboard/kepala-sekolah',
  BENDAHARA: '/dashboard/bendahara',
  GURU: '/dashboard/guru',
  STAFF: '/dashboard/staff',
  SISWA: '/dashboard/siswa',
};
