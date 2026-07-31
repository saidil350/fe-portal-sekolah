'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { ArrowLeft, BarChart3, Bell, CheckCircle2, CreditCard, Eye, GraduationCap, Megaphone, UserRound, Users } from 'lucide-react';
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
  const entityLabel = labelFromSlug(params.entityId ?? params.studentId ?? params.classId);
  const moduleSlug = typeof params.module === 'string' ? params.module : Array.isArray(params.module) ? params.module[0] : '';
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
            }
          }
        })
        .catch(() => {});
    }
  }, [isNotification, params.entityId]);

  const metricsList = isNotification
    ? [
        { label: 'Status Pengiriman', value: 'Terkirim', icon: CheckCircle2 },
        { label: 'Target Audiens', value: notificationData?.targetRole || 'Semua User', icon: Users },
        { label: 'Tipe Notifikasi', value: notificationData?.type || 'INFO', icon: Megaphone },
        { label: 'Kanal Broadcast', value: 'In-App', icon: Eye },
      ]
    : [
        { label: 'Pembayaran', value: '88.4%', icon: CreditCard },
        { label: 'Status Sistem', value: 'Aktif', icon: BarChart3 },
        { label: 'Akademik', value: '84.8', icon: GraduationCap },
        { label: 'Profil Terkait', value: '12', icon: UserRound },
      ];

  const entities: DashboardEntity[] = isNotification
    ? [
        {
          id: 'broadcast-status',
          type: 'Broadcast',
          title: notificationData?.title ? `Pengumuman: ${notificationData.title}` : 'Status Pengumuman Sekolah',
          subtitle: notificationData?.message || 'Pengumuman telah didistribusikan ke pengguna.',
          href: '#',
          status: 'Terkirim',
          metrics: { Kanal: 'In-App', Target: notificationData?.targetRole || 'Semua' },
        },
        {
          id: 'delivery-log',
          type: 'Log Sistem',
          title: 'Riwayat Penyampaian Notifikasi',
          subtitle: 'Sistem berhasil mengirim notifikasi in-app ke target audiens.',
          href: '#',
          status: 'Selesai',
          metrics: { Status: 'Sukses', SLA: 'Instan' },
        },
      ]
    : [
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
            <h1 className="text-3xl font-bold tracking-tight">
              {isNotification && notificationData?.title ? notificationData.title : entityLabel}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {isNotification
                ? 'Halaman detail informasi notifikasi dan pengumuman sekolah.'
                : `Halaman detail nested untuk eksplorasi ${moduleLabel}. Dari sini user dapat melihat analytics, tabel terkait, dan konteks master-detail tanpa keluar dari alur dashboard.`}
            </p>
          </div>
        </div>
      </div>

      {isNotification && notificationData?.message && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="size-5 text-primary" /> Pesan Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="text-left space-y-2">
            <p className="text-base font-medium leading-relaxed">{notificationData.message}</p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
              <Badge variant="outline">{notificationData.type || 'INFO'}</Badge>
              <span>Target: <strong>{notificationData.targetRole || 'Semua User'}</strong></span>
              {notificationData.createdAt && (
                <span>• {new Date(notificationData.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
          {isNotification
            ? 'Detail notifikasi ini menyajikan informasi ringkasan pengumuman, audiens target, dan log pengiriman.'
            : 'Detail page ini sengaja generik untuk v1 mock SaaS: semua drill-down dari bulan, kelas, siswa, invoice, tugas, dan analytics akan punya halaman hidup dengan konteks yang konsisten.'}
        </CardContent>
      </Card>
    </div>
  );
}

