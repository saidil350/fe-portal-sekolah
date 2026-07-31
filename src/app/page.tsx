'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  Bell,
  Shield,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  UserCheck,
  Settings,
  Briefcase,
  Award,
  Zap,
  CreditCard,
  ChevronDown,
  Star,
  ShieldCheck,
  Activity,
  BarChart3,
  Clock,
  Lock,
  Layers,
  Check,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Button,
} from '@/components/ui';
import { ThemeToggle } from '@/components/theme-toggle';

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Multi-Peran',
    desc: 'Tampilan khusus & dipersonalisasi untuk Kepala Sekolah, Admin IT, Guru, dan Siswa.',
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30',
  },
  {
    icon: BookOpen,
    title: 'Manajemen Tugas & Materi',
    desc: 'Pengelolaan tugas, instruksi belajar, dan pengumpulan tugas online yang fleksibel.',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/30',
  },
  {
    icon: CalendarCheck,
    title: 'Presensi Digital Realtime',
    desc: 'Pencatatan kehadiran harian siswa & guru secara otomatis dengan rekapitulasi akurat.',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30',
  },
  {
    icon: Bell,
    title: 'Pusat Notifikasi Pintar',
    desc: 'Sistem broadcast notifikasi langsung ke semua pengguna secara realtime.',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran Gateway Midtrans',
    desc: 'Integrasi pembayaran SPP & biaya sekolah online yang praktis dan aman.',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-500 border-cyan-500/30',
  },
  {
    icon: Shield,
    title: 'Keamanan Multi-Tenant',
    desc: 'Isolasi data tiap sekolah terjamin aman dengan arsitektur SaaS multi-tenant.',
    color: 'from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/30',
  },
];

const ROLES_DETAILS: Record<string, {
  role: string;
  badge: string;
  icon: any;
  color: string;
  gradientBg: string;
  badgeColor: string;
  desc: string;
  features: string[];
  metrics: { label: string; value: string; change: string; icon: any }[];
  recentActivities: { title: string; subtitle: string; time: string; tag: string; tagColor: string }[];
}> = {
  KEPALA_SEKOLAH: {
    role: 'Kepala Sekolah',
    badge: 'Executive Oversight',
    icon: Award,
    color: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    gradientBg: 'from-amber-500/10 via-orange-500/5 to-transparent',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    desc: 'Monitoring laporan keuangan, analisis presensi sekolah, dan statistik performa akademik secara real-time dari satu tempat.',
    features: [
      'Grafik Laporan Keuangan SPP & Pemasukan',
      'Ringkasan Kehadiran Seluruh Kelas',
      'Pengawasan Kinerja Pengajaran Guru',
      'Export Laporan Eksekutif ke PDF & Excel',
    ],
    metrics: [
      { label: 'Total SPP Terkumpul', value: 'Rp 142.5M', change: '+12% bln ini', icon: CreditCard },
      { label: 'Rata-rata Presensi', value: '96.8%', change: '+1.4% minggu ini', icon: CalendarCheck },
      { label: 'Siswa Aktif', value: '1.240', change: '100% Terverifikasi', icon: Users },
    ],
    recentActivities: [
      { title: 'Laporan SPP Bulanan Diterbitkan', subtitle: 'Total 450 transaksi berhasil', time: '10 mnt lalu', tag: 'Keuangan', tagColor: 'bg-emerald-500/10 text-emerald-500' },
      { title: 'Presensi Harian Sekolah', subtitle: '96.8% siswa hadir tepat waktu', time: '1 jam lalu', tag: 'Presensi', tagColor: 'bg-blue-500/10 text-blue-500' },
    ],
  },
  ADMIN_IT: {
    role: 'Admin IT',
    badge: 'System Administrator',
    icon: Settings,
    color: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    gradientBg: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    desc: 'Kelola seluruh pengguna sekolah, konfigurasi tahun akademik, broadcast pengumuman penting, serta monitoring log aktivitas.',
    features: [
      'Manajemen User (Siswa, Guru, Kepsek)',
      'Pengaturan Tahun Akademik & Semester',
      'Broadcast Notifikasi Massal Instan',
      'Manajemen Tarif SPP & Metode Bayar',
    ],
    metrics: [
      { label: 'Pengguna Terdaftar', value: '1,450', change: '4 Peran Utama', icon: Users },
      { label: 'Uptime Sistem SaaS', value: '99.99%', change: 'Normal & Stabil', icon: Activity },
      { label: 'Tahun Akademik', value: '2025/2026', change: 'Semester Ganjil', icon: Layers },
    ],
    recentActivities: [
      { title: 'Tambah 35 Akun Siswa Baru', subtitle: 'Kelas X IPA 1 terkonfigurasi', time: '5 mnt lalu', tag: 'Pengguna', tagColor: 'bg-blue-500/10 text-blue-500' },
      { title: 'Broadcast Notifikasi Ujian', subtitle: 'Terkirim ke 1,200 penerima', time: '30 mnt lalu', tag: 'Broadcast', tagColor: 'bg-purple-500/10 text-purple-500' },
    ],
  },
  GURU: {
    role: 'Guru Mata Pelajaran',
    badge: 'Teaching & Academics',
    icon: Briefcase,
    color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    gradientBg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    desc: 'Kemudahan mengisi presensi jam pelajaran, membuat & menilai tugas siswa, serta membagikan materi pembelajaran digital.',
    features: [
      'Input Presensi Siswa Per Jam Mengajar',
      'Pembuatan & Penilaian Tugas Online',
      'Rekap Nilai Siswa Otomatis',
      'Jadwal Mengajar Interaktif',
    ],
    metrics: [
      { label: 'Kelas Diampu', value: '6 Kelas', change: '24 Jam / Minggu', icon: BookOpen },
      { label: 'Tugas Dinilai', value: '184 / 200', change: '92% Selesai', icon: CheckCircle2 },
      { label: 'Presensi Mengajar', value: '100%', change: 'Sesuai Jadwal', icon: Clock },
    ],
    recentActivities: [
      { title: 'Tugas Matematika Bab 3', subtitle: '32 Siswa telah mengumpulkan', time: '15 mnt lalu', tag: 'Tugas', tagColor: 'bg-emerald-500/10 text-emerald-500' },
      { title: 'Presensi X IPA 2 Selesai', subtitle: '35 Hadir, 1 Izin', time: '2 jam lalu', tag: 'Presensi', tagColor: 'bg-teal-500/10 text-teal-500' },
    ],
  },
  SISWA: {
    role: 'Siswa / Peserta Didik',
    badge: 'Student Portal',
    icon: UserCheck,
    color: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
    gradientBg: 'from-purple-500/10 via-pink-500/5 to-transparent',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    desc: 'Pantau jadwal pelajaran harian, kumpulkan tugas sekolah secara online, bayar SPP instan, dan lihat pengumuman terbaru.',
    features: [
      'Pengumpulan Tugas secara Online',
      'Monitoring Presensi & Kehadiran Diri',
      'Pembayaran SPP Instan via Midtrans',
      'Notifikasi Pengumuman Sekolah Realtime',
    ],
    metrics: [
      { label: 'Tugas Pending', value: '2 Tugas', change: 'Deadline 2 Hari lagi', icon: BookOpen },
      { label: 'Presensi Saya', value: '98.5%', change: 'Hadir 64 dari 65 Hari', icon: CalendarCheck },
      { label: 'Status SPP', value: 'LUNAS', change: 'Bulan Juli 2026', icon: CreditCard },
    ],
    recentActivities: [
      { title: 'Tugas Biologi Terkumpul', subtitle: 'Nilai: 95 / 100 (Sangat Baik)', time: '1 jam lalu', tag: 'Nilai', tagColor: 'bg-purple-500/10 text-purple-500' },
      { title: 'Pembayaran SPP Berhasil', subtitle: 'Invoice #INV-202607-009', time: 'Yesterday', tag: 'Pembayaran', tagColor: 'bg-emerald-500/10 text-emerald-500' },
    ],
  },
};

const STATS = [
  { label: 'Sekolah Terdaftar', value: '150+', icon: GraduationCap, sub: 'Di Seluruh Indonesia' },
  { label: 'Pengguna Aktif', value: '50.000+', icon: Users, sub: 'Kepsek, Guru & Siswa' },
  { label: 'Uptime Sistem', value: '99.99%', icon: ShieldCheck, sub: 'Infrastruktur Cloud' },
  { label: 'Rating Kepuasan', value: '4.9 / 5.0', icon: Star, sub: 'Evaluasi Pengguna' },
];

const FAQS = [
  {
    q: 'Apakah Portal Sekolah mendukung banyak sekolah (Multi-Tenant)?',
    a: 'Ya! Portal Sekolah dirancang dengan arsitektur SaaS Multi-Tenant modern. Setiap sekolah memiliki ruang terisolasi tersendiri sehingga data antar sekolah terjamin aman dan tidak akan tertukar.',
  },
  {
    q: 'Bagaimana sistem pembayaran SPP terintegrasi di platform ini?',
    a: 'Sistem kami terintegrasi langsung dengan Payment Gateway Midtrans. Siswa atau wali siswa dapat membayar SPP menggunakan berbagai metode (Transfer Bank, QRIS, E-Wallet) dan status pembayaran akan langsung terupdate secara otomatis.',
  },
  {
    q: 'Apakah ada pembatasan jumlah pengguna untuk setiap sekolah?',
    a: 'Tidak ada batasan kaku. Sistem kami dirancang scalable untuk menampung ribuan siswa, guru, dan admin dalam satu sekolah tanpa mengorbankan kecepatan akses.',
  },
  {
    q: 'Bagaimana cara mencoba sistem ini sebelum mendaftar resmi?',
    a: 'Anda dapat langsung mencoba akun demo yang kami sediakan untuk 4 role berbeda (Kepala Sekolah, Admin IT, Guru, Siswa) tanpa perlu mendaftar terlebih dahulu!',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('KEPALA_SEKOLAH');
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleDashboardNav = () => {
    if (isAuthenticated && user) {
      const roleMap: Record<string, string> = {
        ADMIN_IT: '/dashboard/admin',
        KEPALA_SEKOLAH: '/dashboard/kepala-sekolah',
        GURU: '/dashboard/guru',
        SISWA: '/dashboard/siswa',
      };
      router.push(roleMap[user.role] || '/dashboard/siswa');
    } else {
      router.push('/login');
    }
  };

  const handleQuickDemo = (roleKey: string) => {
    router.push(`/login?role=${roleKey}`);
  };

  const currentRoleInfo = ROLES_DETAILS[activeTab];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative overflow-hidden">
      {/* ─── Background Ambient Glow ─── */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/15 via-purple-500/10 to-transparent blur-3xl rounded-full -z-10 opacity-70" />
      <div className="pointer-events-none absolute top-[800px] right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full -z-10" />
      <div className="pointer-events-none absolute top-[1600px] left-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full -z-10" />

      {/* ─── Header / Navbar ─── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground shadow-md shadow-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Portal Sekolah
              </span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-1 hidden sm:inline">SaaS Multi-Tenant</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur Utama</a>
            <a href="#peran" className="hover:text-primary transition-colors">Role & Panel</a>
            <a href="#demo" className="hover:text-primary transition-colors">Coba Demo</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {mounted && isAuthenticated ? (
              <Button onClick={handleDashboardNav} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard Saya
              </Button>
            ) : (
              <Button onClick={handleDashboardNav} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                Masuk Ke Sistem
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-16 text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-8 animate-fade-in shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <Sparkles className="h-3.5 w-3.5" />
          <span>Platform Manajemen Sekolah Masa Depan</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] mb-6">
          Kelola Sekolah Lebih{' '}
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Cerdas, Terintegrasi
          </span>
          <br className="hidden sm:inline" /> & Realtime
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
          Satu platform SaaS Multi-Tenant modern yang menghubungkan Kepala Sekolah, Admin IT, Guru, dan Siswa dalam ekosistem digital yang aman, praktis, dan hemat waktu.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            onClick={handleDashboardNav}
            className="gap-2 px-8 h-12 text-base font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            {mounted && isAuthenticated ? 'Buka Dashboard Saya' : 'Mulai Sekarang — Coba Demo'}
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="px-8 h-12 text-base font-medium hover:bg-muted/80 w-full sm:w-auto"
          >
            <a href="#peran">Lihat Tampilan Role</a>
          </Button>
        </div>

        {/* Feature Checkmarks */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground font-medium">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Tenant Secured Data
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Role Dashboard
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Midtrans SPP Payment Ready
          </span>
        </div>
      </section>

      {/* ─── Dynamic Live Interactive Dashboard Showcase ─── */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-primary/5 overflow-hidden">
          {/* Header Controls inside Showcase */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2">portal-sekolah.id/dashboard</span>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex flex-wrap justify-center gap-1.5 p-1 rounded-xl bg-muted/70 border border-border/50">
              {Object.keys(ROLES_DETAILS).map((key) => {
                const item = ROLES_DETAILS[key];
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-background text-foreground shadow-sm border border-border/50 scale-[1.02]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Preview Panel */}
          <div className={`mt-6 p-4 sm:p-8 rounded-xl bg-gradient-to-br ${currentRoleInfo.gradientBg} border border-border/40 transition-all duration-500`}>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Column: Role Details */}
              <div className="lg:w-5/12 space-y-4">
                <Badge variant="outline" className={`px-3 py-1 font-semibold text-xs border ${currentRoleInfo.badgeColor}`}>
                  {currentRoleInfo.badge}
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                  <currentRoleInfo.icon className={`h-7 w-7 p-1 rounded-lg border ${currentRoleInfo.color}`} />
                  {currentRoleInfo.role}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentRoleInfo.desc}
                </p>

                <div className="space-y-2.5 pt-2">
                  {currentRoleInfo.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-foreground">
                      <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    size="sm"
                    onClick={() => handleQuickDemo(activeTab)}
                    className="gap-2 text-xs font-semibold shadow-md"
                  >
                    Uji Coba Panel {currentRoleInfo.role}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Right Column: Live Mockup Metrics */}
              <div className="lg:w-7/12 w-full space-y-4">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentRoleInfo.metrics.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center justify-between text-muted-foreground mb-2">
                        <span className="text-[11px] font-medium">{m.label}</span>
                        <m.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-xl font-bold tracking-tight mb-1">{m.value}</div>
                      <div className="text-[10px] text-emerald-500 font-medium">{m.change}</div>
                    </div>
                  ))}
                </div>

                {/* Sample Activity List */}
                <div className="p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm backdrop-blur-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-primary" /> Aktivitas Realtime
                    </span>
                    <span className="text-[10px] text-muted-foreground">Status: Active</span>
                  </div>

                  {currentRoleInfo.recentActivities.map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                      <div className="space-y-0.5 truncate">
                        <div className="font-semibold text-foreground truncate">{act.title}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{act.subtitle}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${act.tagColor}`}>
                          {act.tag}
                        </span>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Banner ─── */}
      <section id="statistik" className="border-y border-border/50 bg-muted/30 relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm hover:border-primary/40 transition-colors">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-3">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-1">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground/80">{s.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="fitur" className="container max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16 space-y-3">
          <Badge variant="outline" className="px-3 py-1 font-semibold text-xs text-primary border-primary/30 bg-primary/5">
            Fitur Lengkap
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Segala Kebutuhan Sekolah Dalam{' '}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Satu Aplikasi
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Solusi komprehensif yang mempermudah operasional sekolah harian dari absensi hingga keuangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, idx) => (
            <Card
              key={idx}
              className="group border-border/60 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 bg-card/60 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl border bg-gradient-to-br ${f.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  {f.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Quick Demo Launcher Section ─── */}
      <section id="demo" className="container max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-indigo-500/5 to-purple-500/10 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4 mb-8">
            <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1">
              Simulasi Instant Demo
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Coba Uji Coba Demo 1-Klik
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Pilih peran di bawah ini untuk mensimulasikan penggunaan dashboard sesuai hak akses masing-masing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {Object.keys(ROLES_DETAILS).map((key) => {
              const r = ROLES_DETAILS[key];
              return (
                <button
                  key={key}
                  onClick={() => handleQuickDemo(key)}
                  className="group p-5 rounded-2xl border border-border/60 bg-background/80 hover:bg-background hover:border-primary/50 transition-all text-left flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <r.icon className={`h-6 w-6 p-1 rounded-lg border ${r.color}`} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{r.role}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Uji Coba Langsung &rarr;</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section id="faq" className="container max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Pertanyaan Umum (FAQ)
          </h2>
          <p className="text-muted-foreground text-sm">
            Jawaban lengkap seputar penggunaan dan integrasi Portal Sekolah.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 bg-muted/40 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base block leading-none">Portal Sekolah</span>
              <span className="text-[11px] text-muted-foreground">Platform SaaS Multi-Tenant Sekolah Modern</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Portal Sekolah. Hak Cipta Dilindungi Undang-Undang.
          </p>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleDashboardNav} className="gap-1.5 text-xs">
              Masuk Sistem <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
