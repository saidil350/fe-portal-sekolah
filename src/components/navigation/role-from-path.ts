import { Role } from '@/types';

const DASHBOARD_ROLE_SEGMENTS: Array<{ segment: string; role: Role }> = [
  { segment: 'admin', role: 'ADMIN_IT' },
  { segment: 'kepala-sekolah', role: 'KEPALA_SEKOLAH' },
  { segment: 'guru', role: 'GURU' },
  { segment: 'siswa', role: 'SISWA' },
];

export function getRoleFromDashboardPath(pathname: string | null): Role | null {
  if (!pathname) return null;

  const roleSegment = pathname.split('/').filter(Boolean)[1];
  return DASHBOARD_ROLE_SEGMENTS.find((item) => item.segment === roleSegment)?.role ?? null;
}
