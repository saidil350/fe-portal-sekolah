import React from 'react';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  Badge, Button, Separator 
} from '@/components/ui';
import { Download, FileText, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { downloadReceipt } from '@/lib/utils/export-utils';

interface PaymentDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: any;
}

export function PaymentDetailDrawer({ open, onOpenChange, payment }: PaymentDetailDrawerProps) {
  if (!payment) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'SETTLEMENT':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'EXPIRED':
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            {getStatusIcon(payment.status)}
            Detail Pembayaran
          </SheetTitle>
          <SheetDescription>
            No. Invoice: <span className="font-mono text-xs font-semibold">{payment.invoiceNumber || '-'}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Dibayar</span>
              <span className="text-xl font-bold">{formatCurrency(payment.amount || 0)}</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <Badge variant={payment.status === 'PAID' ? 'default' : 'secondary'}>
                  {payment.status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Metode</p>
                <p className="font-medium">{payment.paymentMethod || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Waktu Bayar</p>
                <p className="font-medium">{formatDate(payment.paidAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Tipe Pembayaran</p>
                <p className="font-medium capitalize">{payment.paymentType?.replace(/_/g, ' ') || '-'}</p>
              </div>
            </div>
          </div>

          {/* User & Invoice Details */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Informasi Tagihan</h4>
            <div className="space-y-2 text-sm border p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Siswa</span>
                <span className="font-medium">{payment.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">No. Invoice</span>
                <span className="font-medium font-mono">{payment.invoiceNumber || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Periode</span>
                <span className="font-medium">Bulan {payment.invoiceMonth} / {payment.invoiceYear}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Timeline Transaksi</h4>
            <div className="space-y-4 border-l-2 border-muted ml-3 pl-4 relative">
              <div className="relative">
                <div className="absolute -left-6 bg-background border-2 border-muted p-1 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <p className="text-sm font-medium">Order Dibuat</p>
                <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
              </div>
              
              {payment.paidAt && (
                <div className="relative">
                  <div className="absolute -left-6 bg-background border-2 border-muted p-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <p className="text-sm font-medium">Pembayaran Berhasil</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payment.paidAt)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            <Button className="w-full" onClick={() => downloadReceipt(payment)} disabled={payment.status !== 'PAID' && payment.status !== 'SETTLEMENT'}>
              <Download className="mr-2 h-4 w-4" />
              Unduh Kuitansi (PDF)
            </Button>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
