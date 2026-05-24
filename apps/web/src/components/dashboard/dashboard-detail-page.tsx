'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ArrowLeft, BarChart3, CalendarCheck, CreditCard, GraduationCap, UserRound } from 'lucide-react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@portal-sekolah/ui';
import { AnalyticsExplorer } from './analytics-explorer';
import { EnterpriseDataTable } from './enterprise-data-table';
import { DashboardEntity } from '@/stores/dashboard-store';

function labelFromSlug(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value.join(' ') : value ?? 'detail';
  return raw
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parentPath(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  return `/${parts.slice(0, -1).join('/')}`;
}

export function DashboardDetailPage({ kind = 'detail' }: { kind?: 'detail' | 'analytics' | 'student' | 'class' }) {
  const params = useParams();
  const pathname = usePathname();
  const entityLabel = labelFromSlug(params.entityId ?? params.studentId ?? params.classId);
  const moduleLabel = labelFromSlug(params.module);
  const parent = parentPath(pathname);

  const entities: DashboardEntity[] = [
    {
      id: 'payment-cycle',
      type: 'Transaksi',
      title: 'Siklus pembayaran aktif',
      subtitle: 'Invoice, QRIS, dan transfer manual dalam satu alur.',
      href: `${pathname}/payment-cycle`,
      status: 'Aktif',
      metrics: { Realisasi: '88.4%', Invoice: '132', SLA: '3 jam' },
    },
    {
      id: 'class-performance',
      type: 'Kelas',
      title: 'Performa kelas terkait',
      subtitle: 'Presensi, tugas, nilai, dan risiko akademik.',
      href: `${pathname}/class-performance`,
      status: 'Perlu Pantau',
      metrics: { Presensi: '96.2%', Nilai: '84.8', Tugas: '92.6%' },
    },
    {
      id: 'student-profile',
      type: 'Siswa',
      title: 'Profil siswa terkait',
      subtitle: 'Riwayat akademik, pembayaran, dan presensi.',
      href: `${pathname}/student-profile`,
      status: 'Aktif',
      metrics: { Kehadiran: '98.2%', Tagihan: '1', Nilai: '92' },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3 text-left">
          <Link
            href={parent}
            className="inline-flex h-9 w-fit items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="size-4" /> Kembali
          </Link>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{kind}</Badge>
              <Badge variant="outline">{moduleLabel}</Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight">{entityLabel}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Halaman detail nested untuk eksplorasi {moduleLabel}. Dari sini user dapat melihat analytics, tabel terkait,
              dan konteks master-detail tanpa keluar dari alur dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: 'Pembayaran', value: '88.4%', icon: CreditCard },
          { label: 'Presensi', value: '96.2%', icon: CalendarCheck },
          { label: 'Akademik', value: '84.8', icon: GraduationCap },
          { label: 'Profil terkait', value: '12', icon: UserRound },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 text-2xl font-black">{metric.value}</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-muted-foreground">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AnalyticsExplorer
        title={`Analytics ${entityLabel}`}
        description="Chart detail ini dapat dibuka dari card statistik, titik chart, atau row tabel."
        data={[
          { id: 'jan', label: 'Jan', value: 82, secondary: 76, href: `${pathname}/januari` },
          { id: 'feb', label: 'Feb', value: 88, secondary: 81, href: `${pathname}/februari` },
          { id: 'mar', label: 'Mar', value: 91, secondary: 84, href: `${pathname}/maret` },
          { id: 'apr', label: 'Apr', value: 96, secondary: 89, href: `${pathname}/april` },
        ]}
      />

      <EnterpriseDataTable
        title="Entitas Terkait"
        data={entities}
        columns={[
          { header: 'Nama', accessorKey: 'title' },
          { header: 'Tipe', accessorKey: 'type' },
          { header: 'Deskripsi', accessorKey: 'subtitle' },
          { header: 'Status', accessorKey: 'status' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="size-5 text-primary" /> Catatan Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="text-left text-sm leading-relaxed text-muted-foreground">
          Detail page ini sengaja generik untuk v1 mock SaaS: semua drill-down dari bulan, kelas, siswa, invoice,
          tugas, dan analytics akan punya halaman hidup dengan konteks yang konsisten.
        </CardContent>
      </Card>
    </div>
  );
}
