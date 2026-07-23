"use client";

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Search, FileSpreadsheet, FileIcon } from 'lucide-react';
import { PaymentHistoryTable } from './components/payment-history-table';
import { PaymentDetailDrawer } from './components/payment-detail-drawer';
import { apiClient } from '@/lib/api-client';
import { exportToExcel, exportToPDF } from '@/lib/utils/export-utils';

export default function PaymentHistoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [method, setMethod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };
      if (search) params.search = search;
      if (status !== 'all') params.status = status;
      if (method !== 'all') params.method = method;
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
  }, [search, status, method, startDate, endDate]);

  const handleExportExcel = () => {
    const exportData = data.map(item => ({
      'Order ID': item.orderId,
      'Invoice': item.invoiceNumber,
      'Siswa': item.studentName,
      'Nominal': item.amount,
      'Metode': item.paymentMethod,
      'Status': item.status,
      'Waktu Dibuat': new Date(item.createdAt).toLocaleString('id-ID'),
      'Waktu Bayar': item.paidAt ? new Date(item.paidAt).toLocaleString('id-ID') : '-'
    }));
    exportToExcel(exportData, `Riwayat_Pembayaran_${new Date().getTime()}`);
  };

  const handleExportPDF = () => {
    const headers = ['Order ID', 'Invoice', 'Siswa', 'Nominal', 'Metode', 'Status', 'Tgl Bayar'];
    const exportData = data.map(item => [
      item.orderId,
      item.invoiceNumber,
      item.studentName,
      new Intl.NumberFormat('id-ID').format(item.amount),
      item.paymentMethod || '-',
      item.status,
      item.paidAt ? new Date(item.paidAt).toLocaleDateString('id-ID') : '-'
    ]);
    exportToPDF(headers, exportData, 'Laporan Riwayat Pembayaran SPP', `Laporan_Pembayaran_${new Date().getTime()}`);
  };

  const openDetail = (payment: any) => {
    setSelectedPayment(payment);
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Riwayat Pembayaran</h2>
          <p className="text-muted-foreground mt-1">
            Pantau dan kelola seluruh transaksi pembayaran SPP siswa.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileIcon className="mr-2 h-4 w-4 text-red-600" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-card border rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 font-medium text-sm">
          Filtasi Data
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari Nama / Invoice..." 
              className="pl-8" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="all">Semua Metode</option>
            <option value="QRIS">QRIS</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Tunai</option>
          </select>
          <div className="flex flex-col gap-1">
            <Input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              title="Tanggal Mulai"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              title="Tanggal Selesai"
            />
          </div>
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
    </div>
  );
}
