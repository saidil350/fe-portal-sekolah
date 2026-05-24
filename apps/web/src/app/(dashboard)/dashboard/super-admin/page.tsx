'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button } from '@portal-sekolah/ui';
import { ShieldCheck, School, Activity, CreditCard, Sparkles } from 'lucide-react';

export default function SuperAdminDashboard() {
  const stats = [
    { title: 'Total Sekolah (Tenant)', value: '38 Sekolah', icon: School, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
    { title: 'Total Pendapatan Bulanan', value: 'Rp 148.500.000', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Status Layanan Cloud', value: '99.98% Online', icon: Activity, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/30' },
  ];

  const tenantsData = [
    { name: 'SMA Negeri 1 Jakarta', domain: 'sman1jkt.portalsekolah.id', plan: 'Enterprise', status: 'ACTIVE' },
    { name: 'SMP Kristen Yusuf', domain: 'smpkyusuf.portalsekolah.id', plan: 'Pro', status: 'ACTIVE' },
    { name: 'SD Al-Azhar Pusat', domain: 'sdalazhar.portalsekolah.id', plan: 'Enterprise', status: 'ACTIVE' },
    { name: 'SMK Taruna Bhakti', domain: 'smktaruna.portalsekolah.id', plan: 'Starter', status: 'SUSPENDED' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Super Admin"
        description="Portal tata kelola multisekolah (SaaS Multi-Tenant) dan pemantauan sistem global."
        action={
          <Button className="rounded-xl gap-2 text-xs font-semibold">
            <Sparkles className="h-4 w-4" /> Tambah Sekolah Baru
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="border-border/60 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{s.title}</p>
                  <p className="text-2xl font-black">{s.value}</p>
                </div>
                <div className={`p-3.5 rounded-2xl ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tenant List */}
      <Card className="border-border/60">
        <CardHeader className="text-left pb-4 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Daftar Tenant Sekolah Terdaftar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            data={tenantsData as any}
            searchKey="name"
            searchPlaceholder="Cari nama sekolah..."
            columns={[
              { header: 'Nama Sekolah', accessorKey: 'name' },
              { header: 'Domain Sekolah', accessorKey: 'domain' },
              {
                header: 'Paket Berlangganan',
                render: (row: any) => (
                  <Badge variant={row.plan === 'Enterprise' ? 'default' : 'secondary'}>
                    {row.plan}
                  </Badge>
                ),
              },
              {
                header: 'Status Tenant',
                render: (row: any) => (
                  <Badge variant={row.status === 'ACTIVE' ? 'success' : 'destructive'}>
                    {row.status === 'ACTIVE' ? 'Aktif' : 'Ditangguhkan'}
                  </Badge>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
