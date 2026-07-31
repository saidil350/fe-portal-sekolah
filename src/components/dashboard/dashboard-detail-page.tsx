'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, BarChart3, Bell, CheckCircle2, CreditCard, Eye, GraduationCap, Megaphone, UserRound, Users, CalendarCheck, BookOpen } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { AnalyticsExplorer } from './analytics-explorer';
import { EnterpriseDataTable } from './enterprise-data-table';
import { DashboardEntity } from '@/stores/dashboard-store';
import { apiClient } from '@/lib/api-client';

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
  const router = useRouter();
  const entityLabel = labelFromSlug(params.entityId ?? params.studentId ?? params.classId);
  const moduleSlug = typeof params.module === 'string' ? params.module : Array.isArray(params.module) ? params.module[0] : '';
  const roleSlug = typeof params.role === 'string' ? params.role : Array.isArray(params.role) ? params.role[0] : 'siswa';
  const moduleLabel = labelFromSlug(params.module);
  const parent = parentPath(pathname);

  const isNotification = moduleSlug === 'notifications';

  const [notificationData, setNotificationData] = React.useState<{
    id?: string;
    title?: string;
    message?: string;
    type?: string;
    targetRole?: string;
    createdAt?: string;
  } | null>(null);

  React.useEffect(() => {
    if (isNotification && params.entityId) {
      const entityIdStr = Array.isArray(params.entityId) ? params.entityId[0] : params.entityId;
      apiClient
        .get<any>('/admin/notifications')
        .then((res) => {
          if (res?.success && Array.isArray(res.data?.data)) {
            const found = res.data.data.find((n: any) => n.id === entityIdStr);
            if (found) {
              setNotificationData(found);
              return;
            }
          }
          return apiClient.get<any>('/notifications');
        })
        .then((res) => {
          if (res?.success && Array.isArray(res.data?.data)) {
            const entityIdStr = Array.isArray(params.entityId) ? params.entityId[0] : params.entityId;
            const found = res.data.data.find((n: any) => n.id === entityIdStr);
            if (found) {
              setNotificationData(found);
            }
          }
        })
        .catch(() => {});
    }
  }, [isNotification, params.entityId]);

  if (isNotification) {
    const title = notificationData?.title || entityLabel;
    const message = notificationData?.message || 'Detail pengumuman notifikasi sekolah.';
    const type = notificationData?.type || 'INFO';
    const targetRole = notificationData?.targetRole || 'Semua User';
    const createdAt = notificationData?.createdAt
      ? new Date(notificationData.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      : null;

    const getActionRoute = () => {
      if (type === 'PAYMENT') return `/dashboard/${roleSlug}/payments`;
      if (type === 'ATTENDANCE') return `/dashboard/${roleSlug}/attendance`;
      if (type === 'ACADEMIC') return `/dashboard/${roleSlug}/classes`;
      return null;
    };
    const actionRoute = getActionRoute();

    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto text-left">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href={parent}>
              <ArrowLeft className="size-4" /> Kembali ke Notifikasi
            </Link>
          </Button>
          <Badge variant="outline" className="uppercase font-semibold">
            {type}
          </Badge>
        </div>

        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Bell className="size-5 text-primary shrink-0" />
                  <CardTitle className="text-xl font-bold">{title}</CardTitle>
                </div>
                {createdAt && <p className="text-xs text-muted-foreground pt-1">Dikirim pada: {createdAt}</p>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="prose prose-sm max-w-none dark:prose-invert text-foreground leading-relaxed text-base">
              {message}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t text-sm">
              <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Target Penerima</span>
                <p className="font-semibold">{targetRole}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Kanal Pengiriman</span>
                <p className="font-semibold">In-App Broadcast</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Status</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">Terkirim & Aktif</p>
              </div>
            </div>

            {actionRoute && (
              <div className="pt-2 flex justify-end">
                <Button size="sm" onClick={() => router.push(actionRoute)} className="gap-2">
                  {type === 'PAYMENT' && <CreditCard className="size-4" />}
                  {type === 'ATTENDANCE' && <CalendarCheck className="size-4" />}
                  {type === 'ACADEMIC' && <BookOpen className="size-4" />}
                  Buka Halaman {type === 'PAYMENT' ? 'Pembayaran' : type === 'ATTENDANCE' ? 'Presensi' : 'Akademik'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const metricsList = [
    { label: 'Pembayaran', value: '88.4%', icon: CreditCard },
    { label: 'Status Sistem', value: 'Aktif', icon: BarChart3 },
    { label: 'Akademik', value: '84.8', icon: GraduationCap },
    { label: 'Profil Terkait', value: '12', icon: UserRound },
  ];

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
      id: 'system-log',
      type: 'Sistem',
      title: 'Log Aktivitas Terkait',
      subtitle: 'Catatan aktivitas dan riwayat pembaruan sistem.',
      href: '#',
      status: 'Aktif',
      metrics: { Status: 'Normal' },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3 text-left">
          <Button variant="ghost" size="sm" asChild className="w-fit gap-2">
            <Link href={parent}>
              <ArrowLeft className="size-4" /> Kembali
            </Link>
          </Button>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{kind}</Badge>
              <Badge variant="outline">{moduleLabel}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{entityLabel}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Halaman detail nested untuk eksplorasi {moduleLabel}. Dari sini user dapat melihat analytics, tabel terkait, dan konteks master-detail tanpa keluar dari alur dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {metricsList.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="rounded-md bg-muted p-2.5 text-muted-foreground">
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
            <BarChart3 className="size-5 text-muted-foreground" /> Catatan Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="text-left text-sm leading-relaxed text-muted-foreground">
          Detail page ini sengaja generik untuk v1 mock SaaS: semua drill-down dari bulan, kelas, siswa, invoice, tugas, dan analytics akan punya halaman hidup dengan konteks yang konsisten.
        </CardContent>
      </Card>
    </div>
  );
}


