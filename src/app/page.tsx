'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  MousePointerClick,
  Globe,
  Cpu,
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
    desc: 'Tampilan khusus & dipersonalisasi untuk Kepala Sekolah, Admin IT, Guru, dan Siswa dengan antarmuka real-time.',
    color: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20 text-blue-500 border-blue-500/30',
    gridSpan: 'lg:col-span-2',
    highlight: 'Rekomendasi Utama',
  },
  {
    icon: CreditCard,
    title: 'Pembayaran SPP Midtrans',
    desc: 'Integrasi payment gateway otomatis untuk pembayaran SPP & biaya sekolah online via QRIS, Transfer & E-Wallet.',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30',
    gridSpan: 'lg:col-span-1',
  },
  {
    icon: CalendarCheck,
    title: 'Presensi Digital Realtime',
    desc: 'Pencatatan kehadiran harian siswa & guru secara otomatis dengan rekapitulasi akurat dan ekspor PDF.',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/30',
    gridSpan: 'lg:col-span-1',
  },
  {
    icon: BookOpen,
    title: 'Manajemen Tugas & Materi',
    desc: 'Pengelolaan tugas harian, instruksi belajar digital, dan pengumpulan tugas online yang fleksibel.',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30',
    gridSpan: 'lg:col-span-1',
  },
  {
    icon: Shield,
    title: 'Keamanan SaaS Multi-Tenant',
    desc: 'Isolasi data antar sekolah terjamin 100% aman dengan arsitektur cloud SaaS multi-tenant generasi terbaru.',
    color: 'from-rose-500/20 via-red-500/20 to-orange-500/20 text-rose-500 border-rose-500/30',
    gridSpan: 'lg:col-span-1',
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
      { title: 'Laporan SPP Bulanan Diterbitkan', subtitle: 'Total 450 transaksi berhasil', time: '10 mnt lalu', tag: 'Keuangan', tagColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      { title: 'Presensi Harian Sekolah', subtitle: '96.8% siswa hadir tepat waktu', time: '1 jam lalu', tag: 'Presensi', tagColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
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
      { title: 'Tambah 35 Akun Siswa Baru', subtitle: 'Kelas X IPA 1 terkonfigurasi', time: '5 mnt lalu', tag: 'Pengguna', tagColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      { title: 'Broadcast Notifikasi Ujian', subtitle: 'Terkirim ke 1,200 penerima', time: '30 mnt lalu', tag: 'Broadcast', tagColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
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
      { title: 'Tugas Matematika Bab 3', subtitle: '32 Siswa telah mengumpulkan', time: '15 mnt lalu', tag: 'Tugas', tagColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      { title: 'Presensi X IPA 2 Selesai', subtitle: '35 Hadir, 1 Izin', time: '2 jam lalu', tag: 'Presensi', tagColor: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
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
      { title: 'Tugas Biologi Terkumpul', subtitle: 'Nilai: 95 / 100 (Sangat Baik)', time: '1 jam lalu', tag: 'Nilai', tagColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
      { title: 'Pembayaran SPP Berhasil', subtitle: 'Invoice #INV-202607-009', time: 'Kemarin', tag: 'Pembayaran', tagColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative overflow-hidden bg-grid-pattern">
      {/* ─── Animate-UI Ambient Background Glow & Floating Orbs ─── */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-primary/20 via-indigo-500/10 to-transparent blur-[120px] rounded-full -z-10"
      />
      
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-[700px] -right-20 w-[450px] h-[450px] bg-blue-500/10 blur-[130px] rounded-full -z-10"
      />
      
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute top-[1500px] -left-20 w-[450px] h-[450px] bg-purple-500/10 blur-[130px] rounded-full -z-10"
      />

      {/* ─── Sticky Glassmorphic Navbar ─── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-colors">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="p-2 rounded-xl bg-gradient-to-br from-primary via-indigo-600 to-purple-600 text-primary-foreground shadow-md shadow-primary/25"
            >
              <GraduationCap className="h-5 w-5" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-primary transition-colors">
                Portal Sekolah
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold -mt-1 hidden sm:inline tracking-wider uppercase">
                SaaS Multi-Tenant
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#fitur" className="hover:text-primary transition-colors py-1 relative group">
              Fitur Utama
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#peran" className="hover:text-primary transition-colors py-1 relative group">
              Role & Panel
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#demo" className="hover:text-primary transition-colors py-1 relative group">
              Coba Demo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#faq" className="hover:text-primary transition-colors py-1 relative group">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {mounted && isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button onClick={handleDashboardNav} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 font-semibold transition-all">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard Saya
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button onClick={handleDashboardNav} className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 font-semibold transition-all">
                  Masuk Ke Sistem
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section dengan Staggered Animate-UI Animations ─── */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary text-xs font-bold mb-8 shadow-inner shadow-primary/20"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Sparkles className="h-3.5 w-3.5" />
          </motion.div>
          <span className="tracking-wide">Platform Manajemen Sekolah Masa Depan</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] mb-6"
        >
          Kelola Sekolah Lebih{' '}
          <span className="text-shimmer">
            Cerdas, Terintegrasi
          </span>
          <br className="hidden sm:inline" /> & Realtime
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Satu platform SaaS Multi-Tenant modern yang menghubungkan Kepala Sekolah, Admin IT, Guru, dan Siswa dalam ekosistem digital yang aman, praktis, dan hemat waktu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Button
              size="lg"
              onClick={handleDashboardNav}
              className="gap-2.5 px-8 h-13 text-base font-bold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all w-full rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90"
            >
              {mounted && isAuthenticated ? 'Buka Dashboard Saya' : 'Mulai Sekarang — Coba Demo'}
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="px-8 h-13 text-base font-semibold hover:bg-muted/80 rounded-xl border-border/80 backdrop-blur-sm w-full"
            >
              <a href="#peran">Lihat Tampilan Role</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Checkmarks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground font-semibold"
        >
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/40 border border-border/40 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Tenant Secured Data
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/40 border border-border/40 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Multi-Role Dashboard
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/40 border border-border/40 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Midtrans SPP Payment Ready
          </span>
        </motion.div>
      </section>

      {/* ─── Animate-UI Style Interactive Showcase (Sliding Pill Tab & Live Mockup) ─── */}
      <section id="peran" className="container max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl border border-border/80 bg-card/70 backdrop-blur-2xl p-4 sm:p-7 shadow-2xl shadow-primary/10 overflow-hidden"
        >
          {/* Header Controls inside Showcase */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/90 inline-block shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-amber-500/90 inline-block shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/90 inline-block shadow-sm" />
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground ml-3 px-3 py-1 rounded-md bg-muted/50 border border-border/40">
                https://portal-sekolah.id/dashboard
              </span>
            </div>

            {/* Animate-UI Sliding Pill Tab Switcher */}
            <div className="flex flex-wrap justify-center gap-1 p-1.5 rounded-2xl bg-muted/80 border border-border/60 backdrop-blur-md relative">
              {Object.keys(ROLES_DETAILS).map((key) => {
                const item = ROLES_DETAILS[key];
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors z-10 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeRoleTabPill"
                        className="absolute inset-0 bg-background rounded-xl shadow-md border border-border/60 -z-10"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <item.icon className="h-3.5 w-3.5" />
                    {item.role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Preview Panel with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`mt-6 p-5 sm:p-8 rounded-2xl bg-gradient-to-br ${currentRoleInfo.gradientBg} border border-border/40 shadow-inner`}
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Column: Role Details */}
                <div className="lg:w-5/12 space-y-4">
                  <Badge variant="outline" className={`px-3 py-1 font-bold text-xs border rounded-lg ${currentRoleInfo.badgeColor}`}>
                    {currentRoleInfo.badge}
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${currentRoleInfo.color}`}>
                      <currentRoleInfo.icon className="h-6 w-6" />
                    </div>
                    {currentRoleInfo.role}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentRoleInfo.desc}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {currentRoleInfo.features.map((feat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex items-center gap-2.5 text-xs font-semibold text-foreground"
                      >
                        <div className="h-5 w-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{feat}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="sm"
                        onClick={() => handleQuickDemo(activeTab)}
                        className="gap-2 text-xs font-bold shadow-md rounded-xl px-5 h-10"
                      >
                        Uji Coba Panel {currentRoleInfo.role}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Right Column: Live Mockup Metrics */}
                <div className="lg:w-7/12 w-full space-y-4">
                  {/* Metric Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentRoleInfo.metrics.map((m, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="p-4 rounded-2xl bg-background/85 border border-border/70 shadow-sm backdrop-blur-md hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between text-muted-foreground mb-2">
                          <span className="text-[11px] font-semibold">{m.label}</span>
                          <div className="p-1 rounded-md bg-primary/10 text-primary">
                            <m.icon className="h-3.5 w-3.5" />
                          </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-black tracking-tight mb-1">{m.value}</div>
                        <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                          {m.change}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sample Activity List */}
                  <div className="p-5 rounded-2xl bg-background/85 border border-border/70 shadow-sm backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                      <span className="text-xs font-bold text-foreground flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary animate-pulse" /> Aktivitas Realtime Sistem
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        Status: Active Sync
                      </span>
                    </div>

                    {currentRoleInfo.recentActivities.map((act, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        className="flex items-center justify-between gap-3 text-xs p-3 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/60 transition-colors"
                      >
                        <div className="space-y-0.5 truncate">
                          <div className="font-bold text-foreground truncate">{act.title}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{act.subtitle}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${act.tagColor}`}>
                            {act.tag}
                          </span>
                          <div className="text-[10px] text-muted-foreground font-medium mt-1">{act.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ─── Stats Banner dengan Floating Cards ─── */}
      <section id="statistik" className="border-y border-border/50 bg-muted/20 relative backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-3.5 shadow-inner">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight mb-1">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-foreground/90">{s.label}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bento Grid Fitur Utama ─── */}
      <section id="fitur" className="container max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16 space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="px-3.5 py-1 font-bold text-xs text-primary border-primary/30 bg-primary/10 rounded-full">
              Fitur Lengkap Eksklusif
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            Segala Kebutuhan Sekolah Dalam{' '}
            <span className="text-shimmer">
              Satu Ekosistem
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto"
          >
            Solusi komprehensif yang dirancang untuk mempermudah operasional sekolah harian dari absensi hingga keuangan.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className={`${f.gridSpan} group rounded-3xl border border-border/70 hover:border-primary/60 transition-all duration-300 bg-card/60 backdrop-blur-xl p-7 relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between`}
            >
              {/* Top Highlight Badge if exists */}
              {f.highlight && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {f.highlight}
                </div>
              )}

              <div>
                <div className={`inline-flex p-3.5 rounded-2xl border bg-gradient-to-br ${f.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="font-extrabold text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border/30 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                <span>Pelajari Selengkapnya</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Quick Demo Launcher Section dengan Interactive Cards ─── */}
      <section id="demo" className="container max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-indigo-500/5 to-purple-500/10 p-8 sm:p-12 text-center overflow-hidden shadow-2xl backdrop-blur-2xl"
        >
          <div className="max-w-2xl mx-auto space-y-4 mb-10">
            <Badge className="bg-primary text-primary-foreground font-bold px-3.5 py-1 text-xs rounded-full">
              Simulasi Instant Demo
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Coba Uji Coba Demo 1-Klik
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Pilih peran di bawah ini untuk mensimulasikan penggunaan dashboard sesuai hak akses masing-masing secara langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {Object.keys(ROLES_DETAILS).map((key, i) => {
              const r = ROLES_DETAILS[key];
              return (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleQuickDemo(key)}
                  className="group p-6 rounded-2xl border border-border/70 bg-background/90 hover:bg-background hover:border-primary/60 transition-all text-left flex flex-col justify-between shadow-md hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl border ${r.color}`}>
                      <r.icon className="h-6 w-6" />
                    </div>
                    <div className="p-1.5 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <div className="font-extrabold text-base text-foreground">{r.role}</div>
                    <div className="text-xs text-primary font-bold mt-1 flex items-center gap-1">
                      Uji Coba Langsung <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ─── FAQ Section dengan Animate-UI Height Expansion Accordion ─── */}
      <section id="faq" className="container max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-12 space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight"
          >
            Pertanyaan Umum (FAQ)
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-sm"
          >
            Jawaban lengkap seputar penggunaan dan integrasi Portal Sekolah.
          </motion.p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`rounded-2xl border transition-all ${
                  isOpen ? 'border-primary/60 bg-card/80 shadow-lg shadow-primary/5' : 'border-border/60 bg-card/50 hover:border-border/90'
                } backdrop-blur-md overflow-hidden`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-1 rounded-lg bg-muted/60 text-muted-foreground"
                  >
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 bg-muted/30 backdrop-blur-xl">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base block leading-none">Portal Sekolah</span>
              <span className="text-[11px] text-muted-foreground font-medium">Platform SaaS Multi-Tenant Sekolah Modern</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center font-medium">
            © {new Date().getFullYear()} Portal Sekolah. Hak Cipta Dilindungi Undang-Undang.
          </p>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleDashboardNav} className="gap-1.5 text-xs font-bold">
              Masuk Sistem <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
