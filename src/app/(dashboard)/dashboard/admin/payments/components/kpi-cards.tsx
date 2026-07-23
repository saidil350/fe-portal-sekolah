import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { Receipt, CheckCircle, Clock, XCircle, DollarSign, Wallet, AlertCircle, TrendingUp } from 'lucide-react';

export interface KpiData {
  totalTagihan: number;
  totalLunas: number;
  totalPending: number;
  totalGagal: number;
  pendapatanHariIni: number;
  pendapatanBulanIni: number;
  outstandingPayment: number;
  successRate: number;
}

interface KpiCardsProps {
  loading: boolean;
  data?: KpiData;
}

export function KpiCards({ loading, data }: KpiCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpis = [
    {
      title: 'Total Tagihan',
      value: data?.totalTagihan || 0,
      isCurrency: true,
      icon: Receipt,
      description: 'Seluruh invoice dibuat',
      color: 'text-blue-500',
    },
    {
      title: 'Total Lunas',
      value: data?.totalLunas || 0,
      isCurrency: true,
      icon: CheckCircle,
      description: 'Invoice berhasil dibayar',
      color: 'text-green-500',
    },
    {
      title: 'Total Pending',
      value: data?.totalPending || 0,
      isCurrency: false,
      suffix: ' Invoice',
      icon: Clock,
      description: 'Menunggu pembayaran',
      color: 'text-yellow-500',
    },
    {
      title: 'Total Gagal',
      value: data?.totalGagal || 0,
      isCurrency: false,
      suffix: ' Invoice',
      icon: XCircle,
      description: 'Expired / Dibatalkan',
      color: 'text-red-500',
    },
    {
      title: 'Pendapatan Hari Ini',
      value: data?.pendapatanHariIni || 0,
      isCurrency: true,
      icon: DollarSign,
      description: 'Dana masuk hari ini',
      color: 'text-emerald-500',
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: data?.pendapatanBulanIni || 0,
      isCurrency: true,
      icon: Wallet,
      description: 'Akumulasi bulan berjalan',
      color: 'text-indigo-500',
    },
    {
      title: 'Outstanding Payment',
      value: data?.outstandingPayment || 0,
      isCurrency: true,
      icon: AlertCircle,
      description: 'Potensi kas tertunda',
      color: 'text-orange-500',
    },
    {
      title: 'Success Rate',
      value: data?.successRate || 0,
      isCurrency: false,
      suffix: '%',
      icon: TrendingUp,
      description: 'Rasio sukses bayar',
      color: 'text-teal-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {kpi.title}
            </CardTitle>
            <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {kpi.isCurrency 
                    ? formatCurrency(kpi.value as number) 
                    : `${kpi.value}${kpi.suffix || ''}`}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.description}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
