'use client';

import * as React from 'react';
import { CheckCircle2, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/components/dialog';
import { Button } from '@/components/ui/components/button';
import { Badge } from '@/components/ui/components/badge';
import { formatCurrency } from '@/lib/utils';

export interface ReceiptPayment {
  id: string;
  title: string;
  month: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  paidAt?: string;
  method?: string;
}

interface ReceiptDialogProps {
  payment: ReceiptPayment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-dashed border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value ?? '-'}
      </span>
    </div>
  );
}

export function ReceiptDialog({ payment, open, onOpenChange }: ReceiptDialogProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] text-left">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Kuitansi Digital
          </DialogTitle>
          <DialogDescription>
            Bukti pembayaran SPP. Simpan atau cetak untuk arsip Anda.
          </DialogDescription>
        </DialogHeader>

        {payment && (
          <div className="space-y-1">
            <div className="rounded-lg border bg-muted/40 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  {payment.id}
                </span>
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                  LUNAS
                </Badge>
              </div>
              <h3 className="text-base font-semibold mt-1">{payment.title}</h3>
            </div>

            <div className="px-1 pt-2">
              <Row label="Nominal" value={formatCurrency(payment.amount)} />
              <Row label="Periode" value={payment.month} />
              <Row label="Metode Pembayaran" value={payment.method} />
              <Row label="Tanggal Dibayar" value={payment.paidAt} />
              <Row label="Status" value="Pembayaran Diterima" />
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" />
            Cetak / Unduh
          </Button>
          <Button onClick={() => onOpenChange(false)}>Selesai</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
