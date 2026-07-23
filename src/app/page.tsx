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

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard Multi-Peran',
    desc: 'Tampilan khusus untuk Siswa, Guru, Staff, Kepala Sekolah, Admin IT, hingga Super Admin.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: BookOpen,
    title: 'Manajemen Tugas',
    desc: 'Pengelolaan tugas dan pengumpulan tugas terintegrasi antara guru dan siswa.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: CalendarCheck,
    title: 'Presensi Digital',
    desc: 'Pencatatan kehadiran secara real-time yang akurat dan dapat diakses kapan saja.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Bell,
    title: 'Notifikasi Real-time',
    desc: 'Sistem notifikasi pintar untuk pengumuman penting dari sekolah.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'Manajemen Pengguna',
    desc: 'Kelola seluruh akun pengguna sekolah dengan mudah dari satu panel admin.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Shield,
    title: 'Keamanan Multi-Tenant',
    desc: 'Isolasi data antar sekolah yang aman dengan arsitektur multi-tenant modern.',
    color: 'from-cyan-500 to-blue-600',
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

  // Jika sudah login, tampilkan tombol "Ke Dashboard" bukan "Masuk"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-x-hidden">
      {/* ─── Animated background blobs ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* ─── Navbar ─── */}
      <header className="relative z-50 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-black text-lg tracking-tight">
              Portal<span className="text-indigo-400">Sekolah</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#statistik" className="hover:text-white transition-colors">Statistik</a>
            <a href="#tentang" className="hover:text-white transition-colors">Tentang</a>
          </nav>
          <div className="flex items-center gap-3">
            {mounted && isAuthenticated ? (
              <button
                onClick={handleDashboardNav}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
              >
                Masuk
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Platform SaaS Multi-Tenant untuk Sekolah Modern
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
          Kelola Sekolah{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Lebih Cerdas
          </span>
          <br />& Lebih Efisien
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Sistem informasi manajemen sekolah terintegrasi yang menghubungkan guru,
          siswa, orang tua, dan administrasi dalam satu platform yang aman dan real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleDashboardNav}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-2xl text-base font-bold transition-all shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105"
          >
            {mounted && isAuthenticated ? 'Buka Dashboard' : 'Mulai Sekarang — Gratis'}
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#fitur"
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-base font-semibold transition-all hover:scale-105"
          >
            Pelajari Fitur
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-white/40">
          {['✓ Tidak perlu kartu kredit', '✓ Setup kurang dari 5 menit', '✓ Data aman & terenkripsi'].map((t) => (
            <span key={t} className="flex items-center gap-1">{t}</span>
          ))}
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section id="statistik" className="relative z-10 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">
                {s.value}
              </div>
              <div className="text-sm text-white/50 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="fitur" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Semua yang Dibutuhkan{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Sekolah Anda
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Fitur lengkap yang dirancang khusus untuk ekosistem pendidikan Indonesia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} mb-4 shadow-lg`}>
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Roles section ─── */}
      <section id="tentang" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900/60 to-violet-900/60 border border-white/10 p-10 md:p-16 text-center backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Dirancang untuk Semua Peran
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Setiap pengguna mendapatkan tampilan dan akses yang relevan dengan perannya.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
            {['Siswa', 'Guru', 'Staff Administrasi', 'Kepala Sekolah', 'Admin IT', 'Super Admin'].map((r) => (
              <div key={r} className="flex items-center gap-2 px-4 py-3 bg-white/10 rounded-xl text-sm font-semibold border border-white/10">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                {r}
              </div>
            ))}
          </div>
          <button
            onClick={handleDashboardNav}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-2xl text-base font-bold transition-all shadow-2xl shadow-indigo-500/40 hover:scale-105"
          >
            {mounted && isAuthenticated ? 'Buka Dashboard Saya' : 'Coba Sekarang'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            <span className="font-black text-sm">
              Portal<span className="text-indigo-400">Sekolah</span>
            </span>
          </div>
          <p className="text-white/30 text-xs text-center">
            © {new Date().getFullYear()} Portal Sekolah. Platform SaaS Multi-Tenant untuk Pendidikan Indonesia.
          </p>
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
            Masuk ke Sistem →
          </Link>
        </div>
      </footer>
    </div>
  );
}
