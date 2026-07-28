"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { PaymentWidgets } from './components/payment-widgets';
import PaymentHistoryPage from './history/page';

export default function AdminPaymentsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Pembayaran</h2>
          <p className="text-muted-foreground mt-1">
            Pantau daftar tagihan (invoice) dan kelola riwayat transaksi pembayaran SPP.
          </p>
        </div>
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
