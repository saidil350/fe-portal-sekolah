'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button } from '@portal-sekolah/ui';
import { Award, CalendarCheck, CreditCard, Sparkles, TrendingUp } from 'lucide-react';

export default function KepalaSekolahDashboard() {
  const stats = [
    { title: 'Persentase Kehadiran Hari Ini', value: '96.2%', icon: CalendarCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Realisasi SPP Bulan Ini', value: '88.4%', icon: CreditCard, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
    { title: 'Rata-rata Nilai Akademik', value: '84.8', icon: Award, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
  ];

  const financialOverview = [
    { month: 'Januari 2026', target: 'Rp 120.000.000', actual: 'Rp 118.500.000', percentage: '98.7%' },
    { month: 'Februari 2026', target: 'Rp 120.000.000', actual: 'Rp 115.200.000', percentage: '96.0%' },
    { month: 'Maret 2026', target: 'Rp 120.000.000', actual: 'Rp 109.800.000', percentage: '91.5%' },
    { month: 'April 2026', target: 'Rp 120.000.000', actual: 'Rp 106.080.000', percentage: '88.4%' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Kepala Sekolah"
        description="Ringkasan pemantauan kualitas akademik, laporan rekapitulasi presensi, dan realisasi penerimaan SPP."
        action={
          <Button className="rounded-xl gap-2 text-xs font-semibold">
            <TrendingUp className="h-4 w-4" /> Unduh Laporan Tahunan
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

      {/* Financial Chart/Table Overview */}
      <Card className="border-border/60">
        <CardHeader className="text-left pb-4 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Ringkasan Keuangan SPP Semester Genap
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            data={financialOverview as any}
            columns={[
              { header: 'Bulan Akademik', accessorKey: 'month' },
              { header: 'Target Penerimaan', accessorKey: 'target' },
              { header: 'Realisasi Pembayaran', accessorKey: 'actual' },
              {
                header: 'Persentase Sukses',
                render: (row: any) => (
                  <Badge variant={row.percentage.startsWith('9') ? 'success' : 'default'}>
                    {row.percentage}
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
