"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { FileSpreadsheet, FileIcon, Download, X, Calendar, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { exportToExcel, exportToPDF } from '@/lib/utils/export-utils';

interface ExportPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMonth?: number;
  defaultYear?: number;
  defaultStatus?: string;
  defaultMethod?: string;
  initialFormat?: 'EXCEL' | 'PDF';
}

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

export function ExportPaymentModal({
  open,
  onOpenChange,
  defaultMonth = new Date().getMonth() + 1,
  defaultYear = new Date().getFullYear(),
  defaultStatus = 'all',
  defaultMethod = 'all',
  initialFormat = 'EXCEL'
}: ExportPaymentModalProps) {
  const [month, setMonth] = useState<number>(defaultMonth);
  const [year, setYear] = useState<number>(defaultYear);
  const [status, setStatus] = useState<string>(defaultStatus);
  const [method, setMethod] = useState<string>(defaultMethod);
  const [format, setFormat] = useState<'EXCEL' | 'PDF'>(initialFormat);
  const [downloading, setDownloading] = useState(false);

  if (!open) return null;

  const currentYear = new Date().getFullYear();
  const years = [0, ...Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)];

  const handleExport = async () => {
    try {
      setDownloading(true);
      const params: any = { page: 1, limit: 1000 };
      if (month > 0) params.month = month;
      if (year > 0) params.year = year;
      if (status !== 'all') params.status = status;
      if (method !== 'all') params.method = method;

      const res = await apiClient.get<any>('/admin/payments/history', { params });
      
      const exportItems = (res.success && res.data?.data) ? res.data.data : [];

      if (exportItems.length === 0) {
        alert('Tidak ada data riwayat transaksi untuk filter yang dipilih.');
        setDownloading(false);
        return;
      }

      const selectedMonthLabel = MONTHS.find(m => m.val === month)?.label || 'Semua';
      const yearLabel = year > 0 ? year.toString() : 'Semua';
      const timeStamp = new Date().getTime();

      if (format === 'EXCEL') {
        const exportData = exportItems.map((item: any) => ({
          'Order ID': item.orderId,
          'Invoice': item.invoiceNumber,
          'Siswa': item.studentName,
          'Bulan SPP': item.invoiceMonth ? MONTHS.find(m => m.val === item.invoiceMonth)?.label : '-',
          'Tahun SPP': item.invoiceYear || '-',
          'Nominal (Rp)': item.amount,
          'Metode': item.paymentMethod || 'Tunai',
          'Status': item.status,
          'Waktu Dibuat': new Date(item.createdAt).toLocaleString('id-ID'),
          'Waktu Bayar': item.paidAt ? new Date(item.paidAt).toLocaleString('id-ID') : '-'
        }));
        exportToExcel(exportData, `Laporan_Pembayaran_SPP_${selectedMonthLabel}_${yearLabel}_${timeStamp}`);
      } else {
        const headers = ['Order ID', 'Invoice', 'Siswa', 'Periode', 'Nominal', 'Metode', 'Status', 'Tgl Bayar'];
        const exportData = exportItems.map((item: any) => [
          item.orderId,
          item.invoiceNumber,
          item.studentName,
          `${item.invoiceMonth ? MONTHS.find(m => m.val === item.invoiceMonth)?.label : ''} ${item.invoiceYear || ''}`.trim() || '-',
          new Intl.NumberFormat('id-ID').format(item.amount),
          item.paymentMethod || '-',
          item.status,
          item.paidAt ? new Date(item.paidAt).toLocaleDateString('id-ID') : '-'
        ]);
        exportToPDF(
          headers,
          exportData,
          `Laporan Riwayat Pembayaran SPP (${selectedMonthLabel} ${yearLabel})`,
          `Laporan_Pembayaran_SPP_${selectedMonthLabel}_${yearLabel}_${timeStamp}`
        );
      }

      onOpenChange(false);
    } catch (err: any) {
      console.error('Export failed:', err);
      alert(err.message || 'Gagal mengeksport data.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-background border shadow-2xl scale-100">
        <CardHeader className="pb-4 border-b flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            {format === 'EXCEL' ? (
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            ) : (
              <FileIcon className="h-5 w-5 text-red-600" />
            )}
            Export Laporan Pembayaran SPP
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onOpenChange(false)}
            disabled={downloading}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-xs text-muted-foreground">
            Pilih filter periode bulan, tahun, dan format dokumen sebelum mengunduh data riwayat pembayaran SPP.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Filter Bulan */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Filter Bulan
              </label>
              <Select
                value={month.toString()}
                onValueChange={(val) => setMonth(parseInt(val, 10))}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(m => (
                    <SelectItem key={m.val} value={m.val.toString()} className="text-xs">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Tahun */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Filter Tahun
              </label>
              <Select
                value={year.toString()}
                onValueChange={(val) => setYear(parseInt(val, 10))}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={y.toString()} className="text-xs">
                      {y === 0 ? "Semua Tahun" : y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Filter Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-primary" /> Status Transaksi
              </label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Semua Status</SelectItem>
                  <SelectItem value="PAID" className="text-xs">Lunas (PAID)</SelectItem>
                  <SelectItem value="PENDING" className="text-xs">Menunggu (PENDING)</SelectItem>
                  <SelectItem value="EXPIRED" className="text-xs">Kedaluwarsa (EXPIRED)</SelectItem>
                  <SelectItem value="FAILED" className="text-xs">Gagal (FAILED)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format File */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Download className="h-3.5 w-3.5 text-primary" /> Format Output
              </label>
              <Select
                value={format}
                onValueChange={(val: 'EXCEL' | 'PDF') => setFormat(val)}
              >
                <SelectTrigger className="h-9 text-xs font-semibold">
                  <SelectValue placeholder="Pilih Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCEL" className="text-xs font-medium text-green-700">
                    Format Excel (.xlsx)
                  </SelectItem>
                  <SelectItem value="PDF" className="text-xs font-medium text-red-700">
                    Format PDF (.pdf)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end items-center gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs px-4"
              onClick={() => onOpenChange(false)}
              disabled={downloading}
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              className={`h-9 text-xs px-4 font-semibold text-white shadow-sm flex items-center gap-2 ${
                format === 'EXCEL' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={handleExport}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Unduh {format === 'EXCEL' ? 'Excel' : 'PDF'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
