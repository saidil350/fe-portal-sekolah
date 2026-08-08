import { Role } from '@/types';

export const ROLES: Record<Role, Role> = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_IT: 'ADMIN_IT',
  KEPALA_SEKOLAH: 'KEPALA_SEKOLAH',
  BENDAHARA: 'BENDAHARA',
  GURU: 'GURU',
  STAFF: 'STAFF',
  SISWA: 'SISWA',
};

// Nilai bobot hierarki untuk perbandingan role (semakin besar semakin tinggi otoritasnya)
export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 100,
  ADMIN_IT: 80,
  KEPALA_SEKOLAH: 60,
  BENDAHARA: 50,
  GURU: 40,
  STAFF: 30,
  SISWA: 10,
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_IT: 'Admin IT',
  KEPALA_SEKOLAH: 'Kepala Sekolah',
  BENDAHARA: 'Bendahara Sekolah',
  GURU: 'Guru',
  STAFF: 'Staff Administrasi',
  SISWA: 'Siswa',
};

