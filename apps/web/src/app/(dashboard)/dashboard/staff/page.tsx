'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button } from '@portal-sekolah/ui';
import { CreditCard, FileText, CheckCircle, Search, Sparkles } from 'lucide-react';

export default function StaffDashboard() {
  const stats = [
    { title: 'Invoice SPP Terbuat', value: '1.240 Tagihan', icon: FileText, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
    { title: 'Pembayaran Belum Diverifikasi', value: '8 Invoice', icon: CreditCard, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Realisasi SPP Terkumpul', value: 'Rp 480.200.000', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
  ];

  const pendingPayments = [
    { name: 'Adit Pratama', class: 'XI IPA 1', invoice: 'SPP-2026-05-128', amount: 'Rp 450.000', method: 'BANK_TRANSFER' },
    { name: 'Lulu Nurhaliza', class: 'XI IPA 2', invoice: 'SPP-2026-05-392', amount: 'Rp 450.000', method: 'BANK_TRANSFER' },
    { name: 'Rendra Setiawan', class: 'X IPS 1', invoice: 'SPP-2026-05-021', amount: 'Rp 450.000', method: 'BANK_TRANSFER' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Staff Keuangan"
        description="Tata kelola tagihan SPP bulanan, pembuatan invoice massal sekolah, dan verifikasi transfer manual."
        action={
          <Button className="rounded-xl gap-2 text-xs font-semibold">
            <Sparkles className="h-4 w-4" /> Buat Invoice Baru
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

      {/* Pending Payments Verification */}
      <Card className="border-border/60">
        <CardHeader className="text-left pb-4 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" /> Menunggu Verifikasi Pembayaran Manual
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            data={pendingPayments as any}
            searchKey="name"
            searchPlaceholder="Cari nama siswa..."
            columns={[
              { header: 'Nama Siswa', accessorKey: 'name' },
              { header: 'Kelas', accessorKey: 'class' },
              { header: 'Nomor Invoice', accessorKey: 'invoice' },
              { header: 'Total Nominal', accessorKey: 'amount' },
              {
                header: 'Metode Pembayaran',
                render: (row: any) => (
                  <Badge variant="secondary">
                    {row.method.replace('_', ' ')}
                  </Badge>
                ),
              },
              {
                header: 'Aksi Verifikasi',
                render: () => (
                  <Button variant="outline" size="sm" className="rounded-lg text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700">
                    Konfirmasi
                  </Button>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
