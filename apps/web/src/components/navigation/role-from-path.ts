import { Role } from '@portal-sekolah/types';

const DASHBOARD_ROLE_SEGMENTS: Array<{ segment: string; role: Role }> = [
  { segment: 'super-admin', role: 'SUPER_ADMIN' },
  { segment: 'admin', role: 'ADMIN_IT' },
  { segment: 'kepala-sekolah', role: 'KEPALA_SEKOLAH' },
  { segment: 'guru', role: 'GURU' },
  { segment: 'staff', role: 'STAFF' },
  { segment: 'siswa', role: 'SISWA' },
];

export function getRoleFromDashboardPath(pathname: string | null): Role | null {
  if (!pathname) return null;

  const roleSegment = pathname.split('/').filter(Boolean)[1];
  return DASHBOARD_ROLE_SEGMENTS.find((item) => item.segment === roleSegment)?.role ?? null;
}
