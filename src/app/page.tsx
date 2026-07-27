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
} from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Button,
} from '@/components/ui';

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Multi-Peran',
    desc: 'Tampilan khusus untuk Siswa, Guru, Staff, Kepala Sekolah, Admin IT, hingga Super Admin.',
  },
  {
    icon: BookOpen,
    title: 'Manajemen Tugas',
    desc: 'Pengelolaan tugas dan pengumpulan tugas terintegrasi antara guru dan siswa.',
  },
  {
    icon: CalendarCheck,
    title: 'Presensi Digital',
    desc: 'Pencatatan kehadiran secara real-time yang akurat dan dapat diakses kapan saja.',
  },
  {
    icon: Bell,
    title: 'Notifikasi Real-time',
    desc: 'Sistem notifikasi pintar untuk pengumuman penting dari sekolah.',
  },
  {
    icon: Users,
    title: 'Manajemen Pengguna',
    desc: 'Kelola seluruh akun pengguna sekolah dengan mudah dari satu panel admin.',
  },
  {
    icon: Shield,
    title: 'Keamanan Multi-Tenant',
    desc: 'Isolasi data antar sekolah yang aman dengan arsitektur multi-tenant modern.',
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
        SUPER_ADMIN: '/dashboard/super-admin',
        ADMIN_IT: '/dashboard/admin',
        KEPALA_SEKOLAH: '/dashboard/kepala-sekolah',
        GURU: '/dashboard/guru',
        STAFF: '/dashboard/staff',
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
            <a href="#statistik" className="hover:text-foreground transition-colors">Statistik</a>
            <a href="#tentang" className="hover:text-foreground transition-colors">Tentang</a>
          </nav>
          <div className="flex items-center gap-3">
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
          Sistem informasi manajemen sekolah terintegrasi yang menghubungkan guru,
          siswa, orang tua, dan administrasi dalam satu platform yang aman dan real-time.
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
          {['Tidak perlu kartu kredit', 'Setup kurang dari 5 menit', 'Data aman & terenkripsi'].map((t) => (
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
      <section id="tentang" className="container max-w-7xl mx-auto px-6 pb-24">
        <Card className="bg-muted/50">
          <CardContent className="p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dirancang untuk Semua Peran
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Setiap pengguna mendapatkan tampilan dan akses yang relevan dengan perannya.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
              {['Siswa', 'Guru', 'Staff Administrasi', 'Kepala Sekolah', 'Admin IT', 'Super Admin'].map((r) => (
                <div key={r} className="flex items-center gap-2 px-4 py-3 rounded-md border bg-card text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {r}
                </div>
              ))}
            </div>
            <Button
              size="lg"
              onClick={handleDashboardNav}
              className="gap-2 px-8 h-12"
            >
              {mounted && isAuthenticated ? 'Buka Dashboard Saya' : 'Coba Sekarang'}
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
