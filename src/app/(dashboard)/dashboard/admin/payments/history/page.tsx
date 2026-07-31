"use client";

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Search, FileSpreadsheet, FileIcon } from 'lucide-react';
import { PaymentHistoryTable } from './components/payment-history-table';
import { PaymentDetailDrawer } from './components/payment-detail-drawer';
import { ExportPaymentModal } from './components/export-payment-modal';
import { apiClient } from '@/lib/api-client';

const MONTHS = [
  { val: 0, label: "Semua Bulan" },
  { val: 1, label: "Januari" },
  { val: 2, label: "Februari" },
  { val: 3, label: "Maret" },
  { val: 4, label: "April" },
  { val: 5, label: "Mei" },
  { val: 6, label: "Juni" },
  { val: 7, label: "Juli" },
  { val: 8, label: "Agustus" },
  { val: 9, label: "September" },
  { val: 10, label: "Oktober" },
  { val: 11, label: "November" },
  { val: 12, label: "Desember" }
];

export default function PaymentHistoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [method, setMethod] = useState('all');
  const [month, setMonth] = useState<number>(0); // 0 means all months
  const [year, setYear] = useState<number>(currentYear);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal Export & Drawer
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'EXCEL' | 'PDF'>('EXCEL');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      if (method !== 'all') params.method = method;
      if (month > 0) params.month = month;
      if (year > 0) params.year = year;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const res = await apiClient.get<any>('/admin/payments/history', { params });
      if (res.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, status, method, month, year, startDate, endDate]);

  const handleOpenExport = (format: 'EXCEL' | 'PDF') => {
    setExportFormat(format);
    setExportModalOpen(true);
  };

  const openDetail = (payment: any) => {
    setSelectedPayment(payment);
    setDrawerOpen(true);
  };

  const years = [0, ...Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Riwayat Pembayaran</h2>
          <p className="text-muted-foreground mt-1">
            Pantau dan kelola seluruh transaksi pembayaran SPP siswa.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleOpenExport('EXCEL')}>
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => handleOpenExport('PDF')}>
            <FileIcon className="mr-2 h-4 w-4 text-red-600" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 font-medium text-sm">
          Filtrasi Data Riwayat
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari Nama / Invoice..." 
              className="pl-8 text-xs" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
            value={month.toString()}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
          >
            {MONTHS.map(m => (
              <option key={m.val} value={m.val.toString()}>{m.label}</option>
            ))}
          </select>

          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
            value={year.toString()}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
          >
            {years.map(y => (
              <option key={y} value={y.toString()}>{y === 0 ? 'Semua Tahun' : y}</option>
            ))}
          </select>

          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="PAID">Lunas (PAID)</option>
            <option value="PENDING">Menunggu (PENDING)</option>
            <option value="EXPIRED">Kedaluwarsa (EXPIRED)</option>
            <option value="FAILED">Gagal (FAILED)</option>
          </select>

          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="all">Semua Metode</option>
            <option value="QRIS">QRIS</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Tunai</option>
          </select>
        </div>
      </div>

      <PaymentHistoryTable 
        data={data} 
        loading={loading}
        onViewDetail={openDetail}
      />

      <PaymentDetailDrawer 
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        payment={selectedPayment}
      />

      <ExportPaymentModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        defaultMonth={month > 0 ? month : currentMonth}
        defaultYear={year > 0 ? year : currentYear}
        defaultStatus={status}
        defaultMethod={method}
        initialFormat={exportFormat}
      />
    </div>
  );
}
