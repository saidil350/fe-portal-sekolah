import { Role } from '@/types';

export interface NavItem {
  title: string;
  href: string;
  iconName: 'LayoutDashboard' | 'School' | 'Users' | 'User' | 'BookOpen' | 'CalendarCheck' | 'FileText' | 'CreditCard' | 'Bell' | 'Settings' | 'ShieldAlert' | 'Activity' | 'BarChart3';
}

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { title: 'Dashboard Platform', href: '/dashboard/super-admin', iconName: 'LayoutDashboard' },
  ],
  ADMIN_IT: [
    { title: 'Dashboard', href: '/dashboard/admin', iconName: 'LayoutDashboard' },
    { title: 'Kelola Pengguna', href: '/dashboard/admin/users', iconName: 'Users' },
    { title: 'Kenaikan Kelas', href: '/dashboard/admin/classes/promotion', iconName: 'School' },
    { title: 'Monitoring Pembayaran', href: '/dashboard/admin/payments', iconName: 'CreditCard' },
    { title: 'Notifikasi Sekolah', href: '/dashboard/admin/notifications', iconName: 'Bell' },
    { title: 'Pengaturan Sekolah', href: '/dashboard/admin/settings', iconName: 'Settings' },
    { title: 'Profil Saya', href: '/dashboard/admin/profile', iconName: 'User' },
  ],
  KEPALA_SEKOLAH: [
    { title: 'Dashboard', href: '/dashboard/kepala-sekolah', iconName: 'LayoutDashboard' },
    { title: 'Monitoring Pembayaran', href: '/dashboard/kepala-sekolah/payments', iconName: 'CreditCard' },
    { title: 'Profil Saya', href: '/dashboard/kepala-sekolah/profile', iconName: 'User' },
  ],
  GURU: [
    { title: 'Dashboard', href: '/dashboard/guru', iconName: 'LayoutDashboard' },
    { title: 'Notifikasi', href: '/dashboard/guru/notifications', iconName: 'Bell' },
    { title: 'Profil Saya', href: '/dashboard/guru/profile', iconName: 'User' },
  ],
  STAFF: [
    { title: 'Dashboard', href: '/dashboard/staff', iconName: 'LayoutDashboard' },
    { title: 'Monitoring Pembayaran', href: '/dashboard/staff/payments', iconName: 'CreditCard' },
  ],
  SISWA: [
    { title: 'Dashboard', href: '/dashboard/siswa', iconName: 'LayoutDashboard' },
    { title: 'Riwayat Pembayaran', href: '/dashboard/siswa/payments', iconName: 'CreditCard' },
    { title: 'Notifikasi', href: '/dashboard/siswa/notifications', iconName: 'Bell' },
    { title: 'Profil Saya', href: '/dashboard/siswa/profile', iconName: 'User' },
  ],
};
