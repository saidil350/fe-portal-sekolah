"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger, Button } from '@/components/ui';
import { PaymentWidgets } from '../../admin/payments/components/payment-widgets';
import PaymentHistoryPage from '../../admin/payments/history/page';
import { useRouter } from 'next/navigation';
import { FileText, Plus } from 'lucide-react';

export default function BendaharaPaymentsPage() {
  const router = useRouter();

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kelola Pembayaran & Tagihan SPP</h2>
          <p className="text-muted-foreground mt-1">
            Pantau daftar tagihan (invoice), publikasikan tagihan bulanan, dan kelola riwayat transaksi siswa.
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/bendahara/payments/tariffs')} className="gap-2">
          <FileText className="h-4 w-4" /> Kelola Tarif SPP
        </Button>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="invoices">Semua Tagihan (Invoices)</TabsTrigger>
          <TabsTrigger value="history">Riwayat Transaksi</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="mt-4">
          <PaymentWidgets />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <PaymentHistoryPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
