'use client';

import * as React from 'react';
import {
  DashboardRoutePage,
  DashboardRow,
  StatusBadge,
  PageHeader,
} from '@/components/dashboard/dashboard-route-page';
import {
  Button,
  Card,
  CardContent,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { apiClient } from '@/lib/api-client';
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
  Eye,
  EyeOff,
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

function text(row: DashboardRow, key: string) {
  return String(row[key] ?? '');
}

function status(row: DashboardRow, key = 'status') {
  const value = text(row, key);
  const variant =
    value.includes('Aktif') || value.includes('Selesai') || value.includes('Hadir') || value.includes('Lunas')
      ? 'default'
      : value.includes('Terlambat') || value.includes('Pending') || value.includes('Proses')
      ? 'secondary'
      : value.includes('Kritis') || value.includes('Belum') || value.includes('Ditangguhkan')
      ? 'destructive'
      : 'outline';

  return <StatusBadge label={value} variant={variant} />;
}

type AttendanceStatus = 'Datang' | 'Sakit' | 'Alpa';

interface AttendanceStudentRow {
  id: string;
  student: string;
  className: string;
  subject: string;
  daily: Record<string, AttendanceStatus>;
}

const attendanceDays = ['20 Mei', '21 Mei', '22 Mei', '23 Mei', '24 Mei'];

const initialAttendanceRows: AttendanceStudentRow[] = [
  {
    id: 'adit-pratama',
    student: 'Adit Pratama',
    className: 'XI IPA 1',
    subject: 'Kimia',
    daily: { '20 Mei': 'Datang', '21 Mei': 'Datang', '22 Mei': 'Datang', '23 Mei': 'Datang', '24 Mei': 'Datang' },
  },
  {
    id: 'lulu-nurhaliza',
    student: 'Lulu Nurhaliza',
    className: 'XI IPA 1',
    subject: 'Kimia',
    daily: { '20 Mei': 'Datang', '21 Mei': 'Sakit', '22 Mei': 'Datang', '23 Mei': 'Datang', '24 Mei': 'Datang' },
  },
  {
    id: 'rendra-setiawan',
    student: 'Rendra Setiawan',
    className: 'XI IPA 1',
    subject: 'Kimia',
    daily: { '20 Mei': 'Datang', '21 Mei': 'Datang', '22 Mei': 'Datang', '23 Mei': 'Datang', '24 Mei': 'Datang' },
  },
  {
    id: 'maya-putri',
    student: 'Maya Putri',
    className: 'XI IPA 1',
    subject: 'Kimia',
    daily: { '20 Mei': 'Sakit', '21 Mei': 'Datang', '22 Mei': 'Datang', '23 Mei': 'Alpa', '24 Mei': 'Alpa' },
  },
  {
    id: 'fajar-ramadhan',
    student: 'Fajar Ramadhan',
    className: 'XI IPA 1',
    subject: 'Kimia',
    daily: { '20 Mei': 'Datang', '21 Mei': 'Datang', '22 Mei': 'Datang', '23 Mei': 'Datang', '24 Mei': 'Alpa' },
  },
];

function attendanceStatusBadge(statusValue: AttendanceStatus) {
  const variant = statusValue === 'Datang' ? 'default' : statusValue === 'Sakit' ? 'secondary' : 'destructive';
  return <StatusBadge label={statusValue} variant={variant} />;
}

function getAttendanceSummary(row: AttendanceStudentRow) {
  const statuses = Object.values(row.daily);
  const datang = statuses.filter((value) => value === 'Datang').length;
  const sakit = statuses.filter((value) => value === 'Sakit').length;
  const alpa = statuses.filter((value) => value === 'Alpa').length;
  return `${datang} datang / ${sakit} sakit / ${alpa} alpa`;
}

export function SuperAdminTenantsPage() {
  return (
    <DashboardRoutePage
      title="Kelola Tenant Sekolah"
      description="Pantau daftar sekolah, paket berlangganan, domain, dan status aktivasi tenant dalam satu panel."
      actionLabel="Tambah Sekolah"
      actionIcon={School}
      stats={[
        { title: 'Tenant Aktif', value: '34 Sekolah', description: '4 sekolah dalam onboarding', icon: School },
        { title: 'Domain Terverifikasi', value: '31 Domain', description: '3 menunggu DNS', icon: CheckCircle },
        { title: 'Paket Enterprise', value: '18 Sekolah', description: 'Kontributor revenue terbesar', icon: Landmark },
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
        { title: 'Pengguna Bulanan', value: '48.320 MAU', description: '+12.4% dari bulan lalu', icon: Users },
        { title: 'Uptime Layanan', value: '99.98%', description: 'SLA masih terpenuhi', icon: Activity },
        { title: 'Transaksi SPP', value: 'Rp 1,8 M', description: 'Lintas tenant bulan ini', icon: CreditCard },
      ]}
      insights={[
        { title: 'Peak traffic', value: '07.00-08.30', description: 'Mayoritas input kehadiran siswa terjadi sebelum jam pertama.', badge: 'Harian' },
        { title: 'API latency', value: '182 ms', description: 'Rata-rata p95 untuk request dashboard summary.', badge: 'Stabil', badgeVariant: 'default' },
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
        { title: 'Event Hari Ini', value: '1.284 Log', description: 'Termasuk login dan update data', icon: ListChecks },
        { title: 'Peringatan Keamanan', value: '6 Alert', description: '2 perlu ditinjau admin', icon: ShieldAlert },
        { title: 'Aksi Admin', value: '142 Aksi', description: 'Lima tenant paling aktif', icon: Lock },
      ]}
      insights={[
        { title: 'Login gagal', value: '24 kali', description: 'Sebagian besar dari perangkat baru staff.', badge: 'Review' },
        { title: 'Perubahan role', value: '9 event', description: 'Semua tercatat dengan actor dan timestamp.', badge: 'Tercatat', badgeVariant: 'default' },
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
        { title: 'Kebijakan Aktif', value: '12 Policy', description: 'Berlaku untuk semua tenant', icon: FileCog },
        { title: 'Integrasi Sistem', value: '7 Aktif', description: 'Payment, email, storage, dan queue', icon: Activity },
        { title: 'Notifikasi Global', value: '4 Template', description: 'Email dan in-app alert', icon: Bell },
      ]}
      insights={[
        { title: 'Maintenance', value: 'Belum dijadwalkan', description: 'Tidak ada downtime terencana minggu ini.', badge: 'Normal', badgeVariant: 'default' },
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
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  
  // State for Add User
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '', role: 'SISWA' });

  const handleToggleStatus = React.useCallback(async (user: any) => {
    const newStatus = !user.isActive;
    const actionText = newStatus ? 'mengaktifkan' : 'menonaktifkan';
    if (!confirm(`Apakah Anda yakin ingin ${actionText} akun ${user.name}?`)) return;

    setTogglingId(user.id);
    try {
      const res = await apiClient.patch<any>(`/users/${user.id}`, { isActive: newStatus });
      if (res.success) {
        fetchUsers();
      } else {
        alert(res.message || `Gagal ${actionText} akun`);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setTogglingId(null);
    }
  }, []);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/users?limit=50');
      if (res.success && res.data && res.data.items) {
        const mapped = res.data.items.map((u: any, idx: number) => {
          const mockClasses = ['Kelas 10 IPA 1', 'Kelas 11 IPA 1', 'Kelas 12 IPS 2', 'Kelas 10 IPS 1', 'Kelas 11 IPA 2'];
          const assignedClass = u.role === 'SISWA' ? (u.className || mockClasses[idx % mockClasses.length]) : (u.role === 'GURU' ? 'Tenaga Pengajar' : 'Staff Administrasi');
          const userObj = {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            group: assignedClass,
            className: assignedClass,
            isActive: u.isActive,
            status: u.isActive ? 'Aktif' : 'Nonaktif',
            onToggleStatus: () => {},
          };
          userObj.onToggleStatus = () => handleToggleStatus(userObj);
          return userObj;
        });
        setUsers(mapped);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [handleToggleStatus]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      alert('Kata sandi harus minimal 8 karakter!');
      return;
    }
    if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      alert('Kata sandi harus mengandung kombinasi huruf dan angka!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const res = await apiClient.post<any>('/users', payload);
      if (res.success) {
        setIsAddOpen(false);
        setFormData({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '', role: 'SISWA' });
        fetchUsers();
      } else {
        alert(res.message || 'Gagal menambahkan pengguna');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSiswa = users.filter(u => u.role === 'SISWA').length;
  const totalGuruStaff = users.filter(u => u.role === 'GURU' || u.role === 'STAFF').length;
  const nonaktif = users.filter(u => u.status === 'Nonaktif').length;

  const [selectedCategory, setSelectedCategory] = React.useState<'ALL' | 'SISWA' | 'GURU_STAFF' | 'NONAKTIF'>('ALL');

  const filteredUsers = React.useMemo(() => {
    if (selectedCategory === 'SISWA') {
      return users.filter(u => u.role === 'SISWA');
    }
    if (selectedCategory === 'GURU_STAFF') {
      return users.filter(u => u.role === 'GURU' || u.role === 'STAFF');
    }
    if (selectedCategory === 'NONAKTIF') {
      return users.filter(u => u.isActive === false || u.status === 'Nonaktif');
    }
    return users;
  }, [users, selectedCategory]);

  return (
    <>
      <DashboardRoutePage
        title="Kelola Pengguna"
        description="Manajemen akun siswa, guru, staff, dan administrator sekolah dalam satu tenant."
        actionLabel="Tambah Pengguna"
        actionIcon={Users}
        onAction={() => setIsAddOpen(true)}
      stats={[
        { 
          title: 'Total Siswa', 
          value: loading ? '...' : totalSiswa.toString(), 
          description: selectedCategory === 'SISWA' ? 'Filter Aktif (Klik untuk reset)' : 'Siswa terdaftar', 
          icon: GraduationCap,
          onClick: () => setSelectedCategory(prev => prev === 'SISWA' ? 'ALL' : 'SISWA'),
        },
        { 
          title: 'Guru & Staff', 
          value: loading ? '...' : totalGuruStaff.toString(), 
          description: selectedCategory === 'GURU_STAFF' ? 'Filter Aktif (Klik untuk reset)' : 'Aktif di sistem', 
          icon: UserCheck,
          onClick: () => setSelectedCategory(prev => prev === 'GURU_STAFF' ? 'ALL' : 'GURU_STAFF'),
        },
        { 
          title: 'Akun Nonaktif', 
          value: loading ? '...' : nonaktif.toString(), 
          description: selectedCategory === 'NONAKTIF' ? 'Filter Aktif (Klik untuk reset)' : 'Perlu verifikasi', 
          icon: Lock,
          onClick: () => setSelectedCategory(prev => prev === 'NONAKTIF' ? 'ALL' : 'NONAKTIF'),
        },
      ]}

      table={{
        title: selectedCategory === 'SISWA' ? 'Daftar Siswa' : selectedCategory === 'GURU_STAFF' ? 'Daftar Guru & Staff' : selectedCategory === 'NONAKTIF' ? 'Daftar Akun Nonaktif' : 'Daftar Pengguna Terbaru',
        icon: Users,
        searchKey: 'name',
        searchPlaceholder: 'Cari nama pengguna...',
        data: filteredUsers,
        columns: [
          { header: 'Nama', accessorKey: 'name' },
          { header: 'Email', accessorKey: 'email' },
          { header: 'Role', render: (row: any) => <StatusBadge label={row.role || ''} /> },
          { header: 'Kelas/Unit', accessorKey: 'group' },
          { header: 'Status', render: status },
        ],
      }}
    />

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-xl font-bold">Tambah Pengguna Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4 mt-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Nama Lengkap</label>
                <Input 
                  required 
                  placeholder="Masukkan nama pengguna..."
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Email</label>
                <Input 
                  required 
                  type="email" 
                  placeholder="Masukkan alamat email..."
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Nomor Telepon</label>
                <Input 
                  type="tel" 
                  placeholder="Contoh: 081234567890"
                  value={formData.phoneNumber} 
                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Peran (Role)</label>
                <select 
                  required 
                  value={formData.role} 
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="SISWA">Siswa</option>
                  <option value="GURU">Guru</option>
                  <option value="STAFF">Staff</option>
                  <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                  <option value="ADMIN_IT">Admin IT</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Kata Sandi (Password)</label>
                <Input 
                  required 
                  type="password" 
                  minLength={8}
                  placeholder="Minimal 8 karakter..."
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Minimal 8 karakter, kombinasi huruf & angka.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Konfirmasi Kata Sandi</label>
                <Input 
                  required 
                  type="password" 
                  minLength={8}
                  placeholder="Ulangi kata sandi..."
                  value={formData.confirmPassword} 
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {formData.confirmPassword.length > 0 && (
                  <p className={`text-[11px] font-medium leading-tight ${formData.password === formData.confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {formData.password === formData.confirmPassword ? '✓ Kata sandi cocok' : '✕ Kata sandi belum cocok'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
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
        { title: 'Rombel Aktif', value: '36 Kelas', description: 'X, XI, dan XII', icon: BookOpen },
        { title: 'Siswa Terpetakan', value: '98.7%', description: '16 siswa perlu validasi', icon: Users },
        { title: 'Wali Kelas', value: '36 Guru', description: 'Semua rombel terisi', icon: UserCheck },
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
        { title: 'Kehadiran Hari Ini', value: '96.2%', description: '1.192 dari 1.240 siswa hadir', icon: CalendarCheck },
        { title: 'Terlambat', value: '31 Siswa', description: 'Mayoritas kelas X', icon: Clock },
        { title: 'Izin/Sakit', value: '17 Siswa', description: 'Sudah diverifikasi wali kelas', icon: FileText },
      ]}
      insights={[
        { title: 'Kelas terbaik', value: 'XI IPA 2', description: 'Kehadiran 100% selama tiga hari berturut-turut.', badge: 'Apresiasi', badgeVariant: 'default' },
        { title: 'Jam ramai', value: '06.45', description: 'Puncak input kehadiran siswa oleh guru piket dan guru mapel.', badge: 'Insight' },
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
        { title: 'Profil Sekolah', value: 'Lengkap', description: 'Identitas dan kontak tervalidasi', icon: School },
        { title: 'Tahun Ajaran', value: '2025/2026', description: 'Semester genap aktif', icon: CalendarCheck },
        { title: 'Template Aktif', value: '6 Template', description: 'Notifikasi dan invoice', icon: Bell },
      ]}
      insights={[
        { title: 'Radius presensi', value: '150 meter', description: 'Diterapkan untuk check-in guru dan validasi area sekolah.', badge: 'GPS' },
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
  const [summary, setSummary] = React.useState<any>(null);
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, invoicesRes] = await Promise.all([
          apiClient.get<any>(`/admin/payments/summary`),
          apiClient.get<any>(`/admin/payments/invoices`)
        ]);
        console.log('API Responses:', summaryRes, invoicesRes);
        
        if (summaryRes.success) setSummary(summaryRes.data);
        if (invoicesRes.success) setInvoices(invoicesRes.data);
      } catch (err) {
        console.error('Error fetching payments admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const realizationAmount = summary?.realizationAmount || 0;
  const realizationFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(realizationAmount);
  const pendingInvoices = summary?.pendingInvoices || 0;
  const qrisPercentage = summary?.qrisPercentage || 0;

  return (
    <DashboardRoutePage
      title="Monitoring Pembayaran"
      description="Pantau invoice SPP, realisasi pembayaran, dan status verifikasi transaksi sekolah secara real-time."
      actionLabel="Export Pembayaran"
      actionIcon={CreditCard}
      stats={[
        { title: 'Realisasi Bulan Ini', value: loading ? '...' : realizationFormatted, description: 'Total pembayaran lunas', icon: CreditCard },
        { title: 'Invoice Pending', value: loading ? '...' : `${pendingInvoices} Invoice`, description: 'Belum dibayar oleh siswa', icon: Receipt },
        { title: 'Pembayaran QRIS', value: loading ? '...' : `${qrisPercentage}%`, description: 'Kanal pembayaran paling aktif', icon: TrendingUp },
      ]}
      insights={[
        { title: 'Catatan Admin', value: 'Pemantauan Lunas', description: 'Lihat daftar invoice terbaru di bawah.', badge: 'Info' },
      ]}
      table={{
        title: 'Riwayat Invoice SPP Terbaru',
        icon: CreditCard,
        searchKey: 'studentName',
        searchPlaceholder: 'Cari nama siswa...',
        data: invoices,
        columns: [
          { header: 'No. Invoice', accessorKey: 'invoiceNumber' },
          { header: 'Nama Siswa', render: (row: any) => row.studentName || 'Siswa' },
          { header: 'Periode', render: (row: any) => `${row.month}/${row.year}` },
          { header: 'Nominal', render: (row: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.amount) },
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
        { title: 'Terkirim Hari Ini', value: '1.284 Pesan', description: 'In-app, email, dan WhatsApp', icon: Bell },
        { title: 'Template Aktif', value: '6 Template', description: 'Akademik dan pembayaran', icon: FileText },
        { title: 'Gagal Terkirim', value: '12 Pesan', description: 'Nomor kontak perlu diperbarui', icon: ShieldAlert },
      ]}
      insights={[
        { title: 'Reminder SPP', value: 'Aktif', description: 'Dikirim H-3 dan H+1 jatuh tempo.', badge: 'Otomatis' },
        { title: 'Pengumuman kelas', value: '18 pesan', description: 'Dikirim guru melalui modul tugas.', badge: 'Akademik' },
        { title: 'Rate sukses', value: '99.1%', description: 'Kanal in-app paling stabil.', badge: 'Baik', badgeVariant: 'default' },
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
        { title: 'Laporan Siap', value: '12 Dokumen', description: 'Semester genap berjalan', icon: FileText },
        { title: 'Data Lengkap', value: '96.8%', description: 'Presensi dan pembayaran tersinkron', icon: CheckCircle },
        { title: 'Perlu Review', value: '3 Laporan', description: 'Menunggu validasi admin', icon: Clock },
      ]}
      insights={[
        { title: 'Paket bulanan', value: 'Mei 2026', description: 'Presensi dan SPP sudah dapat diekspor.', badge: 'Ready', badgeVariant: 'default' },
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
        { title: 'Kehadiran Siswa', value: '96.2%', description: '+1.1% dibanding pekan lalu', icon: GraduationCap },
        { title: 'Kehadiran Guru', value: '98.8%', description: 'Semua jam mengajar terpenuhi', icon: UserCheck },
        { title: 'Terlambat Berulang', value: '12 Siswa', description: 'Butuh pembinaan BK', icon: Clock },
      ]}
      insights={[
        { title: 'Tren bulanan', value: 'Naik 2.4%', description: 'Program disiplin pagi menunjukkan hasil positif.', badge: 'Positif', badgeVariant: 'default' },
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
  const [summary, setSummary] = React.useState<any>(null);
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, invoicesRes] = await Promise.all([
          apiClient.get<any>(`/admin/payments/summary`),
          apiClient.get<any>(`/admin/payments/invoices`)
        ]);
        if (summaryRes.success) setSummary(summaryRes.data);
        if (invoicesRes.success) setInvoices(invoicesRes.data);
      } catch (err) {
        console.error('Error fetching payments admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalMasuk = summary?.realizationAmount || 0;
  const pendingInvoices = summary?.pendingInvoices || 0;
  const qrisPercentage = summary?.qrisPercentage || 0;

  const groupedByMonth = invoices.reduce((acc: any, inv: any) => {
    const key = `${inv.month}-${inv.year}`;
    if (!acc[key]) {
      acc[key] = { monthLabel: `${inv.month}/${inv.year}`, target: 0, actual: 0, unpaid: 0 };
    }
    acc[key].target += inv.amount;
    if (inv.status === 'PAID' || inv.status === 'Lunas') {
      acc[key].actual += inv.amount;
    } else {
      acc[key].unpaid += inv.amount;
    }
    return acc;
  }, {});

  const tableData = Object.values(groupedByMonth).map((d: any) => ({
    month: d.monthLabel,
    target: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(d.target),
    actual: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(d.actual),
    unpaid: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(d.unpaid),
    status: d.unpaid === 0 ? 'Lunas Baik' : 'Perlu Pantau'
  }));

  return (
    <DashboardRoutePage
      title="Laporan Keuangan"
      description="Ringkasan realisasi SPP, tunggakan, dan proyeksi kas sekolah dari modul pembayaran."
      actionLabel="Export Keuangan"
      actionIcon={CreditCard}
      stats={[
        { title: 'Realisasi Bulan Ini', value: loading ? '...' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalMasuk), description: 'Total pembayaran lunas', icon: CreditCard },
        { title: 'Tunggakan Aktif', value: loading ? '...' : `${pendingInvoices} Invoice`, description: 'Belum dibayar oleh siswa', icon: Receipt },
        { title: 'Persentase QRIS', value: loading ? '...' : `${qrisPercentage}%`, description: 'Pembayaran digital', icon: TrendingUp },
      ]}
      insights={[
        { title: 'Status Kas', value: 'Terdata', description: 'Masih perlu follow-up wali kelas untuk invoice pending.', badge: 'Pantau' },
        { title: 'Metode favorit', value: 'Digital', description: 'Menampilkan persentase penggunaan e-wallet/QRIS.', badge: 'Digital' },
        { title: 'Risiko kas', value: 'Rendah', description: 'Arus masuk masih cukup untuk operasional bulanan.', badge: 'Aman', badgeVariant: 'default' },
      ]}
      table={{
        title: 'Rekap SPP Bulanan (Otomatis)',
        icon: CreditCard,
        searchKey: 'month',
        data: tableData,
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
        { title: 'Rata-rata Akademik', value: '84.8', description: '+0.9 dari semester lalu', icon: Award },
        { title: 'Tugas Tuntas', value: '92.6%', description: 'Semua mapel inti', icon: FileText },
        { title: 'Kelas Perlu Intervensi', value: '3 Rombel', description: 'Nilai mapel inti menurun', icon: BookOpen },
      ]}
      insights={[
        { title: 'Mapel terbaik', value: 'Bahasa Indonesia', description: 'Rata-rata lintas jenjang mencapai 88.2.', badge: 'Unggul', badgeVariant: 'default' },
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
        { title: 'Laporan Siap Dibaca', value: '9 Laporan', description: 'Update sampai hari ini', icon: FileText },
        { title: 'Indikator Sehat', value: '14/18', description: 'Mayoritas target terpenuhi', icon: CheckCircle },
        { title: 'Butuh Keputusan', value: '4 Item', description: 'Akademik dan pembayaran', icon: ShieldAlert },
      ]}
      insights={[
        { title: 'Prioritas minggu ini', value: 'SPP tertunggak', description: '31 invoice perlu strategi follow-up.', badge: 'Keuangan' },
        { title: 'Akademik', value: '3 rombel', description: 'Perlu program remedial terarah.', badge: 'Evaluasi' },
        { title: 'Kehadiran', value: 'Membaik', description: 'Tren naik 2.4% dari bulan lalu.', badge: 'Positif', badgeVariant: 'default' },
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
  const [rows, setRows] = React.useState<AttendanceStudentRow[]>([]);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await apiClient.get<any>('/users?role=SISWA&limit=10');
        if (res.success && res.data && res.data.items) {
          const mapped = res.data.items.map((u: any, i: number) => ({
            id: u.id,
            student: u.name,
            className: i % 2 === 0 ? 'XI IPA 1' : 'XI IPA 2',
            subject: 'Kimia',
            daily: { '20 Mei': 'Datang', '21 Mei': 'Datang', '22 Mei': 'Datang', '23 Mei': 'Datang', '24 Mei': 'Datang' },
          }));
          setRows(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchStudents();
  }, []);

  const [query, setQuery] = React.useState('');
  const [selectedDay, setSelectedDay] = React.useState(attendanceDays[attendanceDays.length - 1]);
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>([]);
  const filteredRows = rows.filter((row) =>
    [row.student, row.className, row.subject].some((value) => value.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredStudentIds = filteredRows.map((row) => row.id);
  const isAllFilteredSelected =
    filteredStudentIds.length > 0 && filteredStudentIds.every((id) => selectedStudentIds.includes(id));

  const updateAttendance = (studentId: string, day: string, statusValue: AttendanceStatus) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === studentId
          ? {
              ...row,
              daily: {
                ...row.daily,
                [day]: statusValue,
              },
            }
          : row
      )
    );
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((currentIds) =>
      currentIds.includes(studentId) ? currentIds.filter((id) => id !== studentId) : [...currentIds, studentId]
    );
  };

  const toggleAllFilteredSelection = () => {
    setSelectedStudentIds((currentIds) => {
      if (isAllFilteredSelected) {
        return currentIds.filter((id) => !filteredStudentIds.includes(id));
      }
      return Array.from(new Set([...currentIds, ...filteredStudentIds]));
    });
  };

  const updateSelectedAttendance = (statusValue: AttendanceStatus) => {
    if (selectedStudentIds.length === 0) return;
    setRows((currentRows) =>
      currentRows.map((row) =>
        selectedStudentIds.includes(row.id)
          ? {
              ...row,
              daily: {
                ...row.daily,
                [selectedDay]: statusValue,
              },
            }
          : row
      )
    );
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kehadiran Kelas"
        description="Guru berhak mengisi absensi setiap murid hanya pada jam jadwal pelajaran yang dia ampu."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Jadwal Aktif</p>
            <p className="mt-3 text-2xl font-black">Kimia Jam 1</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">XI IPA 1, Senin 08.00-09.30</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Hak Input Guru</p>
            <p className="mt-3 text-2xl font-black">Sesuai Jadwal</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Hanya pada pertemuan mapel yang dia ampu.</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status Input</p>
            <p className="mt-3 text-2xl font-black">{isEditing ? 'Mode Edit' : 'Tersimpan'}</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Pilih datang, sakit, atau alpa untuk tiap siswa.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-left">
              <h3 className="text-base font-bold">Rekap Absensi Harian Siswa</h3>
              <p className="text-xs text-muted-foreground">
                Centang siswa secara massal atau manual, pilih tanggal, lalu tetapkan status absensinya.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari siswa..."
                className="w-full lg:w-72"
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  className="gap-2 rounded-xl text-xs font-semibold"
                  onClick={() => setIsEditing((current) => !current)}
                >
                  <CalendarCheck className="h-4 w-4" />
                  {isEditing ? 'Simpan Absensi' : 'Absensi Siswa'}
                </Button>
                {isEditing && (
                  <Button variant="outline" className="rounded-xl text-xs font-semibold" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Tanggal absensi</span>
                <select
                  value={selectedDay}
                  onChange={(event) => setSelectedDay(event.target.value)}
                  className="h-9 rounded-lg border bg-background px-3 text-sm font-semibold"
                >
                  {attendanceDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <span className="text-xs font-semibold text-muted-foreground">
                  {selectedStudentIds.length} siswa dipilih
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => updateSelectedAttendance('Datang')}
                  disabled={selectedStudentIds.length === 0}
                >
                  Set Datang
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => updateSelectedAttendance('Sakit')}
                  disabled={selectedStudentIds.length === 0}
                >
                  Set Sakit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => updateSelectedAttendance('Alpa')}
                  disabled={selectedStudentIds.length === 0}
                >
                  Set Alpa
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  {isEditing && (
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={isAllFilteredSelected}
                        onChange={toggleAllFilteredSelection}
                        aria-label="Pilih semua siswa yang tampil"
                        className="h-4 w-4 rounded border-input accent-primary"
                      />
                    </TableHead>
                  )}
                  <TableHead className="min-w-48">Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Mapel</TableHead>
                  {attendanceDays.map((day) => (
                    <TableHead key={day} className="min-w-36 text-center">
                      {day}
                    </TableHead>
                  ))}
                  <TableHead className="min-w-44">Rekap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    {isEditing && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(row.id)}
                          onChange={() => toggleStudentSelection(row.id)}
                          aria-label={`Pilih ${row.student}`}
                          className="h-4 w-4 rounded border-input accent-primary"
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-semibold">{row.student}</TableCell>
                    <TableCell>{row.className}</TableCell>
                    <TableCell>{row.subject}</TableCell>
                    {attendanceDays.map((day) => (
                      <TableCell key={`${row.id}-${day}`} className="text-center">
                        {isEditing ? (
                          <div className="inline-flex rounded-lg border bg-muted/30 p-1">
                            {(['Datang', 'Sakit', 'Alpa'] as AttendanceStatus[]).map((statusValue) => (
                              <button
                                key={statusValue}
                                type="button"
                                onClick={() => updateAttendance(row.id, day, statusValue)}
                                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                                  row.daily[day] === statusValue
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                                }`}
                              >
                                {statusValue}
                              </button>
                            ))}
                          </div>
                        ) : (
                          attendanceStatusBadge(row.daily[day])
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-sm font-semibold text-muted-foreground">
                      {getAttendanceSummary(row)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
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
        { title: 'Tugas Aktif', value: '8 Tugas', description: '4 mendekati deadline', icon: FileText },
        { title: 'Belum Dinilai', value: '14 Pengumpulan', description: 'Prioritas minggu ini', icon: Clock },
        { title: 'Tuntas Dinilai', value: '86.4%', description: 'Semester berjalan', icon: CheckCircle },
      ]}
      insights={[
        { title: 'Deadline dekat', value: '2 tugas', description: 'Jatuh tempo dalam 48 jam.', badge: 'Segera' },
        { title: 'Kelas aktif', value: 'XI IPA 2', description: 'Pengumpulan paling cepat dan lengkap.', badge: 'Baik', badgeVariant: 'default' },
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
  const [students, setStudents] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await apiClient.get<any>('/users?role=SISWA&limit=10');
        if (res.success && res.data && res.data.items) {
          const mapped = res.data.items.map((u: any, i: number) => ({
            student: u.name,
            className: i % 2 === 0 ? 'XI IPA 1' : 'XI IPA 2',
            assignment: i % 2 === 0 ? 'Stoikiometri' : 'Reaksi Redoks',
            score: Math.floor(Math.random() * 20) + 75,
            status: 'Selesai'
          }));
          setStudents(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchStudents();
  }, []);

  return (
    <DashboardRoutePage
      title="Penilaian Siswa"
      description="Pantau nilai tugas, ulangan, dan siswa yang perlu remedial pada mata pelajaran Anda."
      actionLabel="Input Nilai"
      actionIcon={Award}
      stats={[
        { title: 'Rata-rata Nilai', value: '86.2', description: 'Kimia XI IPA', icon: Award },
        { title: 'Remedial', value: '9 Siswa', description: 'Nilai di bawah KKM', icon: ShieldAlert },
        { title: 'Belum Dinilai', value: '14 Berkas', description: 'Dari 2 tugas aktif', icon: FileText },
      ]}
      insights={[
        { title: 'KKM mapel', value: '75', description: 'Digunakan untuk penanda remedial otomatis.', badge: 'Standar' },
        { title: 'Topik sulit', value: 'Redoks', description: 'Rata-rata kuis terendah semester ini.', badge: 'Review' },
        { title: 'Kelas unggul', value: 'XI IPA 2', description: 'Rata-rata kelas 88.7.', badge: 'Baik', badgeVariant: 'default' },
      ]}
      table={{
        title: 'Rekap Nilai Siswa',
        icon: Award,
        searchKey: 'student',
        data: students.length > 0 ? students : [
          { student: 'Memuat data...', className: '-', assignment: '-', score: '-', status: 'Pending' }
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
        { title: 'Kelas', value: 'XI IPA 1', description: 'Kimia', icon: BookOpen },
        { title: 'Kelas', value: 'XI IPA 2', description: 'Kimia', icon: BookOpen },
        { title: 'Kelas', value: 'X IPA 1', description: 'Kimia Dasar', icon: BookOpen },
        { title: 'Kelas', value: 'XII IPA 3', description: 'Praktikum', icon: BookOpen },
        { title: 'Kelas', value: 'XI IPS 1', description: 'Kimia Lintas Minat', icon: BookOpen },
        { title: 'Kelas', value: 'XII IPA 1', description: 'Kimia', icon: BookOpen },
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
        { title: 'Belum Dibaca', value: '5 Pesan', description: 'Mayoritas dari admin sekolah', icon: Bell },
        { title: 'Pengumuman Kelas', value: '12 Pesan', description: 'Dikirim semester ini', icon: FileText },
        { title: 'Reminder Tugas', value: '4 Aktif', description: 'Deadline 7 hari ke depan', icon: Clock },
      ]}
      insights={[
        { title: 'Pesan prioritas', value: 'Jadwal ujian', description: 'Butuh konfirmasi distribusi materi.', badge: 'Prioritas' },
        { title: 'Kanal kelas', value: 'Aktif', description: 'Siswa menerima notifikasi tugas otomatis.', badge: 'Aktif', badgeVariant: 'default' },
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
  const [summary, setSummary] = React.useState<any>(null);
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, invoicesRes] = await Promise.all([
          apiClient.get<any>(`/admin/payments/summary`),
          apiClient.get<any>(`/admin/payments/invoices`)
        ]);
        if (summaryRes.success) setSummary(summaryRes.data);
        if (invoicesRes.success) setInvoices(invoicesRes.data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalMasuk = summary?.realizationAmount || 0;
  const pendingInvoices = summary?.pendingInvoices || 0;

  return (
    <DashboardRoutePage
      title="Kelola Invoices SPP"
      description="Kelola pembuatan invoice SPP, status pembayaran, dan verifikasi transfer manual."
      actionLabel="Buat Invoice"
      actionIcon={Receipt}
      stats={[
        { title: 'Invoice Bulan Ini', value: loading ? '...' : (invoices.length).toString(), description: 'Semua siswa aktif', icon: Receipt },
        { title: 'Sudah Lunas', value: loading ? '...' : (invoices.filter(i => i.status === 'PAID').length).toString(), description: 'Pembayaran masuk', icon: CheckCircle },
        { title: 'Menunggu Verifikasi', value: loading ? '...' : (invoices.filter(i => i.status === 'PENDING').length).toString(), description: 'Transfer manual / Belum bayar', icon: Clock },
      ]}
      insights={[
        { title: 'Total masuk', value: loading ? '...' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalMasuk), description: 'Bulan ini', badge: 'Bulan ini' },
        { title: 'Tunggakan', value: loading ? '...' : `${pendingInvoices} invoice`, description: 'Perlu reminder bertahap ke wali siswa.', badge: 'Follow-up' },
        { title: 'Auto-reminder', value: 'Aktif', description: 'Dikirim H-3 dan H+1 jatuh tempo.', badge: 'Notifikasi' },
      ]}
      table={{
        title: 'Daftar Invoice Terbaru',
        icon: Receipt,
        searchKey: 'studentName',
        data: invoices,
        columns: [
          { header: 'Siswa', render: (row: any) => row.studentName || 'Siswa' },
          { header: 'Periode', render: (row: any) => `${row.month}/${row.year}` },
          { header: 'Invoice', accessorKey: 'invoiceNumber' },
          { header: 'Nominal', render: (row: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.amount) },
          { header: 'Status', render: status },
        ],
      }}
    />
  );
}

export function StaffAttendancePage() {
  const [students, setStudents] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await apiClient.get<any>('/users?role=SISWA&limit=10');
        if (res.success && res.data && res.data.items) {
          const mapped = res.data.items.map((u: any, i: number) => ({
            student: u.name,
            className: i % 2 === 0 ? 'X IPA 1' : 'XII IPS 2',
            note: i % 3 === 0 ? 'Izin keluarga' : 'Sakit',
            source: 'Sistem',
            status: i % 2 === 0 ? 'Pending' : 'Hadir'
          }));
          setStudents(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchStudents();
  }, []);

  return (
    <DashboardRoutePage
      title="Presensi Siswa"
      description="Bantu validasi presensi siswa, data izin/sakit, dan laporan kehadiran harian untuk administrasi."
      actionLabel="Validasi Presensi"
      actionIcon={CalendarCheck}
      stats={[
        { title: 'Data Masuk', value: '1.224 Record', description: 'Per hari ini', icon: CalendarCheck },
        { title: 'Perlu Validasi', value: '19 Record', description: 'Izin, sakit, dan manual input', icon: FileText },
        { title: 'Tanpa Keterangan', value: '8 Siswa', description: 'Butuh follow-up wali kelas', icon: ShieldAlert },
      ]}
      insights={[
        { title: 'Input manual', value: '11 record', description: 'Sebagian dari siswa tanpa perangkat.', badge: 'Validasi' },
        { title: 'Dokumen izin', value: '8 file', description: 'Surat sakit dan izin keluarga.', badge: 'Lampiran' },
        { title: 'Rekap harian', value: 'Siap export', description: 'Format laporan kepala sekolah tersedia.', badge: 'Ready', badgeVariant: 'default' },
      ]}
      table={{
        title: 'Data Presensi Perlu Validasi',
        icon: CalendarCheck,
        searchKey: 'student',
        data: students.length > 0 ? students : [
          { student: 'Memuat data...', className: '-', note: '-', source: '-', status: 'Pending' }
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
        { title: 'Nominal Default', value: 'Rp 450.000', description: 'Per siswa per bulan', icon: CreditCard },
        { title: 'Jatuh Tempo', value: 'Tanggal 10', description: 'Reminder otomatis aktif', icon: CalendarCheck },
        { title: 'Template Reminder', value: '5 Aktif', description: 'WA, email, dan in-app', icon: Bell },
      ]}
      insights={[
        { title: 'Denda aktif', value: 'Rp 25.000', description: 'Diterapkan setelah H+7 jatuh tempo.', badge: 'Policy' },
        { title: 'Keringanan', value: '12 siswa', description: 'Masuk daftar subsidi internal sekolah.', badge: 'Khusus' },
        { title: 'QRIS', value: 'Aktif', description: 'Simulasi pembayaran tersedia di FE.', badge: 'Digital', badgeVariant: 'default' },
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
        { title: 'Belum Dibaca', value: '7 Pesan', description: 'Keuangan dan operasional', icon: Bell },
        { title: 'Reminder Invoice', value: '18 Aktif', description: 'Butuh follow-up pembayaran', icon: Receipt },
        { title: 'Pengumuman Sekolah', value: '4 Pesan', description: 'Dalam tujuh hari terakhir', icon: FileText },
      ]}
      insights={[
        { title: 'Prioritas', value: 'Verifikasi manual', description: '8 pembayaran menunggu konfirmasi.', badge: 'Keuangan' },
        { title: 'SLA', value: '3 jam', description: 'Rata-rata respons pesan staff.', badge: 'Baik', badgeVariant: 'default' },
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
        { title: 'Status Akun', value: 'Aktif', description: 'Terhubung ke tenant sekolah', icon: UserCheck },
        { title: 'Unit Kerja', value: 'Keuangan', description: 'Akses invoice dan verifikasi SPP', icon: CreditCard },
        { title: 'Notifikasi', value: 'Aktif', description: 'Reminder pembayaran dan presensi', icon: Bell },
      ]}
      insights={[
        { title: 'Login terakhir', value: 'Hari ini', description: 'Sesi dashboard aktif normal.', badge: 'Aman', badgeVariant: 'default' },
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
      title="Kehadiran Saya"
      description="Lihat riwayat kehadiran yang diinput oleh guru pada setiap pertemuan jam mata pelajaran."
      actionLabel="Ajukan Izin"
      actionIcon={MapPin}
      stats={[
        { title: 'Kehadiran Bulan Ini', value: '98.2%', description: '1 kali izin tercatat', icon: CalendarCheck },
        { title: 'Terlambat', value: '1 Kali', description: 'Masih dalam batas pembinaan', icon: Clock },
        { title: 'Streak Hadir', value: '12 Hari', description: 'Pertahankan sampai akhir bulan', icon: Sparkles },
      ]}
      insights={[
        { title: 'Status hari ini', value: 'Hadir', description: 'Kehadiran sudah diinput oleh guru mapel.', badge: 'Hadir', badgeVariant: 'default' },
        { title: 'Sumber data', value: 'Guru mapel', description: 'Setiap pertemuan dicatat oleh guru yang mengajar.', badge: 'Mapel' },
        { title: 'Catatan BK', value: 'Tidak ada', description: 'Tidak ada pelanggaran presensi aktif.', badge: 'Aman', badgeVariant: 'default' },
      ]}
      table={{
        title: 'Riwayat Kehadiran Saya',
        icon: CalendarCheck,
        searchKey: 'date',
        data: [
          { date: '24 Mei 2026', subject: 'Kimia', meeting: 'Jam 1', inputBy: 'Budi Santoso', status: 'Hadir' },
          { date: '23 Mei 2026', subject: 'Matematika', meeting: 'Jam 3', inputBy: 'Sari Wulandari', status: 'Hadir' },
          { date: '22 Mei 2026', subject: 'Bahasa Indonesia', meeting: 'Jam 2', inputBy: 'Rina Marlina', status: 'Terlambat' },
          { date: '21 Mei 2026', subject: 'Fisika', meeting: 'Jam 4', inputBy: 'Surat izin diverifikasi', status: 'Izin' },
        ],
        columns: [
          { header: 'Tanggal', accessorKey: 'date' },
          { header: 'Mapel', accessorKey: 'subject' },
          { header: 'Pertemuan', accessorKey: 'meeting' },
          { header: 'Diinput Oleh', accessorKey: 'inputBy' },
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
        { title: 'Tugas Aktif', value: '5 Tugas', description: '2 perlu dikumpulkan minggu ini', icon: FileText },
        { title: 'Sudah Dikumpul', value: '18 Tugas', description: 'Semester berjalan', icon: CheckCircle },
        { title: 'Belum Kumpul', value: '2 Tugas', description: 'Jangan lewat deadline', icon: Clock },
      ]}
      insights={[
        { title: 'Deadline terdekat', value: '28 Mei', description: 'Eksperimen Kimia Organik.', badge: 'Segera' },
        { title: 'Nilai terbaru', value: '92', description: 'Ulangan Stoikiometri Larutan.', badge: 'Bagus', badgeVariant: 'default' },
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
  const [loadingInvoiceId, setLoadingInvoiceId] = React.useState<string | null>(null);
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await apiClient.get<any>('/payments/invoices');
        if (res.success && res.data && res.data.items) {
          // Sesuaikan format data dengan tabel yang sudah ada jika diperlukan
          const mapped = res.data.items.map((inv: any) => ({
            invoice: `SPP-${inv.id}`, // Aslinya id
            month: inv.month,
            amount: inv.amount,
            method: inv.method || 'Transfer',
            status: inv.status
          }));
          setInvoices(mapped);
        }
      } catch (err) {
        console.error('Error fetching student invoices:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  const handlePayMidtrans = async (inv: any) => {
    try {
      setLoadingInvoiceId(inv.invoice);
      // Panggil API Backend Snap
      const res = await fetch("http://localhost:3001/api/v1/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: inv.invoice }),
      });
      const data = await res.json();
      
      if (data.data?.token && (window as any).snap) {
        (window as any).snap.pay(data.data.token, {
          onSuccess: function() {
            alert("Pembayaran Berhasil via Midtrans Sandbox!");
            setInvoices(prev => prev.map(item => 
              item.invoice === inv.invoice ? { ...item, status: 'PAID' } : item
            ));
          },
          onPending: function() {
            alert("Menunggu pembayaran...");
          },
          onError: function() {
            alert("Pembayaran gagal!");
          }
        });
      } else if (data.data?.redirectUrl) {
        window.open(data.data.redirectUrl, "_blank");
      } else {
        alert("Melakukan simulasi pembayaran...");
        handleSimulatePayment(inv);
      }
    } catch (e: any) {
      alert("Memproses simulasi pembayaran dev...");
      handleSimulatePayment(inv);
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  const handleSimulatePayment = async (inv: any) => {
    try {
      setLoadingInvoiceId(inv.invoice);
      // Simulasi delay jaringan
      await new Promise(r => setTimeout(r, 800));
      
      setInvoices(prev => prev.map(item => 
        item.invoice === inv.invoice ? { ...item, status: 'PAID' } : item
      ));
      
      alert(`🎉 Simulasi Berhasil! Status ${inv.invoice} menjadi PAID.`);
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  return (
    <DashboardRoutePage
      title="Riwayat Pembayaran & SPP"
      description="Lihat tagihan SPP aktif, histori pembayaran, dan bayar online via Midtrans Sandbox."
      actionLabel="Bayar SPP Sekarang"
      actionIcon={CreditCard}
      onAction={() => {
        const unpaidInv = invoices.find(i => i.status === 'UNPAID');
        if (unpaidInv) handlePayMidtrans(unpaidInv);
        else alert("Semua tagihan sudah lunas!");
      }}
      stats={[
        { title: 'Tagihan Aktif', value: 'Rp 450.000', description: 'SPP Bulan Mei 2026', icon: CreditCard },
        { title: 'Pembayaran Lunas', value: '4 Bulan', description: 'Semester genap 2025/2026', icon: CheckCircle },
        { title: 'Jatuh Tempo', value: '15 Mei 2026', description: 'Midtrans QRIS & VA Aktif', icon: Clock },
      ]}
      insights={[
        { title: 'Midtrans Sandbox', value: 'QRIS / Bank VA', description: 'Klik tombol bayar untuk uji coba simulasi pembayaran.', badge: 'Sandbox Ready', badgeVariant: 'default' },
        { title: 'Metode Aktif', value: 'QRIS & Transfer', description: 'Dukungan penuh untuk GoPay, ShopeePay, BCA, Mandiri.', badge: 'Digital' },
        { title: 'Verifikasi', value: 'Realtime', description: 'Status invoice otomatis ter-update menjadi LUNAS.', badge: 'Otomatis' },
      ]}
      table={{
        title: 'Histori Pembayaran SPP (Midtrans Integration)',
        icon: CreditCard,
        searchKey: 'invoice',
        data: invoices,
        columns: [
          { header: 'Invoice', accessorKey: 'invoice' },
          { header: 'Bulan', accessorKey: 'month' },
          { header: 'Nominal', accessorKey: 'amount' },
          { header: 'Metode', accessorKey: 'method' },
          { header: 'Status', render: status },
          {
            header: 'Aksi Bayar',
            render: (row: any) => {
              if (row.status === 'PAID' || row.status === 'Lunas') {
                return <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Terverifikasi</span>;
              }
              return (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                    onClick={() => handlePayMidtrans(row)}
                    disabled={loadingInvoiceId === row.invoice}
                  >
                    <CreditCard className="h-3.5 w-3.5 mr-1" />
                    {loadingInvoiceId === row.invoice ? "Memproses..." : "Bayar Midtrans"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                    onClick={() => handleSimulatePayment(row)}
                    disabled={loadingInvoiceId === row.invoice}
                  >
                    Simulasi Lunas
                  </Button>
                </div>
              );
            },
          },
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
        { title: 'Belum Dibaca', value: '4 Pesan', description: 'Tugas dan pembayaran', icon: Bell },
        { title: 'Reminder Tugas', value: '2 Aktif', description: 'Deadline minggu ini', icon: FileText },
        { title: 'Info Pembayaran', value: '1 Invoice', description: 'SPP Mei 2026', icon: CreditCard },
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
        { title: 'Kelas Aktif', value: 'XI IPA 1', description: 'Semester genap 2025/2026', icon: BookOpen },
        { title: 'Status Akademik', value: 'Aktif', description: 'Terdaftar pada 6 mapel', icon: GraduationCap },
        { title: 'Kontak Wali', value: 'Terverifikasi', description: 'Digunakan untuk notifikasi SPP', icon: Users },
      ]}
      insights={[
        { title: 'NIS', value: '2026-1108', description: 'Nomor induk siswa aktif.', badge: 'Valid', badgeVariant: 'default' },
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
