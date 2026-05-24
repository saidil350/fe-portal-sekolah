import { Role } from '@portal-sekolah/types';

export interface NavItem {
  title: string;
  href: string;
  iconName: 'LayoutDashboard' | 'School' | 'Users' | 'User' | 'BookOpen' | 'CalendarCheck' | 'FileText' | 'CreditCard' | 'Bell' | 'Settings' | 'ShieldAlert' | 'Activity' | 'BarChart3';
}

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { title: 'Dashboard', href: '/dashboard/super-admin', iconName: 'LayoutDashboard' },
    { title: 'Kelola Tenant Sekolah', href: '/dashboard/super-admin/tenants', iconName: 'School' },
    { title: 'Statistik Global', href: '/dashboard/super-admin/stats', iconName: 'Activity' },
    { title: 'Audit Log Sistem', href: '/dashboard/super-admin/logs', iconName: 'ShieldAlert' },
    { title: 'Monitoring Sistem', href: '/dashboard/super-admin/system', iconName: 'BarChart3' },
    { title: 'Pengaturan Global', href: '/dashboard/super-admin/settings', iconName: 'Settings' },
  ],
  ADMIN_IT: [
    { title: 'Dashboard', href: '/dashboard/admin', iconName: 'LayoutDashboard' },
    { title: 'Kelola Pengguna', href: '/dashboard/admin/users', iconName: 'Users' },
    { title: 'Kelola Kelas', href: '/dashboard/admin/classes', iconName: 'BookOpen' },
    { title: 'Kehadiran Sekolah', href: '/dashboard/admin/attendance', iconName: 'CalendarCheck' },
    { title: 'Monitoring Pembayaran', href: '/dashboard/admin/payments', iconName: 'CreditCard' },
    { title: 'Notifikasi Sekolah', href: '/dashboard/admin/notifications', iconName: 'Bell' },
    { title: 'Laporan Sekolah', href: '/dashboard/admin/reports', iconName: 'FileText' },
    { title: 'Pengaturan Sekolah', href: '/dashboard/admin/settings', iconName: 'Settings' },
  ],
  KEPALA_SEKOLAH: [
    { title: 'Dashboard', href: '/dashboard/kepala-sekolah', iconName: 'LayoutDashboard' },
    { title: 'Laporan Kehadiran', href: '/dashboard/kepala-sekolah/attendance', iconName: 'CalendarCheck' },
    { title: 'Monitoring Pembayaran', href: '/dashboard/kepala-sekolah/payments', iconName: 'CreditCard' },
    { title: 'Evaluasi Akademik', href: '/dashboard/kepala-sekolah/academic', iconName: 'BookOpen' },
    { title: 'Laporan Sekolah', href: '/dashboard/kepala-sekolah/reports', iconName: 'FileText' },
  ],
  GURU: [
    { title: 'Dashboard', href: '/dashboard/guru', iconName: 'LayoutDashboard' },
    { title: 'Kelola Tugas', href: '/dashboard/guru/assignments', iconName: 'FileText' },
    { title: 'Kelas Saya', href: '/dashboard/guru/classes', iconName: 'Users' },
    { title: 'Kehadiran Kelas', href: '/dashboard/guru/attendance', iconName: 'CalendarCheck' },
    { title: 'Penilaian Siswa', href: '/dashboard/guru/grades', iconName: 'BookOpen' },
    { title: 'Notifikasi', href: '/dashboard/guru/notifications', iconName: 'Bell' },
  ],
  STAFF: [
    { title: 'Dashboard', href: '/dashboard/staff', iconName: 'LayoutDashboard' },
    { title: 'Presensi Siswa', href: '/dashboard/staff/attendance', iconName: 'CalendarCheck' },
    { title: 'Kelola Invoices SPP', href: '/dashboard/staff/invoices', iconName: 'CreditCard' },
    { title: 'Notifikasi', href: '/dashboard/staff/notifications', iconName: 'Bell' },
    { title: 'Profil Saya', href: '/dashboard/staff/profile', iconName: 'User' },
    { title: 'Pengaturan SPP', href: '/dashboard/staff/settings', iconName: 'Settings' },
  ],
  SISWA: [
    { title: 'Dashboard', href: '/dashboard/siswa', iconName: 'LayoutDashboard' },
    { title: 'Riwayat Kehadiran', href: '/dashboard/siswa/attendance', iconName: 'CalendarCheck' },
    { title: 'Daftar Tugas', href: '/dashboard/siswa/assignments', iconName: 'FileText' },
    { title: 'Riwayat Pembayaran', href: '/dashboard/siswa/payments', iconName: 'CreditCard' },
    { title: 'Notifikasi', href: '/dashboard/siswa/notifications', iconName: 'Bell' },
    { title: 'Profil Saya', href: '/dashboard/siswa/profile', iconName: 'User' },
  ],
};
