import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, 
  Badge, Button, Avatar, AvatarFallback
} from '@/components/ui';
import { Eye } from 'lucide-react';

interface PaymentHistoryTableProps {
  data: any[];
  loading: boolean;
  onViewDetail: (payment: any) => void;
}

export function PaymentHistoryTable({ data, loading, onViewDetail }: PaymentHistoryTableProps) {
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
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PAID':
      case 'SETTLEMENT':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Lunas</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pending</Badge>;
      case 'FAILED':
      case 'EXPIRED':
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Gagal</Badge>;
      default:
        return <Badge variant="outline">{status || 'Draft'}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-md text-xs">
        Memuat riwayat pembayaran...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-md text-xs">
        Tidak ada data pembayaran yang ditemukan.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table className="whitespace-nowrap">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="text-xs">Order ID</TableHead>
            <TableHead className="text-xs">Invoice</TableHead>
            <TableHead className="text-xs">Siswa</TableHead>
            <TableHead className="text-xs">Nominal</TableHead>
            <TableHead className="text-xs">Metode</TableHead>
            <TableHead className="text-xs">Status DB</TableHead>
            <TableHead className="text-xs">Tgl Bayar</TableHead>
            <TableHead className="text-xs text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id} className="hover:bg-muted/40 transition-colors">
              <TableCell className="font-mono text-xs text-muted-foreground">{payment.orderId}</TableCell>
              <TableCell className="text-xs font-mono font-medium">{payment.invoiceNumber}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                      {payment.studentName?.substring(0, 2).toUpperCase() || 'SI'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{payment.studentName || 'Siswa'}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs font-semibold">{formatCurrency(payment.amount)}</TableCell>
              <TableCell className="text-xs capitalize">{payment.paymentMethod || '-'}</TableCell>
              <TableCell className="text-xs">{getStatusBadge(payment.status)}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDate(payment.paidAt)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onViewDetail(payment)}>
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
