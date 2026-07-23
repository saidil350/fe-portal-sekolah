import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Skeleton, Avatar, AvatarFallback } from '@/components/ui';
import { Activity, Server, AlertCircle } from 'lucide-react';

export interface WidgetData {
  recentInvoices: any[];
  outstandingInvoices: any[];
}

interface PaymentWidgetsProps {
  loading: boolean;
  data?: WidgetData;
}

export function PaymentWidgets({ loading, data }: PaymentWidgetsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Lunas</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pending</Badge>;
      case 'FAILED':
      case 'EXPIRED':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Gagal</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Invoice Terbaru */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Invoice Terbaru</span>
            <Badge variant="outline" className="font-normal text-xs">Real-time</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
              <Receipt className="h-8 w-8 mb-2 opacity-20" />
              <p>Belum ada invoice terbaru</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Invoice</TableHead>
                    <TableHead>Siswa</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentInvoices.slice(0, 5).map((invoice: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-xs">{invoice.invoiceNumber || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">{invoice.studentName?.substring(0, 2).toUpperCase() || 'SI'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{invoice.studentName || 'Siswa'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{invoice.month}/{invoice.year}</TableCell>
                      <TableCell className="text-sm font-semibold">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {/* System Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Midtrans Webhook</p>
                  <p className="text-xs text-muted-foreground">Terakhir sync: 2 mnt lalu</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-600">Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/30">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Gateway</p>
                  <p className="text-xs text-muted-foreground">API Connection</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-600">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Invoices List */}
        <Card className="flex-1">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.outstandingInvoices.map((inv: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {inv.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{inv.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.grade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-600">{formatCurrency(inv.amount)}</p>
                    <p className="text-xs text-muted-foreground">{inv.months} Bulan</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dummy icon for empty state
import { Receipt } from 'lucide-react';
