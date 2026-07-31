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
    desc: 'Tampilan khusus yang disesuaikan untuk Kepala Sekolah, Admin IT, Guru, dan Siswa.',
  },
  {
    icon: BookOpen,
    title: 'Manajemen Tugas & Materi',
    desc: 'Pengelolaan tugas dan pengumpulan tugas terintegrasi antara guru dan siswa.',
  },
  {
    icon: CalendarCheck,
    title: 'Presensi Digital',
    desc: 'Pencatatan kehadiran siswa dan guru secara real-time dan terstruktur.',
  },
  {
    icon: Bell,
    title: 'Notifikasi Real-time',
    desc: 'Sistem notifikasi pintar untuk pengumuman penting dari sekolah.',
  },
  {
    icon: Users,
    title: 'Manajemen Akun Pengguna',
    desc: 'Kelola seluruh akun pengguna sekolah dengan mudah dari satu panel Admin IT.',
  },
  {
    icon: Shield,
    title: 'Keamanan Multi-Tenant',
    desc: 'Isolasi data antar sekolah yang aman dengan arsitektur multi-tenant modern.',
  },
];

const ROLES_INFO = [
  {
    role: 'Kepala Sekolah',
    icon: Award,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    desc: 'Pengawasan eksekutif, monitoring laporan keuangan & kehadiran, serta statistik performa sekolah.',
  },
  {
    role: 'Admin IT',
    icon: Settings,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    desc: 'Pengelolaan akun pengguna, pengaturan tahun akademik, broadcast notifikasi, dan manajemen sistem.',
  },
  {
    role: 'Guru',
    icon: Briefcase,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    desc: 'Input presensi harian, pembuatan & pemeriksaan tugas siswa, serta pengumuman materi pelajaran.',
  },
  {
    role: 'Siswa',
    icon: UserCheck,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    desc: 'Akses jadwal pelajaran, pengumpulan tugas online, monitoring presensi pribadi, dan melihat pengumuman.',
  },
];

const STATS = [
  { label: 'Sekolah Bergabung', value: '150+' },
  { label: 'Pengguna Aktif', value: '50K+' },
  { label: 'Uptime Sistem', value: '99.9%' },
  { label: 'Kepuasan Pengguna', value: '4.9★' },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">
              Portal Sekolah
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
            <a href="#peran" className="hover:text-foreground transition-colors">Peran Sistem</a>
            <a href="#statistik" className="hover:text-foreground transition-colors">Statistik</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {mounted && isAuthenticated ? (
              <Button onClick={handleDashboardNav} className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login" className="gap-2">
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="container max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
          <Sparkles className="h-3.5 w-3.5" />
          Platform SaaS Multi-Tenant untuk Sekolah Modern
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          Kelola Sekolah{' '}
          <span className="text-primary">
            Lebih Cerdas
          </span>
          <br />& Lebih Efisien
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Sistem informasi manajemen sekolah terintegrasi yang menghubungkan Kepala Sekolah, Admin IT, Guru, dan Siswa dalam satu platform yang aman dan real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={handleDashboardNav}
            className="gap-2 px-8 h-12"
          >
            {mounted && isAuthenticated ? 'Buka Dashboard' : 'Mulai Sekarang — Gratis'}
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="px-8 h-12"
          >
            <a href="#fitur">Pelajari Fitur</a>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {['Akses Berbasis Peran', 'Setup Mudah & Cepat', 'Data Aman & Terenkripsi'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section id="statistik" className="border-y bg-muted/50">
        <div className="container max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="fitur" className="container max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Semua yang Dibutuhkan{' '}
            <span className="text-primary">Sekolah Anda</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Fitur lengkap yang dirancang khusus untuk ekosistem pendidikan Indonesia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Card key={f.title} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="inline-flex p-2.5 rounded-md bg-primary/10 text-primary mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Roles Section ─── */}
      <section id="peran" className="container max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            4 Role Utama Pengguna Sistem
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Setiap role dilengkapi akses khusus yang disesuaikan dengan tanggung jawab masing-masing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {ROLES_INFO.map((r) => (
            <Card key={r.role} className="border hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`p-3 rounded-lg border shrink-0 ${r.color}`}>
                  <r.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{r.role}</h3>
                    <Badge variant="outline" className="text-xs">Aktif</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">Siap Menggunakan Portal Sekolah?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Masuk dengan akun demo untuk mencoba fitur sesuai role yang Anda inginkan.
            </p>
            <Button
              size="lg"
              onClick={handleDashboardNav}
              className="gap-2 px-8 h-12"
            >
              {mounted && isAuthenticated ? 'Buka Dashboard Saya' : 'Masuk ke Sistem Demo'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t bg-muted/50">
        <div className="container max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">Portal Sekolah</span>
          </div>
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} Portal Sekolah. Platform SaaS Multi-Tenant untuk Pendidikan Indonesia.
          </p>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" className="gap-1">
              Masuk ke Sistem
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}

