'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/dashboard-route-page';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { Award, CalendarCheck, CreditCard, Download, TrendingUp, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function KepalaSekolahDashboard() {
  const router = useRouter();

  const stats = [
    { title: 'Persentase Kehadiran Hari Ini', value: '96.2%', icon: CalendarCheck, trend: '+1.2% dari kemarin' },
    { title: 'Realisasi SPP Bulan Ini', value: '88.4%', icon: CreditCard, trend: 'Rp 106,08 Jt dari target' },
    { title: 'Rata-rata Nilai Akademik', value: '84.8', icon: Award, trend: 'Dari 36 rombel aktif' },
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
          <div className="flex items-center gap-2">
            <Button className="gap-2">
              <Download className="h-4 w-4" /> Export Laporan
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.title}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.trend}</p>
                </div>
                <div className="p-3 rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Financial Chart/Table Overview */}
      <Card>
        <CardHeader className="text-left pb-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" /> Ringkasan Keuangan SPP Semester Genap
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => router.push('/dashboard/kepala-sekolah/payments')}
          >
            Detail Keuangan
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bulan Akademik</TableHead>
                <TableHead>Target Penerimaan</TableHead>
                <TableHead>Realisasi Pembayaran</TableHead>
                <TableHead>Persentase Sukses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialOverview.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell>{item.target}</TableCell>
                  <TableCell>{item.actual}</TableCell>
                  <TableCell>
                    <Badge variant={parseFloat(item.percentage) >= 95 ? 'outline' : 'default'}>
                      {item.percentage}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
