"use client";

import React from 'react';
import { PaymentWidgets } from './components/payment-widgets';

export default function AdminPaymentsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Pembayaran</h2>
          <p className="text-muted-foreground mt-1">
            Pantau daftar invoice terbaru dan status pembayaran SPP sekolah.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <PaymentWidgets />
      </div>
    </div>
  );
}
