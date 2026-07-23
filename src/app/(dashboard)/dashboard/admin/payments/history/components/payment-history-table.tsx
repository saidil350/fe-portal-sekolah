import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, 
  Badge, Button 
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

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-md">
        Memuat riwayat pembayaran...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-md">
        Tidak ada data pembayaran yang ditemukan.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Siswa</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead>Status DB</TableHead>
            <TableHead>Tgl Bayar</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-mono text-xs">{payment.orderId}</TableCell>
              <TableCell>{payment.invoiceNumber}</TableCell>
              <TableCell className="font-medium">{payment.studentName}</TableCell>
              <TableCell>{formatCurrency(payment.amount)}</TableCell>
              <TableCell>{payment.paymentMethod || '-'}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    payment.status === 'PAID' || payment.status === 'SETTLEMENT' 
                      ? 'default' 
                      : payment.status === 'PENDING' 
                        ? 'secondary' 
                        : 'destructive'
                  }
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(payment.paidAt)}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewDetail(payment)}>
                  <Eye className="h-4 w-4 mr-1" />
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
