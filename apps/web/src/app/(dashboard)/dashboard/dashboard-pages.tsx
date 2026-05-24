'use client';

import * as React from 'react';
import {
  DashboardRoutePage,
  DashboardRow,
  StatusBadge,
} from '@/components/dashboard/dashboard-route-page';
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle,
  Clock,
  CreditCard,
  FileCog,
  FileText,
  GraduationCap,
  Landmark,
  ListChecks,
  Lock,
  MapPin,
  Receipt,
  School,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';

const green = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
const amber = 'text-amber-500 bg-amber-50 dark:bg-amber-950/30';
const blue = 'text-sky-500 bg-sky-50 dark:bg-sky-950/30';
const indigo = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30';
const violet = 'text-violet-500 bg-violet-50 dark:bg-violet-950/30';
const rose = 'text-rose-500 bg-rose-50 dark:bg-rose-950/30';

function text(row: DashboardRow, key: string) {
  return String(row[key] ?? '');
}

function status(row: DashboardRow, key = 'status') {
  const value = text(row, key);
  const variant =
    value.includes('Aktif') || value.includes('Selesai') || value.includes('Hadir') || value.includes('Lunas')
      ? 'success'
      : value.includes('Terlambat') || value.includes('Pending') || value.includes('Proses')
      ? 'secondary'
      : value.includes('Kritis') || value.includes('Belum') || value.includes('Ditangguhkan')
      ? 'destructive'
      : 'outline';

  return <StatusBadge label={value} variant={variant} />;
}

export function SuperAdminTenantsPage() {
  return (
    <DashboardRoutePage
      title="Kelola Tenant Sekolah"
      description="Pantau daftar sekolah, paket berlangganan, domain, dan status aktivasi tenant dalam satu panel."
      actionLabel="Tambah Sekolah"
      actionIcon={School}
      stats={[
        { title: 'Tenant Aktif', value: '34 Sekolah', description: '4 sekolah dalam onboarding', icon: School, color: violet },
        { title: 'Domain Terverifikasi', value: '31 Domain', description: '3 menunggu DNS', icon: CheckCircle, color: green },
        { title: 'Paket Enterprise', value: '18 Sekolah', description: 'Kontributor revenue terbesar', icon: Landmark, color: indigo },
      ]}
      insights={[
        { title: 'Onboarding', value: '4 sekolah', description: 'Perlu follow-up dokumen legal dan konfigurasi domain.', badge: 'Minggu ini' },
        { title: 'Risiko churn', value: '2 tenant', description: 'Pemakaian turun selama 14 hari terakhir.', badge: 'Pantau', badgeVariant: 'outline' },
        { title: 'Ekspansi', value: '7 prospek', description: 'Siap masuk pipeline migrasi data semester baru.', badge: 'Lead' },
      ]}
      table={{
        title: 'Daftar Tenant Sekolah',
        icon: School,
        searchKey: 'school',
        searchPlaceholder: 'Cari sekolah...',
        data: [
          { school: 'SMA Negeri 1 Jakarta', domain: 'sman1jkt.portalsekolah.id', plan: 'Enterprise', admin: 'Rina Puspita', status: 'Aktif' },
          { school: 'SMP Kristen Yusuf', domain: 'smpkyusuf.portalsekolah.id', plan: 'Pro', admin: 'Daniel Wijaya', status: 'Aktif' },
          { school: 'SD Al-Azhar Pusat', domain: 'sdalazhar.portalsekolah.id', plan: 'Enterprise', admin: 'Nadia Farah', status: 'Proses DNS' },
          { school: 'SMK Taruna Bhakti', domain: 'smktaruna.portalsekolah.id', plan: 'Starter', admin: 'Hendra Kurnia', status: 'Ditangguhkan' },
          { school: 'SMA Pelita Bangsa', domain: 'smapelita.portalsekolah.id', plan: 'Pro', admin: 'Maya Lestari', status: 'Aktif' },
        ],
        columns: [
          { header: 'Sekolah', accessorKey: 'school' },
          { header: 'Domain', accessorKey: 'domain' },
          { header: 'Paket', render: (row) => <StatusBadge label={text(row, 'plan')} /> },
          { header: 'Admin Utama', accessorKey: 'admin' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function SuperAdminStatsPage() {
  return (
    <DashboardRoutePage
      title="Statistik Global"
      description="Ringkasan performa SaaS lintas tenant, aktivitas pengguna, dan kesehatan layanan cloud."
      actionLabel="Export Statistik"
      actionIcon={TrendingUp}
      stats={[
        { title: 'Pengguna Bulanan', value: '48.320 MAU', description: '+12.4% dari bulan lalu', icon: Users, color: indigo },
        { title: 'Uptime Layanan', value: '99.98%', description: 'SLA masih terpenuhi', icon: Activity, color: green },
        { title: 'Transaksi SPP', value: 'Rp 1,8 M', description: 'Lintas tenant bulan ini', icon: CreditCard, color: blue },
      ]}
      insights={[
        { title: 'Peak traffic', value: '07.00-08.30', description: 'Mayoritas check-in siswa terjadi sebelum jam pertama.', badge: 'Harian' },
        { title: 'API latency', value: '182 ms', description: 'Rata-rata p95 untuk request dashboard summary.', badge: 'Stabil', badgeVariant: 'success' },
        { title: 'Adopsi fitur', value: '76%', description: 'Tenant aktif sudah memakai modul presensi dan pembayaran.', badge: 'Baik' },
      ]}
      table={{
        title: 'Performa Tenant Teratas',
        icon: BarChart3,
        searchKey: 'school',
        data: [
          { school: 'SMA Negeri 1 Jakarta', users: '2.840', attendance: '98.2%', payment: '96.8%', status: 'Aktif' },
          { school: 'SD Al-Azhar Pusat', users: '1.920', attendance: '97.4%', payment: '94.1%', status: 'Aktif' },
          { school: 'SMA Pelita Bangsa', users: '1.540', attendance: '95.9%', payment: '92.0%', status: 'Aktif' },
          { school: 'SMK Taruna Bhakti', users: '1.210', attendance: '88.7%', payment: '71.5%', status: 'Kritis' },
        ],
        columns: [
          { header: 'Sekolah', accessorKey: 'school' },
          { header: 'Pengguna Aktif', accessorKey: 'users' },
          { header: 'Kehadiran', accessorKey: 'attendance' },
          { header: 'Pembayaran', accessorKey: 'payment' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function SuperAdminLogsPage() {
  return (
    <DashboardRoutePage
      title="Audit Log Sistem"
      description="Pantau aktivitas penting, perubahan konfigurasi, dan peringatan keamanan pada platform."
      actionLabel="Unduh Audit Log"
      actionIcon={ShieldAlert}
      stats={[
        { title: 'Event Hari Ini', value: '1.284 Log', description: 'Termasuk login dan update data', icon: ListChecks, color: blue },
        { title: 'Peringatan Keamanan', value: '6 Alert', description: '2 perlu ditinjau admin', icon: ShieldAlert, color: rose },
        { title: 'Aksi Admin', value: '142 Aksi', description: 'Lima tenant paling aktif', icon: Lock, color: amber },
      ]}
      insights={[
        { title: 'Login gagal', value: '24 kali', description: 'Sebagian besar dari perangkat baru staff.', badge: 'Review' },
        { title: 'Perubahan role', value: '9 event', description: 'Semua tercatat dengan actor dan timestamp.', badge: 'Tercatat', badgeVariant: 'success' },
        { title: 'Retensi log', value: '180 hari', description: 'Sesuai kebijakan audit internal platform.', badge: 'Policy' },
      ]}
      table={{
        title: 'Aktivitas Sistem Terbaru',
        icon: ShieldAlert,
        searchKey: 'actor',
        searchPlaceholder: 'Cari aktor...',
        data: [
          { time: '24 Mei 2026 07:42', actor: 'superadmin@portal.id', action: 'Update paket tenant', target: 'SMA Pelita Bangsa', status: 'Selesai' },
          { time: '24 Mei 2026 07:18', actor: 'system', action: 'Deteksi login gagal berulang', target: 'SMK Taruna Bhakti', status: 'Pending' },
          { time: '23 Mei 2026 16:02', actor: 'ops@portal.id', action: 'Reset domain tenant', target: 'SD Al-Azhar Pusat', status: 'Selesai' },
          { time: '23 Mei 2026 11:36', actor: 'billing@portal.id', action: 'Sinkronisasi invoice', target: 'SMP Kristen Yusuf', status: 'Selesai' },
        ],
        columns: [
          { header: 'Waktu', accessorKey: 'time' },
          { header: 'Aktor', accessorKey: 'actor' },
          { header: 'Aksi', accessorKey: 'action' },
          { header: 'Target', accessorKey: 'target' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function SuperAdminSettingsPage() {
  return (
    <DashboardRoutePage
      title="Pengaturan Global"
      description="Kelola konfigurasi platform, keamanan, notifikasi, dan kebijakan dasar seluruh tenant."
      actionLabel="Simpan Draft"
      actionIcon={Settings}
      stats={[
        { title: 'Kebijakan Aktif', value: '12 Policy', description: 'Berlaku untuk semua tenant', icon: FileCog, color: indigo },
        { title: 'Integrasi Sistem', value: '7 Aktif', description: 'Payment, email, storage, dan queue', icon: Activity, color: green },
        { title: 'Notifikasi Global', value: '4 Template', description: 'Email dan in-app alert', icon: Bell, color: amber },
      ]}
      insights={[
        { title: 'Maintenance', value: 'Belum dijadwalkan', description: 'Tidak ada downtime terencana minggu ini.', badge: 'Normal', badgeVariant: 'success' },
        { title: 'Keamanan', value: 'MFA admin', description: 'Direkomendasikan aktif untuk semua akun operator.', badge: 'Prioritas' },
        { title: 'Backup', value: 'Harian', description: 'Snapshot otomatis tersimpan lintas region.', badge: 'Aktif' },
      ]}
      table={{
        title: 'Konfigurasi Platform',
        icon: Settings,
        searchKey: 'setting',
        data: [
          { setting: 'Registrasi tenant baru', value: 'Manual approval', owner: 'Operations', status: 'Aktif' },
          { setting: 'Retensi audit log', value: '180 hari', owner: 'Security', status: 'Aktif' },
          { setting: 'Mode maintenance', value: 'Nonaktif', owner: 'Engineering', status: 'Selesai' },
          { setting: 'Batas upload dokumen', value: '20 MB', owner: 'Platform', status: 'Aktif' },
        ],
        columns: [
          { header: 'Pengaturan', accessorKey: 'setting' },
          { header: 'Nilai Saat Ini', accessorKey: 'value' },
          { header: 'Pemilik', accessorKey: 'owner' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function AdminUsersPage() {
  return (
    <DashboardRoutePage
      title="Kelola Pengguna"
      description="Manajemen akun siswa, guru, staff, dan administrator sekolah dalam satu tenant."
      actionLabel="Tambah Pengguna"
      actionIcon={Users}
      stats={[
        { title: 'Total Siswa', value: '1.240', description: '36 rombel aktif', icon: GraduationCap, color: indigo },
        { title: 'Guru & Staff', value: '86', description: '74 aktif hari ini', icon: UserCheck, color: green },
        { title: 'Akun Nonaktif', value: '18', description: 'Perlu audit semester', icon: Lock, color: amber },
      ]}
      insights={[
        { title: 'Import terakhir', value: '128 akun', description: 'Data siswa baru kelas X berhasil diproses.', badge: 'Batch' },
        { title: 'Akun tanpa kelas', value: '7 siswa', description: 'Perlu dipasangkan ke rombel aktif.', badge: 'Perlu cek' },
        { title: 'Reset password', value: '12 request', description: 'Masuk dari guru dan staff selama 24 jam.', badge: 'Helpdesk' },
      ]}
      table={{
        title: 'Daftar Pengguna Terbaru',
        icon: Users,
        searchKey: 'name',
        searchPlaceholder: 'Cari nama pengguna...',
        data: [
          { name: 'Dr. Budi Santoso', email: 'budi.santoso@sekolah.sch.id', role: 'GURU', group: 'Kimia', status: 'Aktif' },
          { name: 'Rian Hidayat', email: 'rian.hidayat@sekolah.sch.id', role: 'SISWA', group: 'XI IPA 1', status: 'Aktif' },
          { name: 'Lia Lestari', email: 'lia.lestari@sekolah.sch.id', role: 'STAFF', group: 'Keuangan', status: 'Belum Aktif' },
          { name: 'Maya Putri', email: 'maya.putri@sekolah.sch.id', role: 'SISWA', group: 'X IPS 2', status: 'Aktif' },
        ],
        columns: [
          { header: 'Nama', accessorKey: 'name' },
          { header: 'Email', accessorKey: 'email' },
          { header: 'Role', render: (row) => <StatusBadge label={text(row, 'role')} /> },
          { header: 'Kelas/Unit', accessorKey: 'group' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function AdminClassesPage() {
  return (
    <DashboardRoutePage
      title="Kelola Kelas"
      description="Atur rombel, wali kelas, jumlah siswa, dan relasi mata pelajaran untuk tahun ajaran berjalan."
      actionLabel="Tambah Kelas"
      actionIcon={BookOpen}
      stats={[
        { title: 'Rombel Aktif', value: '36 Kelas', description: 'X, XI, dan XII', icon: BookOpen, color: violet },
        { title: 'Siswa Terpetakan', value: '98.7%', description: '16 siswa perlu validasi', icon: Users, color: green },
        { title: 'Wali Kelas', value: '36 Guru', description: 'Semua rombel terisi', icon: UserCheck, color: blue },
      ]}
      insights={[
        { title: 'Kapasitas rata-rata', value: '34 siswa', description: 'Masih dalam standar operasional sekolah.', badge: 'Normal' },
        { title: 'Kelas penuh', value: '4 rombel', description: 'Perlu pantau saat mutasi siswa masuk.', badge: 'Pantau' },
        { title: 'Sinkron jadwal', value: '92%', description: 'Beberapa mapel pilihan belum lengkap.', badge: 'Proses' },
      ]}
      table={{
        title: 'Daftar Rombel',
        icon: BookOpen,
        searchKey: 'className',
        searchPlaceholder: 'Cari kelas...',
        data: [
          { className: 'X IPA 1', homeroom: 'Siti Aminah, S.Pd', students: '34 Siswa', program: 'IPA', status: 'Aktif' },
          { className: 'XI IPA 2', homeroom: 'Dr. Budi Santoso', students: '30 Siswa', program: 'IPA', status: 'Aktif' },
          { className: 'XI IPS 1', homeroom: 'Rahmat Fadli, S.E', students: '36 Siswa', program: 'IPS', status: 'Aktif' },
          { className: 'XII Bahasa', homeroom: 'Nadia Putri, S.Pd', students: '28 Siswa', program: 'Bahasa', status: 'Aktif' },
        ],
        columns: [
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Wali Kelas', accessorKey: 'homeroom' },
          { header: 'Jumlah Siswa', accessorKey: 'students' },
          { header: 'Program', accessorKey: 'program' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function AdminAttendancePage() {
  return (
    <DashboardRoutePage
      title="Kehadiran Sekolah"
      description="Monitoring presensi seluruh siswa dan guru, termasuk keterlambatan dan rekap per kelas."
      actionLabel="Export Presensi"
      actionIcon={CalendarCheck}
      stats={[
        { title: 'Kehadiran Hari Ini', value: '96.2%', description: '1.192 dari 1.240 siswa hadir', icon: CalendarCheck, color: green },
        { title: 'Terlambat', value: '31 Siswa', description: 'Mayoritas kelas X', icon: Clock, color: amber },
        { title: 'Izin/Sakit', value: '17 Siswa', description: 'Sudah diverifikasi wali kelas', icon: FileText, color: blue },
      ]}
      insights={[
        { title: 'Kelas terbaik', value: 'XI IPA 2', description: 'Kehadiran 100% selama tiga hari berturut-turut.', badge: 'Apresiasi', badgeVariant: 'success' },
        { title: 'Jam ramai', value: '06.45', description: 'Puncak check-in siswa melalui presensi mandiri.', badge: 'Insight' },
        { title: 'Perlu tindak lanjut', value: '8 siswa', description: 'Tidak hadir tanpa keterangan lebih dari dua kali.', badge: 'Prioritas' },
      ]}
      table={{
        title: 'Rekap Presensi Per Kelas',
        icon: CalendarCheck,
        searchKey: 'className',
        data: [
          { className: 'X IPA 1', present: '33/34', late: '2', absent: '1', status: 'Hadir Baik' },
          { className: 'XI IPA 2', present: '30/30', late: '0', absent: '0', status: 'Hadir Baik' },
          { className: 'XI IPS 1', present: '32/36', late: '5', absent: '4', status: 'Perlu Pantau' },
          { className: 'XII Bahasa', present: '27/28', late: '1', absent: '1', status: 'Hadir Baik' },
        ],
        columns: [
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Hadir', accessorKey: 'present' },
          { header: 'Terlambat', accessorKey: 'late' },
          { header: 'Tidak Hadir', accessorKey: 'absent' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function AdminSettingsPage() {
  return (
    <DashboardRoutePage
      title="Pengaturan Sekolah"
      description="Kelola profil tenant sekolah, konfigurasi akademik, presensi, dan preferensi notifikasi."
      actionLabel="Simpan Pengaturan"
      actionIcon={Settings}
      stats={[
        { title: 'Profil Sekolah', value: 'Lengkap', description: 'Identitas dan kontak tervalidasi', icon: School, color: green },
        { title: 'Tahun Ajaran', value: '2025/2026', description: 'Semester genap aktif', icon: CalendarCheck, color: indigo },
        { title: 'Template Aktif', value: '6 Template', description: 'Notifikasi dan invoice', icon: Bell, color: amber },
      ]}
      insights={[
        { title: 'Radius presensi', value: '150 meter', description: 'Diterapkan untuk check-in siswa dan guru.', badge: 'GPS' },
        { title: 'Jam masuk', value: '07.00 WIB', description: 'Lewat jam ini ditandai terlambat otomatis.', badge: 'Aktif' },
        { title: 'Verifikasi SPP', value: 'Manual', description: 'Staff tetap memvalidasi transfer sebelum lunas.', badge: 'Keuangan' },
      ]}
      table={{
        title: 'Daftar Konfigurasi Tenant',
        icon: Settings,
        searchKey: 'setting',
        data: [
          { setting: 'Nama sekolah', value: 'SMA Negeri 1 Jakarta', module: 'Profil', status: 'Aktif' },
          { setting: 'Radius presensi', value: '150 meter', module: 'Attendance', status: 'Aktif' },
          { setting: 'Batas bayar SPP', value: 'Tanggal 10', module: 'Payment', status: 'Aktif' },
          { setting: 'Mode approval tugas', value: 'Guru mapel', module: 'Assignment', status: 'Aktif' },
        ],
        columns: [
          { header: 'Pengaturan', accessorKey: 'setting' },
          { header: 'Nilai', accessorKey: 'value' },
          { header: 'Modul', accessorKey: 'module' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function AdminPaymentsPage() {
  return (
    <DashboardRoutePage
      title="Monitoring Pembayaran"
      description="Pantau invoice SPP, realisasi pembayaran, dan status verifikasi transaksi sekolah."
      actionLabel="Export Pembayaran"
      actionIcon={CreditCard}
      stats={[
        { title: 'Realisasi Bulan Ini', value: 'Rp 498,6 Jt', description: '89.3% dari target tagihan', icon: CreditCard, color: green },
        { title: 'Invoice Pending', value: '132 Invoice', description: 'Termasuk transfer manual', icon: Receipt, color: amber },
        { title: 'Pembayaran QRIS', value: '62%', description: 'Kanal pembayaran paling aktif', icon: TrendingUp, color: indigo },
      ]}
      insights={[
        { title: 'Kelas prioritas', value: 'X IPS 1', description: 'Tunggakan paling tinggi minggu ini.', badge: 'Follow-up' },
        { title: 'Verifikasi manual', value: '8 transaksi', description: 'Menunggu validasi staff keuangan.', badge: 'Pending' },
        { title: 'Reminder', value: 'Aktif', description: 'Notifikasi jatuh tempo berjalan otomatis.', badge: 'Normal', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Rekap Pembayaran Per Kelas',
        icon: CreditCard,
        searchKey: 'className',
        data: [
          { className: 'X IPA 1', invoices: '34', paid: '31', unpaid: '3', status: 'Perlu Pantau' },
          { className: 'XI IPA 2', invoices: '30', paid: '30', unpaid: '0', status: 'Lunas' },
          { className: 'XI IPS 1', invoices: '36', paid: '29', unpaid: '7', status: 'Perlu Pantau' },
          { className: 'XII Bahasa', invoices: '28', paid: '27', unpaid: '1', status: 'Lunas' },
        ],
        columns: [
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Invoice', accessorKey: 'invoices' },
          { header: 'Lunas', accessorKey: 'paid' },
          { header: 'Belum Lunas', accessorKey: 'unpaid' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function AdminNotificationsPage() {
  return (
    <DashboardRoutePage
      title="Notifikasi Sekolah"
      description="Kelola pengumuman massal, reminder pembayaran, dan riwayat notifikasi tenant sekolah."
      actionLabel="Kirim Pengumuman"
      actionIcon={Bell}
      stats={[
        { title: 'Terkirim Hari Ini', value: '1.284 Pesan', description: 'In-app, email, dan WhatsApp', icon: Bell, color: indigo },
        { title: 'Template Aktif', value: '6 Template', description: 'Akademik dan pembayaran', icon: FileText, color: green },
        { title: 'Gagal Terkirim', value: '12 Pesan', description: 'Nomor kontak perlu diperbarui', icon: ShieldAlert, color: rose },
      ]}
      insights={[
        { title: 'Reminder SPP', value: 'Aktif', description: 'Dikirim H-3 dan H+1 jatuh tempo.', badge: 'Otomatis' },
        { title: 'Pengumuman kelas', value: '18 pesan', description: 'Dikirim guru melalui modul tugas.', badge: 'Akademik' },
        { title: 'Rate sukses', value: '99.1%', description: 'Kanal in-app paling stabil.', badge: 'Baik', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Riwayat Notifikasi',
        icon: Bell,
        searchKey: 'title',
        data: [
          { title: 'Reminder SPP Mei', audience: 'Wali siswa', channel: 'In-app + WA', sent: '1.240', status: 'Selesai' },
          { title: 'Jadwal Ujian Akhir', audience: 'Siswa kelas XII', channel: 'In-app', sent: '280', status: 'Selesai' },
          { title: 'Validasi Data Siswa', audience: 'Wali kelas', channel: 'Email', sent: '36', status: 'Selesai' },
          { title: 'Maintenance Sistem', audience: 'Guru & Staff', channel: 'In-app', sent: '86', status: 'Proses' },
        ],
        columns: [
          { header: 'Judul', accessorKey: 'title' },
          { header: 'Audiens', accessorKey: 'audience' },
          { header: 'Kanal', accessorKey: 'channel' },
          { header: 'Terkirim', accessorKey: 'sent' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function AdminReportsPage() {
  return (
    <DashboardRoutePage
      title="Laporan Sekolah"
      description="Kompilasi laporan presensi, pembayaran, akademik, dan aktivitas operasional sekolah."
      actionLabel="Unduh Paket Laporan"
      actionIcon={FileText}
      stats={[
        { title: 'Laporan Siap', value: '12 Dokumen', description: 'Semester genap berjalan', icon: FileText, color: blue },
        { title: 'Data Lengkap', value: '96.8%', description: 'Presensi dan pembayaran tersinkron', icon: CheckCircle, color: green },
        { title: 'Perlu Review', value: '3 Laporan', description: 'Menunggu validasi admin', icon: Clock, color: amber },
      ]}
      insights={[
        { title: 'Paket bulanan', value: 'Mei 2026', description: 'Presensi dan SPP sudah dapat diekspor.', badge: 'Ready', badgeVariant: 'success' },
        { title: 'Data kurang', value: '4 kelas', description: 'Nilai akademik belum final.', badge: 'Review' },
        { title: 'Tujuan laporan', value: 'Manajemen', description: 'Format ringkas untuk kepala sekolah.', badge: 'Internal' },
      ]}
      table={{
        title: 'Daftar Laporan',
        icon: FileText,
        searchKey: 'report',
        data: [
          { report: 'Laporan Presensi Bulanan', period: 'Mei 2026', owner: 'Admin IT', status: 'Selesai' },
          { report: 'Laporan Pembayaran SPP', period: 'Mei 2026', owner: 'Staff Keuangan', status: 'Selesai' },
          { report: 'Laporan Akademik Tengah Semester', period: 'Genap 2026', owner: 'Kurikulum', status: 'Proses' },
          { report: 'Laporan Aktivitas Sistem', period: 'Mingguan', owner: 'Admin IT', status: 'Selesai' },
        ],
        columns: [
          { header: 'Laporan', accessorKey: 'report' },
          { header: 'Periode', accessorKey: 'period' },
          { header: 'Penanggung Jawab', accessorKey: 'owner' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function HeadmasterAttendancePage() {
  return (
    <DashboardRoutePage
      title="Laporan Kehadiran"
      description="Analisis tren kehadiran siswa, guru, dan staff untuk kebutuhan evaluasi manajemen sekolah."
      actionLabel="Unduh Laporan"
      actionIcon={TrendingUp}
      stats={[
        { title: 'Kehadiran Siswa', value: '96.2%', description: '+1.1% dibanding pekan lalu', icon: GraduationCap, color: green },
        { title: 'Kehadiran Guru', value: '98.8%', description: 'Semua jam mengajar terpenuhi', icon: UserCheck, color: indigo },
        { title: 'Terlambat Berulang', value: '12 Siswa', description: 'Butuh pembinaan BK', icon: Clock, color: amber },
      ]}
      insights={[
        { title: 'Tren bulanan', value: 'Naik 2.4%', description: 'Program disiplin pagi menunjukkan hasil positif.', badge: 'Positif', badgeVariant: 'success' },
        { title: 'Kelas prioritas', value: 'XI IPS 1', description: 'Tingkat terlambat tertinggi dalam tujuh hari.', badge: 'Pantau' },
        { title: 'Rekomendasi', value: 'Briefing wali kelas', description: 'Fokus pada siswa dengan absen tanpa keterangan.', badge: 'Aksi' },
      ]}
      table={{
        title: 'Ringkasan Kehadiran Mingguan',
        icon: CalendarCheck,
        searchKey: 'unit',
        data: [
          { unit: 'Kelas X', attendance: '95.4%', late: '18 siswa', absence: '9 siswa', status: 'Perlu Pantau' },
          { unit: 'Kelas XI', attendance: '97.1%', late: '9 siswa', absence: '6 siswa', status: 'Hadir Baik' },
          { unit: 'Kelas XII', attendance: '96.8%', late: '4 siswa', absence: '5 siswa', status: 'Hadir Baik' },
          { unit: 'Guru & Staff', attendance: '98.8%', late: '2 orang', absence: '1 orang', status: 'Hadir Baik' },
        ],
        columns: [
          { header: 'Unit', accessorKey: 'unit' },
          { header: 'Kehadiran', accessorKey: 'attendance' },
          { header: 'Terlambat', accessorKey: 'late' },
          { header: 'Tidak Hadir', accessorKey: 'absence' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function HeadmasterFinancePage() {
  return (
    <DashboardRoutePage
      title="Laporan Keuangan"
      description="Ringkasan realisasi SPP, tunggakan, dan proyeksi kas sekolah dari modul pembayaran."
      actionLabel="Export Keuangan"
      actionIcon={CreditCard}
      stats={[
        { title: 'Realisasi Bulan Ini', value: 'Rp 106,08 Jt', description: '88.4% dari target', icon: CreditCard, color: green },
        { title: 'Tunggakan Aktif', value: 'Rp 13,92 Jt', description: '31 invoice belum lunas', icon: Receipt, color: rose },
        { title: 'Proyeksi Semester', value: 'Rp 686 Jt', description: 'Berdasarkan tren pembayaran', icon: TrendingUp, color: indigo },
      ]}
      insights={[
        { title: 'Target bulanan', value: '88.4%', description: 'Masih perlu follow-up wali kelas untuk 31 invoice.', badge: 'Pantau' },
        { title: 'Metode favorit', value: 'QRIS', description: '62% pembayaran masuk lewat kanal QRIS.', badge: 'Digital' },
        { title: 'Risiko kas', value: 'Rendah', description: 'Arus masuk masih cukup untuk operasional bulanan.', badge: 'Aman', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Rekap SPP Semester Genap',
        icon: CreditCard,
        searchKey: 'month',
        data: [
          { month: 'Januari 2026', target: 'Rp 120.000.000', actual: 'Rp 118.500.000', unpaid: 'Rp 1.500.000', status: 'Lunas Baik' },
          { month: 'Februari 2026', target: 'Rp 120.000.000', actual: 'Rp 115.200.000', unpaid: 'Rp 4.800.000', status: 'Lunas Baik' },
          { month: 'Maret 2026', target: 'Rp 120.000.000', actual: 'Rp 109.800.000', unpaid: 'Rp 10.200.000', status: 'Perlu Pantau' },
          { month: 'April 2026', target: 'Rp 120.000.000', actual: 'Rp 106.080.000', unpaid: 'Rp 13.920.000', status: 'Perlu Pantau' },
        ],
        columns: [
          { header: 'Bulan', accessorKey: 'month' },
          { header: 'Target', accessorKey: 'target' },
          { header: 'Realisasi', accessorKey: 'actual' },
          { header: 'Tunggakan', accessorKey: 'unpaid' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function HeadmasterEvaluationPage() {
  return (
    <DashboardRoutePage
      title="Evaluasi Akademik"
      description="Pantau capaian nilai, progres penugasan, dan indikator akademik per jenjang."
      actionLabel="Buat Catatan Evaluasi"
      actionIcon={Award}
      stats={[
        { title: 'Rata-rata Akademik', value: '84.8', description: '+0.9 dari semester lalu', icon: Award, color: violet },
        { title: 'Tugas Tuntas', value: '92.6%', description: 'Semua mapel inti', icon: FileText, color: green },
        { title: 'Kelas Perlu Intervensi', value: '3 Rombel', description: 'Nilai mapel inti menurun', icon: BookOpen, color: amber },
      ]}
      insights={[
        { title: 'Mapel terbaik', value: 'Bahasa Indonesia', description: 'Rata-rata lintas jenjang mencapai 88.2.', badge: 'Unggul', badgeVariant: 'success' },
        { title: 'Fokus akademik', value: 'Matematika X', description: 'Butuh program remedial terstruktur.', badge: 'Prioritas' },
        { title: 'Kepatuhan tugas', value: '92.6%', description: 'Pengumpulan digital mulai stabil.', badge: 'Baik' },
      ]}
      table={{
        title: 'Rekap Evaluasi Per Jenjang',
        icon: Award,
        searchKey: 'grade',
        data: [
          { grade: 'Kelas X', score: '82.4', assignments: '89.1%', risk: 'Matematika', status: 'Perlu Pantau' },
          { grade: 'Kelas XI', score: '85.7', assignments: '94.8%', risk: 'Kimia', status: 'Hadir Baik' },
          { grade: 'Kelas XII', score: '86.1', assignments: '93.9%', risk: 'Ekonomi', status: 'Hadir Baik' },
          { grade: 'Lintas Jenjang', score: '84.8', assignments: '92.6%', risk: '3 Rombel', status: 'Aktif' },
        ],
        columns: [
          { header: 'Jenjang', accessorKey: 'grade' },
          { header: 'Rata-rata Nilai', accessorKey: 'score' },
          { header: 'Tugas Tuntas', accessorKey: 'assignments' },
          { header: 'Area Risiko', accessorKey: 'risk' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function HeadmasterReportsPage() {
  return (
    <DashboardRoutePage
      title="Laporan Sekolah"
      description="Gabungan laporan akademik, keuangan, dan kehadiran untuk kebutuhan keputusan kepala sekolah."
      actionLabel="Unduh Ringkasan Eksekutif"
      actionIcon={FileText}
      stats={[
        { title: 'Laporan Siap Dibaca', value: '9 Laporan', description: 'Update sampai hari ini', icon: FileText, color: blue },
        { title: 'Indikator Sehat', value: '14/18', description: 'Mayoritas target terpenuhi', icon: CheckCircle, color: green },
        { title: 'Butuh Keputusan', value: '4 Item', description: 'Akademik dan pembayaran', icon: ShieldAlert, color: amber },
      ]}
      insights={[
        { title: 'Prioritas minggu ini', value: 'SPP tertunggak', description: '31 invoice perlu strategi follow-up.', badge: 'Keuangan' },
        { title: 'Akademik', value: '3 rombel', description: 'Perlu program remedial terarah.', badge: 'Evaluasi' },
        { title: 'Kehadiran', value: 'Membaik', description: 'Tren naik 2.4% dari bulan lalu.', badge: 'Positif', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Ringkasan Laporan Manajemen',
        icon: FileText,
        searchKey: 'topic',
        data: [
          { topic: 'Kehadiran Siswa', metric: '96.2%', owner: 'Wakasek Kesiswaan', status: 'Hadir Baik' },
          { topic: 'Realisasi SPP', metric: '88.4%', owner: 'Staff Keuangan', status: 'Perlu Pantau' },
          { topic: 'Rata-rata Akademik', metric: '84.8', owner: 'Kurikulum', status: 'Aktif' },
          { topic: 'Kepatuhan Tugas', metric: '92.6%', owner: 'Koordinator Guru', status: 'Hadir Baik' },
        ],
        columns: [
          { header: 'Topik', accessorKey: 'topic' },
          { header: 'Metrik', accessorKey: 'metric' },
          { header: 'Penanggung Jawab', accessorKey: 'owner' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function TeacherAttendancePage() {
  return (
    <DashboardRoutePage
      title="Kehadiran Kelas"
      description="Kelola presensi kelas yang Anda ampu dan pantau siswa yang terlambat atau belum hadir."
      actionLabel="Input Presensi"
      actionIcon={CalendarCheck}
      stats={[
        { title: 'Hadir Hari Ini', value: '98.5%', description: '118 dari 120 siswa', icon: CalendarCheck, color: green },
        { title: 'Belum Check-in', value: '2 Siswa', description: 'Menunggu konfirmasi', icon: Clock, color: amber },
        { title: 'Kelas Diampu', value: '4 Rombel', description: 'Kimia XI IPA', icon: BookOpen, color: violet },
      ]}
      insights={[
        { title: 'Kelas terbaik', value: 'XI IPA 2', description: 'Presensi lengkap di jam pertama.', badge: '100%', badgeVariant: 'success' },
        { title: 'Siswa terlambat', value: '3 siswa', description: 'Perlu catatan sebelum akhir pekan.', badge: 'Catatan' },
        { title: 'Sinkron wali kelas', value: 'Aktif', description: 'Rekap dapat dilihat kepala sekolah.', badge: 'Realtime' },
      ]}
      table={{
        title: 'Presensi Kelas Hari Ini',
        icon: CalendarCheck,
        searchKey: 'student',
        searchPlaceholder: 'Cari siswa...',
        data: [
          { student: 'Adit Pratama', className: 'XI IPA 1', time: '06:48', method: 'GPS Mobile', status: 'Hadir' },
          { student: 'Lulu Nurhaliza', className: 'XI IPA 2', time: '06:55', method: 'GPS Mobile', status: 'Hadir' },
          { student: 'Rendra Setiawan', className: 'XI IPA 1', time: '07:14', method: 'Manual Guru', status: 'Terlambat' },
          { student: 'Maya Putri', className: 'XI IPA 2', time: '-', method: 'Belum ada', status: 'Belum Hadir' },
        ],
        columns: [
          { header: 'Siswa', accessorKey: 'student' },
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Jam', accessorKey: 'time' },
          { header: 'Metode', accessorKey: 'method' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function TeacherAssignmentsPage() {
  return (
    <DashboardRoutePage
      title="Kelola Tugas"
      description="Buat, pantau, dan arsipkan penugasan digital untuk kelas dan mata pelajaran yang Anda ampu."
      actionLabel="Buat Tugas Baru"
      actionIcon={FileText}
      stats={[
        { title: 'Tugas Aktif', value: '8 Tugas', description: '4 mendekati deadline', icon: FileText, color: indigo },
        { title: 'Belum Dinilai', value: '14 Pengumpulan', description: 'Prioritas minggu ini', icon: Clock, color: amber },
        { title: 'Tuntas Dinilai', value: '86.4%', description: 'Semester berjalan', icon: CheckCircle, color: green },
      ]}
      insights={[
        { title: 'Deadline dekat', value: '2 tugas', description: 'Jatuh tempo dalam 48 jam.', badge: 'Segera' },
        { title: 'Kelas aktif', value: 'XI IPA 2', description: 'Pengumpulan paling cepat dan lengkap.', badge: 'Baik', badgeVariant: 'success' },
        { title: 'Draft materi', value: '3 item', description: 'Belum dipublikasikan ke siswa.', badge: 'Draft' },
      ]}
      table={{
        title: 'Daftar Penugasan',
        icon: FileText,
        searchKey: 'title',
        searchPlaceholder: 'Cari tugas...',
        data: [
          { title: 'Eksperimen Kimia Organik', className: 'XI IPA 2', due: '28 Mei 2026', submitted: '28/30', status: 'Aktif' },
          { title: 'Stoikiometri Larutan', className: 'XI IPA 1', due: '25 Mei 2026', submitted: '30/30', status: 'Selesai' },
          { title: 'Reaksi Redoks', className: 'XI IPA 2', due: '30 Mei 2026', submitted: '12/30', status: 'Aktif' },
          { title: 'Kuis Kesetimbangan', className: 'XI IPA 1', due: 'Draft', submitted: '0/30', status: 'Proses' },
        ],
        columns: [
          { header: 'Judul', accessorKey: 'title' },
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Deadline', accessorKey: 'due' },
          { header: 'Terkumpul', accessorKey: 'submitted' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function TeacherGradesPage() {
  return (
    <DashboardRoutePage
      title="Penilaian Siswa"
      description="Pantau nilai tugas, ulangan, dan siswa yang perlu remedial pada mata pelajaran Anda."
      actionLabel="Input Nilai"
      actionIcon={Award}
      stats={[
        { title: 'Rata-rata Nilai', value: '86.2', description: 'Kimia XI IPA', icon: Award, color: violet },
        { title: 'Remedial', value: '9 Siswa', description: 'Nilai di bawah KKM', icon: ShieldAlert, color: rose },
        { title: 'Belum Dinilai', value: '14 Berkas', description: 'Dari 2 tugas aktif', icon: FileText, color: amber },
      ]}
      insights={[
        { title: 'KKM mapel', value: '75', description: 'Digunakan untuk penanda remedial otomatis.', badge: 'Standar' },
        { title: 'Topik sulit', value: 'Redoks', description: 'Rata-rata kuis terendah semester ini.', badge: 'Review' },
        { title: 'Kelas unggul', value: 'XI IPA 2', description: 'Rata-rata kelas 88.7.', badge: 'Baik', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Rekap Nilai Siswa',
        icon: Award,
        searchKey: 'student',
        data: [
          { student: 'Adit Pratama', className: 'XI IPA 1', assignment: 'Stoikiometri', score: '92', status: 'Selesai' },
          { student: 'Lulu Nurhaliza', className: 'XI IPA 2', assignment: 'Stoikiometri', score: '88', status: 'Selesai' },
          { student: 'Rendra Setiawan', className: 'XI IPA 1', assignment: 'Reaksi Redoks', score: '68', status: 'Perlu Remedial' },
          { student: 'Maya Putri', className: 'XI IPA 2', assignment: 'Eksperimen Organik', score: '-', status: 'Belum Dinilai' },
        ],
        columns: [
          { header: 'Siswa', accessorKey: 'student' },
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Penilaian', accessorKey: 'assignment' },
          { header: 'Nilai', accessorKey: 'score' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function TeacherClassesPage() {
  return (
    <DashboardRoutePage
      title="Kelas Saya"
      description="Pantau rombel yang Anda ampu, daftar siswa, jadwal mengajar, dan progres akademik tiap kelas."
      actionLabel="Lihat Jadwal Mengajar"
      actionIcon={BookOpen}
      stats={[
        { title: 'Rombel Diampu', value: '4 Kelas', description: 'XI IPA dan kelas lintas minat', icon: BookOpen, color: violet },
        { title: 'Total Siswa', value: '120 Siswa', description: 'Semua aktif semester ini', icon: Users, color: indigo },
        { title: 'Kelas Lengkap', value: '3/4', description: 'Satu kelas perlu update roster', icon: UserCheck, color: green },
      ]}
      insights={[
        { title: 'Kelas aktif', value: 'XI IPA 2', description: 'Pengumpulan tugas paling lengkap.', badge: 'Unggul', badgeVariant: 'success' },
        { title: 'Roster', value: '1 pending', description: 'Mutasi siswa belum masuk jadwal mapel.', badge: 'Cek' },
        { title: 'Jadwal padat', value: 'Rabu', description: 'Tiga sesi mengajar berurutan.', badge: 'Info' },
      ]}
      table={{
        title: 'Daftar Kelas Diampu',
        icon: BookOpen,
        searchKey: 'className',
        data: [
          { className: 'XI IPA 1', subject: 'Kimia', students: '30 Siswa', schedule: 'Senin 08.00', status: 'Aktif' },
          { className: 'XI IPA 2', subject: 'Kimia', students: '30 Siswa', schedule: 'Selasa 10.00', status: 'Aktif' },
          { className: 'X IPA 1', subject: 'Kimia Dasar', students: '34 Siswa', schedule: 'Rabu 07.00', status: 'Aktif' },
          { className: 'XII IPA 3', subject: 'Praktikum', students: '26 Siswa', schedule: 'Kamis 09.30', status: 'Proses' },
        ],
        columns: [
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Mapel', accessorKey: 'subject' },
          { header: 'Jumlah Siswa', accessorKey: 'students' },
          { header: 'Jadwal', accessorKey: 'schedule' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function TeacherNotificationsPage() {
  return (
    <DashboardRoutePage
      title="Notifikasi"
      description="Lihat pengumuman sekolah, reminder tugas, dan pesan kelas yang relevan dengan aktivitas mengajar."
      actionLabel="Buat Pengumuman Kelas"
      actionIcon={Bell}
      stats={[
        { title: 'Belum Dibaca', value: '5 Pesan', description: 'Mayoritas dari admin sekolah', icon: Bell, color: amber },
        { title: 'Pengumuman Kelas', value: '12 Pesan', description: 'Dikirim semester ini', icon: FileText, color: indigo },
        { title: 'Reminder Tugas', value: '4 Aktif', description: 'Deadline 7 hari ke depan', icon: Clock, color: rose },
      ]}
      insights={[
        { title: 'Pesan prioritas', value: 'Jadwal ujian', description: 'Butuh konfirmasi distribusi materi.', badge: 'Prioritas' },
        { title: 'Kanal kelas', value: 'Aktif', description: 'Siswa menerima notifikasi tugas otomatis.', badge: 'Aktif', badgeVariant: 'success' },
        { title: 'Riwayat', value: '30 hari', description: 'Notifikasi lama tetap dapat dicari.', badge: 'Arsip' },
      ]}
      table={{
        title: 'Riwayat Notifikasi Guru',
        icon: Bell,
        searchKey: 'title',
        data: [
          { title: 'Jadwal Ujian Semester', source: 'Admin IT', audience: 'Guru', status: 'Belum Dibaca' },
          { title: 'Deadline Input Nilai', source: 'Kurikulum', audience: 'Guru Mapel', status: 'Aktif' },
          { title: 'Pengumuman Praktikum', source: 'Anda', audience: 'XI IPA 2', status: 'Selesai' },
          { title: 'Reminder Tugas Redoks', source: 'Sistem', audience: 'XI IPA 1', status: 'Aktif' },
        ],
        columns: [
          { header: 'Judul', accessorKey: 'title' },
          { header: 'Sumber', accessorKey: 'source' },
          { header: 'Audiens', accessorKey: 'audience' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StaffInvoicesPage() {
  return (
    <DashboardRoutePage
      title="Kelola Invoices SPP"
      description="Kelola pembuatan invoice SPP, status pembayaran, dan verifikasi transfer manual."
      actionLabel="Buat Invoice"
      actionIcon={Receipt}
      stats={[
        { title: 'Invoice Bulan Ini', value: '1.240', description: 'Semua siswa aktif', icon: Receipt, color: indigo },
        { title: 'Sudah Lunas', value: '1.108', description: '89.3% pembayaran masuk', icon: CheckCircle, color: green },
        { title: 'Menunggu Verifikasi', value: '8', description: 'Transfer manual', icon: Clock, color: amber },
      ]}
      insights={[
        { title: 'Total masuk', value: 'Rp 498,6 Jt', description: 'Termasuk pembayaran QRIS dan bank transfer.', badge: 'Bulan ini' },
        { title: 'Tunggakan', value: '132 invoice', description: 'Perlu reminder bertahap ke wali siswa.', badge: 'Follow-up' },
        { title: 'Auto-reminder', value: 'Aktif', description: 'Dikirim H-3 dan H+1 jatuh tempo.', badge: 'Notifikasi' },
      ]}
      table={{
        title: 'Daftar Invoice Terbaru',
        icon: Receipt,
        searchKey: 'student',
        data: [
          { student: 'Adit Pratama', className: 'XI IPA 1', invoice: 'SPP-2026-05-128', amount: 'Rp 450.000', status: 'Lunas' },
          { student: 'Lulu Nurhaliza', className: 'XI IPA 2', invoice: 'SPP-2026-05-392', amount: 'Rp 450.000', status: 'Pending' },
          { student: 'Rendra Setiawan', className: 'X IPS 1', invoice: 'SPP-2026-05-021', amount: 'Rp 450.000', status: 'Belum Lunas' },
          { student: 'Maya Putri', className: 'XII Bahasa', invoice: 'SPP-2026-05-777', amount: 'Rp 450.000', status: 'Lunas' },
        ],
        columns: [
          { header: 'Siswa', accessorKey: 'student' },
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Invoice', accessorKey: 'invoice' },
          { header: 'Nominal', accessorKey: 'amount' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StaffAttendancePage() {
  return (
    <DashboardRoutePage
      title="Presensi Siswa"
      description="Bantu validasi presensi siswa, data izin/sakit, dan laporan kehadiran harian untuk administrasi."
      actionLabel="Validasi Presensi"
      actionIcon={CalendarCheck}
      stats={[
        { title: 'Data Masuk', value: '1.224 Record', description: 'Per hari ini', icon: CalendarCheck, color: green },
        { title: 'Perlu Validasi', value: '19 Record', description: 'Izin, sakit, dan manual input', icon: FileText, color: amber },
        { title: 'Tanpa Keterangan', value: '8 Siswa', description: 'Butuh follow-up wali kelas', icon: ShieldAlert, color: rose },
      ]}
      insights={[
        { title: 'Input manual', value: '11 record', description: 'Sebagian dari siswa tanpa perangkat.', badge: 'Validasi' },
        { title: 'Dokumen izin', value: '8 file', description: 'Surat sakit dan izin keluarga.', badge: 'Lampiran' },
        { title: 'Rekap harian', value: 'Siap export', description: 'Format laporan kepala sekolah tersedia.', badge: 'Ready', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Data Presensi Perlu Validasi',
        icon: CalendarCheck,
        searchKey: 'student',
        data: [
          { student: 'Rendra Setiawan', className: 'X IPS 1', note: 'Izin keluarga', source: 'Wali kelas', status: 'Pending' },
          { student: 'Maya Putri', className: 'XII Bahasa', note: 'Surat sakit', source: 'Upload orang tua', status: 'Pending' },
          { student: 'Fajar Ramadhan', className: 'XI IPA 1', note: 'Check-in manual', source: 'Guru piket', status: 'Hadir' },
          { student: 'Nabila Safira', className: 'X IPA 2', note: 'Tanpa keterangan', source: 'Sistem', status: 'Belum Hadir' },
        ],
        columns: [
          { header: 'Siswa', accessorKey: 'student' },
          { header: 'Kelas', accessorKey: 'className' },
          { header: 'Catatan', accessorKey: 'note' },
          { header: 'Sumber', accessorKey: 'source' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StaffSettingsPage() {
  return (
    <DashboardRoutePage
      title="Pengaturan SPP"
      description="Atur nominal SPP, jadwal jatuh tempo, denda, dan template reminder pembayaran."
      actionLabel="Simpan Draft SPP"
      actionIcon={Settings}
      stats={[
        { title: 'Nominal Default', value: 'Rp 450.000', description: 'Per siswa per bulan', icon: CreditCard, color: indigo },
        { title: 'Jatuh Tempo', value: 'Tanggal 10', description: 'Reminder otomatis aktif', icon: CalendarCheck, color: amber },
        { title: 'Template Reminder', value: '5 Aktif', description: 'WA, email, dan in-app', icon: Bell, color: green },
      ]}
      insights={[
        { title: 'Denda aktif', value: 'Rp 25.000', description: 'Diterapkan setelah H+7 jatuh tempo.', badge: 'Policy' },
        { title: 'Keringanan', value: '12 siswa', description: 'Masuk daftar subsidi internal sekolah.', badge: 'Khusus' },
        { title: 'QRIS', value: 'Aktif', description: 'Simulasi pembayaran tersedia di FE.', badge: 'Digital', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Konfigurasi Pembayaran',
        icon: Settings,
        searchKey: 'setting',
        data: [
          { setting: 'Nominal SPP reguler', value: 'Rp 450.000', appliesTo: 'Semua jenjang', status: 'Aktif' },
          { setting: 'Batas jatuh tempo', value: 'Tanggal 10', appliesTo: 'Bulanan', status: 'Aktif' },
          { setting: 'Denda keterlambatan', value: 'Rp 25.000', appliesTo: 'H+7', status: 'Aktif' },
          { setting: 'Keringanan pembayaran', value: 'Manual approval', appliesTo: 'Kasus khusus', status: 'Aktif' },
        ],
        columns: [
          { header: 'Pengaturan', accessorKey: 'setting' },
          { header: 'Nilai', accessorKey: 'value' },
          { header: 'Berlaku Untuk', accessorKey: 'appliesTo' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StaffNotificationsPage() {
  return (
    <DashboardRoutePage
      title="Notifikasi"
      description="Pantau reminder administrasi, pengumuman sekolah, dan pesan terkait verifikasi pembayaran."
      actionLabel="Tandai Semua Dibaca"
      actionIcon={Bell}
      stats={[
        { title: 'Belum Dibaca', value: '7 Pesan', description: 'Keuangan dan operasional', icon: Bell, color: amber },
        { title: 'Reminder Invoice', value: '18 Aktif', description: 'Butuh follow-up pembayaran', icon: Receipt, color: indigo },
        { title: 'Pengumuman Sekolah', value: '4 Pesan', description: 'Dalam tujuh hari terakhir', icon: FileText, color: blue },
      ]}
      insights={[
        { title: 'Prioritas', value: 'Verifikasi manual', description: '8 pembayaran menunggu konfirmasi.', badge: 'Keuangan' },
        { title: 'SLA', value: '3 jam', description: 'Rata-rata respons pesan staff.', badge: 'Baik', badgeVariant: 'success' },
        { title: 'Template', value: '5 aktif', description: 'Reminder SPP siap digunakan.', badge: 'Aktif' },
      ]}
      table={{
        title: 'Riwayat Notifikasi Staff',
        icon: Bell,
        searchKey: 'title',
        data: [
          { title: 'Pembayaran manual masuk', source: 'Sistem Pembayaran', category: 'Keuangan', status: 'Pending' },
          { title: 'Reminder SPP H-3', source: 'Sistem', category: 'Invoice', status: 'Aktif' },
          { title: 'Rekap presensi harian', source: 'Admin IT', category: 'Operasional', status: 'Selesai' },
          { title: 'Validasi data wali siswa', source: 'Tata Usaha', category: 'Data', status: 'Proses' },
        ],
        columns: [
          { header: 'Judul', accessorKey: 'title' },
          { header: 'Sumber', accessorKey: 'source' },
          { header: 'Kategori', accessorKey: 'category' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StaffProfilePage() {
  return (
    <DashboardRoutePage
      title="Profil Staff"
      description="Kelola informasi akun staff, kontak administrasi, dan preferensi notifikasi operasional."
      actionLabel="Simpan Profil"
      actionIcon={UserCheck}
      stats={[
        { title: 'Status Akun', value: 'Aktif', description: 'Terhubung ke tenant sekolah', icon: UserCheck, color: green },
        { title: 'Unit Kerja', value: 'Keuangan', description: 'Akses invoice dan verifikasi SPP', icon: CreditCard, color: indigo },
        { title: 'Notifikasi', value: 'Aktif', description: 'Reminder pembayaran dan presensi', icon: Bell, color: amber },
      ]}
      insights={[
        { title: 'Login terakhir', value: 'Hari ini', description: 'Sesi dashboard aktif normal.', badge: 'Aman', badgeVariant: 'success' },
        { title: 'Kontak', value: 'Terverifikasi', description: 'Email dan nomor admin tersedia.', badge: 'Valid' },
        { title: 'Hak akses', value: 'Staff', description: 'Terbatas pada operasional administrasi.', badge: 'Role' },
      ]}
      table={{
        title: 'Detail Profil Staff',
        icon: UserCheck,
        searchKey: 'field',
        data: [
          { field: 'Nama', value: 'Lia Lestari', note: 'Staff Keuangan', status: 'Aktif' },
          { field: 'Email', value: 'lia.lestari@sekolah.sch.id', note: 'Login utama', status: 'Aktif' },
          { field: 'Unit', value: 'Keuangan', note: 'Invoice dan SPP', status: 'Aktif' },
          { field: 'Preferensi', value: 'In-app + Email', note: 'Notifikasi operasional', status: 'Aktif' },
        ],
        columns: [
          { header: 'Field', accessorKey: 'field' },
          { header: 'Nilai', accessorKey: 'value' },
          { header: 'Catatan', accessorKey: 'note' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StudentAttendancePage() {
  return (
    <DashboardRoutePage
      title="Presensi Mandiri"
      description="Lihat status presensi pribadi, riwayat check-in, dan catatan keterlambatan Anda."
      actionLabel="Check-in Simulasi"
      actionIcon={MapPin}
      stats={[
        { title: 'Kehadiran Bulan Ini', value: '98.2%', description: '1 kali izin tercatat', icon: CalendarCheck, color: green },
        { title: 'Terlambat', value: '1 Kali', description: 'Masih dalam batas pembinaan', icon: Clock, color: amber },
        { title: 'Streak Hadir', value: '12 Hari', description: 'Pertahankan sampai akhir bulan', icon: Sparkles, color: violet },
      ]}
      insights={[
        { title: 'Status hari ini', value: 'Sudah hadir', description: 'Check-in tercatat pukul 06:52 WIB.', badge: 'Hadir', badgeVariant: 'success' },
        { title: 'Lokasi', value: 'Area sekolah', description: 'Presensi berada dalam radius valid.', badge: 'GPS' },
        { title: 'Catatan BK', value: 'Tidak ada', description: 'Tidak ada pelanggaran presensi aktif.', badge: 'Aman', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Riwayat Presensi Saya',
        icon: CalendarCheck,
        searchKey: 'date',
        data: [
          { date: '24 Mei 2026', checkIn: '06:52', checkOut: '14:30', method: 'GPS Mobile', status: 'Hadir' },
          { date: '23 Mei 2026', checkIn: '06:49', checkOut: '14:28', method: 'GPS Mobile', status: 'Hadir' },
          { date: '22 Mei 2026', checkIn: '07:08', checkOut: '14:31', method: 'GPS Mobile', status: 'Terlambat' },
          { date: '21 Mei 2026', checkIn: '-', checkOut: '-', method: 'Surat izin', status: 'Izin' },
        ],
        columns: [
          { header: 'Tanggal', accessorKey: 'date' },
          { header: 'Masuk', accessorKey: 'checkIn' },
          { header: 'Pulang', accessorKey: 'checkOut' },
          { header: 'Metode', accessorKey: 'method' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StudentAssignmentsPage() {
  return (
    <DashboardRoutePage
      title="Daftar Tugas"
      description="Pantau tugas aktif, deadline, status pengumpulan, dan nilai yang sudah dirilis guru."
      actionLabel="Lihat Kalender Tugas"
      actionIcon={FileText}
      stats={[
        { title: 'Tugas Aktif', value: '5 Tugas', description: '2 perlu dikumpulkan minggu ini', icon: FileText, color: indigo },
        { title: 'Sudah Dikumpul', value: '18 Tugas', description: 'Semester berjalan', icon: CheckCircle, color: green },
        { title: 'Belum Kumpul', value: '2 Tugas', description: 'Jangan lewat deadline', icon: Clock, color: amber },
      ]}
      insights={[
        { title: 'Deadline terdekat', value: '28 Mei', description: 'Eksperimen Kimia Organik.', badge: 'Segera' },
        { title: 'Nilai terbaru', value: '92', description: 'Ulangan Stoikiometri Larutan.', badge: 'Bagus', badgeVariant: 'success' },
        { title: 'Mata pelajaran', value: '6 aktif', description: 'Semua guru sudah memakai assignment digital.', badge: 'Aktif' },
      ]}
      table={{
        title: 'Tugas Saya',
        icon: FileText,
        searchKey: 'title',
        searchPlaceholder: 'Cari tugas...',
        data: [
          { title: 'Eksperimen Kimia Organik', subject: 'Kimia', due: '28 Mei 2026', score: '-', status: 'Belum Kumpul' },
          { title: 'Stoikiometri Larutan', subject: 'Kimia', due: 'Selesai', score: '92', status: 'Selesai' },
          { title: 'Esai Revolusi Industri', subject: 'Sejarah', due: '29 Mei 2026', score: '-', status: 'Proses' },
          { title: 'Latihan Trigonometri', subject: 'Matematika', due: '30 Mei 2026', score: '-', status: 'Belum Kumpul' },
        ],
        columns: [
          { header: 'Tugas', accessorKey: 'title' },
          { header: 'Mapel', accessorKey: 'subject' },
          { header: 'Deadline', accessorKey: 'due' },
          { header: 'Nilai', accessorKey: 'score' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StudentPaymentsPage() {
  return (
    <DashboardRoutePage
      title="Riwayat Pembayaran"
      description="Lihat tagihan SPP aktif, histori pembayaran, dan status invoice bulanan Anda."
      actionLabel="Bayar via QRIS"
      actionIcon={CreditCard}
      stats={[
        { title: 'Tagihan Aktif', value: 'Rp 450.000', description: 'SPP Mei 2026', icon: CreditCard, color: rose },
        { title: 'Pembayaran Lunas', value: '4 Bulan', description: 'Semester genap', icon: CheckCircle, color: green },
        { title: 'Jatuh Tempo', value: '10 Juni', description: 'Reminder otomatis aktif', icon: Clock, color: amber },
      ]}
      insights={[
        { title: 'Invoice aktif', value: 'SPP Mei 2026', description: 'Belum ada pembayaran tercatat untuk invoice ini.', badge: 'Belum Lunas', badgeVariant: 'destructive' },
        { title: 'Metode terakhir', value: 'QRIS', description: 'Pembayaran April berhasil otomatis.', badge: 'Digital' },
        { title: 'Denda', value: 'Rp 0', description: 'Tidak ada denda berjalan.', badge: 'Aman', badgeVariant: 'success' },
      ]}
      table={{
        title: 'Histori Pembayaran SPP',
        icon: CreditCard,
        searchKey: 'invoice',
        data: [
          { invoice: 'SPP-2026-05', month: 'Mei 2026', amount: 'Rp 450.000', method: '-', status: 'Belum Lunas' },
          { invoice: 'SPP-2026-04', month: 'April 2026', amount: 'Rp 450.000', method: 'QRIS', status: 'Lunas' },
          { invoice: 'SPP-2026-03', month: 'Maret 2026', amount: 'Rp 450.000', method: 'Bank Transfer', status: 'Lunas' },
          { invoice: 'SPP-2026-02', month: 'Februari 2026', amount: 'Rp 450.000', method: 'QRIS', status: 'Lunas' },
        ],
        columns: [
          { header: 'Invoice', accessorKey: 'invoice' },
          { header: 'Bulan', accessorKey: 'month' },
          { header: 'Nominal', accessorKey: 'amount' },
          { header: 'Metode', accessorKey: 'method' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StudentNotificationsPage() {
  return (
    <DashboardRoutePage
      title="Notifikasi"
      description="Lihat pengumuman sekolah, reminder tugas, dan status pembayaran yang dikirim untuk akun siswa."
      actionLabel="Tandai Semua Dibaca"
      actionIcon={Bell}
      stats={[
        { title: 'Belum Dibaca', value: '4 Pesan', description: 'Tugas dan pembayaran', icon: Bell, color: amber },
        { title: 'Reminder Tugas', value: '2 Aktif', description: 'Deadline minggu ini', icon: FileText, color: indigo },
        { title: 'Info Pembayaran', value: '1 Invoice', description: 'SPP Mei 2026', icon: CreditCard, color: rose },
      ]}
      insights={[
        { title: 'Prioritas', value: 'Tugas Kimia', description: 'Deadline 28 Mei 2026.', badge: 'Segera' },
        { title: 'SPP', value: 'Belum lunas', description: 'Invoice aktif tersedia di menu pembayaran.', badge: 'Pembayaran' },
        { title: 'Pengumuman', value: 'Ujian akhir', description: 'Jadwal ujian sudah dikirim admin.', badge: 'Akademik' },
      ]}
      table={{
        title: 'Riwayat Notifikasi Saya',
        icon: Bell,
        searchKey: 'title',
        data: [
          { title: 'Deadline Tugas Kimia', source: 'Guru Kimia', category: 'Tugas', status: 'Aktif' },
          { title: 'Tagihan SPP Mei 2026', source: 'Keuangan', category: 'Pembayaran', status: 'Belum Lunas' },
          { title: 'Jadwal Ujian Akhir', source: 'Admin Sekolah', category: 'Akademik', status: 'Selesai' },
          { title: 'Presensi Hari Ini', source: 'Sistem', category: 'Presensi', status: 'Hadir' },
        ],
        columns: [
          { header: 'Judul', accessorKey: 'title' },
          { header: 'Sumber', accessorKey: 'source' },
          { header: 'Kategori', accessorKey: 'category' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StudentProfilePage() {
  return (
    <DashboardRoutePage
      title="Profil Siswa"
      description="Lihat data akun siswa, kelas aktif, kontak wali, dan ringkasan status akademik pribadi."
      actionLabel="Perbarui Data Kontak"
      actionIcon={UserCheck}
      stats={[
        { title: 'Kelas Aktif', value: 'XI IPA 1', description: 'Semester genap 2025/2026', icon: BookOpen, color: indigo },
        { title: 'Status Akademik', value: 'Aktif', description: 'Terdaftar pada 6 mapel', icon: GraduationCap, color: green },
        { title: 'Kontak Wali', value: 'Terverifikasi', description: 'Digunakan untuk notifikasi SPP', icon: Users, color: amber },
      ]}
      insights={[
        { title: 'NIS', value: '2026-1108', description: 'Nomor induk siswa aktif.', badge: 'Valid', badgeVariant: 'success' },
        { title: 'Wali kelas', value: 'Siti Aminah', description: 'Kontak utama untuk pembinaan kelas.', badge: 'Kelas' },
        { title: 'Pembayaran', value: '1 aktif', description: 'SPP Mei 2026 belum lunas.', badge: 'Cek' },
      ]}
      table={{
        title: 'Detail Profil Siswa',
        icon: UserCheck,
        searchKey: 'field',
        data: [
          { field: 'Nama', value: 'Rian Hidayat', note: 'Siswa aktif', status: 'Aktif' },
          { field: 'Kelas', value: 'XI IPA 1', note: 'Tahun ajaran 2025/2026', status: 'Aktif' },
          { field: 'Email', value: 'rian.hidayat@sekolah.sch.id', note: 'Login utama', status: 'Aktif' },
          { field: 'Kontak Wali', value: 'Terverifikasi', note: 'Notifikasi pembayaran', status: 'Aktif' },
        ],
        columns: [
          { header: 'Field', accessorKey: 'field' },
          { header: 'Nilai', accessorKey: 'value' },
          { header: 'Catatan', accessorKey: 'note' },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}
