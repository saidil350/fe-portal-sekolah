'use client';

import { NotificationsPage } from '@/components/dashboard/notifications-page';
import type { NotificationItem } from '@/components/dashboard/notifications-page';

const guruNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Pengumuman Rapat Dewan Guru',
    message:
      'Diberitahukan kepada seluruh dewan guru bahwa rapat koordinasi semester akan diadakan pada Jumat pukul 13.00 WIB di aula sekolah.',
    type: 'ANNOUNCEMENT',
    createdAt: '30 menit yang lalu',
    isRead: false,
  },
  {
    id: '2',
    title: 'Pengumpulan Tugas Menunggu Penilaian',
    message:
      '14 pengumpulan tugas dari kelas XI IPA 1 belum dinilai. Segera lengkapi penilaian sebelum batas akhir pekan ini.',
    type: 'ACADEMIC',
    createdAt: '2 jam yang lalu',
    isRead: false,
  },
  {
    id: '3',
    title: 'Rekap Presensi Siswa Tersedia',
    message:
      'Rekap kehadiran siswa untuk minggu lalu sudah tersedia di modul presensi. Silakan verifikasi data ketidakhadiran.',
    type: 'ATTENDANCE',
    createdAt: 'Kemarin',
    isRead: true,
  },
  {
    id: '4',
    title: 'Peringatan Pembaruan Password',
    message:
      'Demi keamanan akun Anda, disarankan untuk memperbarui kata sandi secara berkala.',
    type: 'WARNING',
    createdAt: '3 hari yang lalu',
    isRead: true,
  },
];

export default function GuruNotificationsPage() {
  return (
    <NotificationsPage
      title="Notifikasi Guru"
      description="Pengumuman sekolah, informasi tugas, dan pembaruan kehadiran siswa."
      initialNotifications={guruNotifications}
    />
  );
}
