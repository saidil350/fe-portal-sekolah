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
import { CreditCard, TrendingUp, ArrowRight, Wallet, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function BendaharaDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiClient.get<any>('/admin/payments/summary');
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch payment summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const stats = [
    {
      title: 'Total Pemasukan Bulan Ini',
      value: summary?.kpiData ? `Rp ${Number(summary.kpiData.pendapatanBulanIni || 0).toLocaleString('id-ID')}` : summary ? `Rp ${Number(summary.paidAmount || 0).toLocaleString('id-ID')}` : 'Rp 480.200.000',
      icon: Wallet,
      description: summary?.kpiData ? `${summary.kpiData.totalLunas || 0} invoice lunas` : summary ? `${summary.paidCount || 0} invoice lunas` : '1.232 invoice lunas',
    },
    {
      title: 'Pending Pembayaran',
      value: summary?.kpiData ? `Rp ${Number(summary.kpiData.outstandingPayment || 0).toLocaleString('id-ID')}` : summary ? `Rp ${Number(summary.pendingAmount || 0).toLocaleString('id-ID')}` : 'Rp 14.800.000',
      icon: Clock,
      description: summary?.kpiData ? `${summary.kpiData.totalPending || 0} invoice pending` : summary ? `${summary.pendingCount || 0} invoice pending` : '8 invoice pending',
    },
    {
      title: 'Tingkat Kelunasan',
      value: summary?.kpiData ? `${summary.kpiData.successRate || 0}%` : '85%',
      icon: CheckCircle2,
      description: 'Persentase tagihan terbayar',
    },
  ];

  return (
    <div className="space-y-6 p-6 sm:p-8">
      <PageHeader
        title="Dashboard Keuangan & Bendahara Sekolah"
        description="Pusat pengelolaan pembuatan invoice tagihan, publikasi pembayaran, dan monitoring transaksi keuangan sekolah."
        action={
          <Button onClick={() => router.push('/dashboard/bendahara/payments')} className="gap-2">
            <CreditCard className="h-4 w-4" /> Kelola Pembayaran
          </Button>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.title}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
                <div className="p-3 rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Akses Cepat Kelola Pembayaran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/bendahara/payments')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Generate & Publish Tagihan
            </CardTitle>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generate invoice massal bulanan untuk semua siswa dan publish tagihan agar siswa/orang tua dapat melakukan pembayaran.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/bendahara/payments')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Riwayat Transaksi & Pembayaran
            </CardTitle>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lihat dan pantau riwayat pembayaran yang masuk dari siswa secara real-time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
