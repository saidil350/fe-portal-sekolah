'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui';
import {
  CreditCard,
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Send,
  Eye,
  BarChart3,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  Building2,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { formatDisplayId, getReadableInvoiceRef } from '@/lib/utils';
import { exportToExcel } from '@/lib/utils/export-utils';

export interface InvoiceItem {
  id?: string;
  invoiceNumber?: string;
  studentName?: string;
  month?: number;
  year?: number;
  amount?: number;
  status?: string;
  dueDate?: string;
  createdAt?: string;
  paidAt?: string;
  orderId?: string;
  paymentMethod?: string;
}

const getMonthName = (monthNum?: number) => {
  if (!monthNum) return '';
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[monthNum - 1] || '';
};

const formatInvoiceRef = (inv?: InvoiceItem | null) => {
  if (!inv) return '';
  return inv.invoiceNumber || getReadableInvoiceRef({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    month: inv.month !== undefined ? String(inv.month) : undefined
  });
};

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const safeVal = Math.min(100, Math.max(0, value || 0));
  return (
    <div className={`h-2 w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${safeVal}%` }} />
    </div>
  );
}

export default function KepalaSekolahPaymentsPage() {
  const [loading, setLoading] = useState(true);

  // Stats KPI Data
  const [summaryData, setSummaryData] = useState<any>(null);

  // Invoices Table Data
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [totalInvoicesCount, setTotalInvoicesCount] = useState(0);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'FAILED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Dialog State (Read-only Detail Monitoring)
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState<InvoiceItem | null>(null);

  // Dialog State (Arahkan Koreksi ke Bendahara)
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionTargetInvoice, setCorrectionTargetInvoice] = useState<InvoiceItem | null>(null);
  const [correctionTitle, setCorrectionTitle] = useState('');
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [correctionPriority, setCorrectionPriority] = useState<'NORMAL' | 'HIGH'>('NORMAL');
  const [submittingCorrection, setSubmittingCorrection] = useState(false);
  const [correctionSuccessMsg, setCorrectionSuccessMsg] = useState<string | null>(null);

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  // Fetch Data (Summary + Invoices)
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('month', selectedMonth.toString());
      params.set('year', selectedYear.toString());

      const [summaryRes, invoicesRes] = await Promise.all([
        apiClient.get<any>('/admin/payments/summary'),
        apiClient.get<any>(`/admin/payments/invoices?${params.toString()}`)
      ]);

      if (summaryRes.success && summaryRes.data) {
        setSummaryData(summaryRes.data);
      }

      if (invoicesRes.success && invoicesRes.data) {
        const list = Array.isArray(invoicesRes.data)
          ? invoicesRes.data
          : (invoicesRes.data.items || []);
        setInvoices(list);
        setTotalInvoicesCount(invoicesRes.data.total || list.length);
      }
    } catch (err) {
      console.error('Error fetching data monitoring SPP:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearch, statusFilter, selectedMonth, selectedYear]);

  // Export Report
  const handleExport = () => {
    const exportData = invoices.map((inv) => ({
      'Nomor Invoice': formatInvoiceRef(inv),
      'Order ID': inv.orderId || formatDisplayId(inv.id, 'INV'),
      'Nama Siswa': inv.studentName || 'Siswa',
      'Bulan SPP': `${getMonthName(inv.month)} ${inv.year}`,
      'Nominal (Rp)': inv.amount || 0,
      'Status Pembayaran': inv.status === 'PAID' ? 'Lunas' : inv.status === 'PENDING' ? 'Belum Bayar' : 'Gagal',
      'Metode Pembayaran': inv.paymentMethod || '-',
      'Tanggal Jatuh Tempo': inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('id-ID') : '-'
    }));

    exportToExcel(exportData, `Monitoring_SPP_KepalaSekolah_${selectedMonth}_${selectedYear}`);
  };

  // Submit Correction Request to Bendahara
  const handleOpenCorrectionModal = (inv?: InvoiceItem | null) => {
    const target = inv || selectedInvoiceDetails;
    setCorrectionTargetInvoice(target);
    if (target) {
      setCorrectionTitle(`Permintaan Koreksi Tagihan SPP - Siswa ${target.studentName || ''} (${getMonthName(target.month)} ${target.year})`);
    } else {
      setCorrectionTitle('Instruksi / Catatan Pengawasan SPP untuk Bendahara');
    }
    setCorrectionNotes('');
    setCorrectionPriority('NORMAL');
    setCorrectionSuccessMsg(null);
    setIsCorrectionModalOpen(true);
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTitle.trim() || !correctionNotes.trim()) {
      alert('Harap isi judul dan catatan arahan koreksi.');
      return;
    }

    try {
      setSubmittingCorrection(true);
      
      const payload = {
        title: `[Arahan Kepala Sekolah] ${correctionTitle}`,
        message: `${correctionNotes}\n\nDetail Invoice Target:\n- Siswa: ${correctionTargetInvoice?.studentName || '-'}\n- Periode: ${getMonthName(correctionTargetInvoice?.month)} ${correctionTargetInvoice?.year}\n- Status Saat Ini: ${correctionTargetInvoice?.status || '-'}\n- Nominal: Rp ${(correctionTargetInvoice?.amount || 0).toLocaleString('id-ID')}\n\nPermintaan Prioritas: ${correctionPriority}`,
        type: correctionPriority === 'HIGH' ? 'WARNING' : 'INFO',
        targetRole: 'BENDAHARA'
      };

      const res = await apiClient.post<any>('/notifications/broadcast', payload);

      if (res.success || res.data) {
        setCorrectionSuccessMsg('Permintaan/arahan koreksi telah berhasil dikirimkan ke Bendahara.');
        setTimeout(() => {
          setIsCorrectionModalOpen(false);
          setCorrectionSuccessMsg(null);
        }, 2000);
      } else {
        alert(res.error?.message || 'Gagal mengirimkan arahan koreksi ke Bendahara.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat mengirimkan notifikasi.');
    } finally {
      setSubmittingCorrection(false);
    }
  };

  // Format IDR Currency
  const formatIDR = (num?: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  // Extract KPIs
  const kpi = summaryData?.kpiData || {};
  const chartData = summaryData?.chartData || {};
  const widgetData = summaryData?.widgetData || {};

  const totalTagihanCount = kpi.totalTagihan || totalInvoicesCount || 0;
  const totalLunasCount = kpi.totalLunas || 0;
  const totalPendingCount = kpi.totalPending || 0;
  const totalGagalCount = kpi.totalGagal || 0;
  const totalBelumBayarCount = totalPendingCount + totalGagalCount;
  const successRate = kpi.successRate || (totalTagihanCount > 0 ? Math.round((totalLunasCount / totalTagihanCount) * 100) : 0);
  const totalPenerimaan = kpi.pendapatanBulanIni || 0;
  const totalTunggakan = kpi.outstandingPayment || 0;

  const totalPages = Math.ceil(totalInvoicesCount / itemsPerPage) || 1;

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Monitoring SPP & Laporan Keuangan</h2>
            <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary text-xs font-semibold gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Pengawas (Read-Only)
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Pantau realisasi SPP, tingkat kelunasan, analisis per kelas, daftar tunggakan, serta pengawasan transaksi operasional Bendahara.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1.5">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel
          </Button>
          <Button size="sm" onClick={() => handleOpenCorrectionModal(null)} className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
            <AlertTriangle className="h-4 w-4" /> Arahan Koreksi
          </Button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Tagihan</p>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold">{loading ? <Skeleton className="h-6 w-16" /> : `${totalTagihanCount} Tagihan`}</p>
              <p className="text-xs text-muted-foreground mt-1">Seluruh invoice terbit</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Realisasi SPP</p>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold text-emerald-600">{loading ? <Skeleton className="h-6 w-24" /> : formatIDR(totalPenerimaan)}</p>
              <p className="text-xs text-muted-foreground mt-1">Penerimaan bulan ini</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Siswa Lunas</p>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold text-emerald-700">{loading ? <Skeleton className="h-6 w-12" /> : `${totalLunasCount} Siswa`}</p>
              <p className="text-xs text-emerald-600/80 font-medium mt-1">Sudah membayar SPP</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Belum Bayar</p>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold text-amber-600">{loading ? <Skeleton className="h-6 w-12" /> : `${totalBelumBayarCount} Siswa`}</p>
              <p className="text-xs text-amber-600/80 font-medium mt-1">Pending / Terlambat</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tingkat Lunas</p>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold text-indigo-600">{loading ? <Skeleton className="h-6 w-16" /> : `${successRate}%`}</p>
              <ProgressBar value={successRate} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Tunggakan</p>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold text-rose-600">{loading ? <Skeleton className="h-6 w-24" /> : formatIDR(totalTunggakan)}</p>
              <p className="text-xs text-rose-600/80 font-medium mt-1">Perlu tindak lanjut</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tren Pendapatan Bulanan */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Statistik Pembayaran Bulanan (6 Bulan Terakhir)
            </CardTitle>
            <Badge variant="secondary" className="text-xs font-normal">Otomatis Terupdate</Badge>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : chartData.pendapatanBulanan && chartData.pendapatanBulanan.length > 0 ? (
              <div className="space-y-4">
                {chartData.pendapatanBulanan.map((item: any, idx: number) => {
                  const maxVal = Math.max(...chartData.pendapatanBulanan.map((d: any) => d.amount || 1), 1);
                  const percentage = Math.round(((item.amount || 0) / maxVal) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">{item.month}</span>
                        <span className="font-semibold text-foreground">{formatIDR(item.amount)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ProgressBar value={percentage} className="flex-1" />
                        <span className="text-[11px] text-muted-foreground w-8 text-right font-medium">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Belum ada data riwayat pendapatan bulanan.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Breakdown Kelas & Metode Pembayaran */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Statistik Lunas Per Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : chartData.pembayaranKelas && chartData.pembayaranKelas.length > 0 ? (
              <div className="space-y-4">
                {chartData.pembayaranKelas.map((cls: any, idx: number) => (
                  <div key={idx} className="space-y-1.5 border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-foreground">{cls.grade}</span>
                      <Badge variant={cls.rate >= 80 ? 'default' : cls.rate >= 50 ? 'outline' : 'destructive'} className="text-[10px]">
                        {cls.rate}% Lunas
                      </Badge>
                    </div>
                    <ProgressBar value={cls.rate} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                Data tingkat lunas per kelas belum tersedia.
              </div>
            )}

            {/* Sub-section Metode Pembayaran */}
            <div className="pt-3 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Metode Pembayaran Siswa</p>
              <div className="grid grid-cols-2 gap-2">
                {(chartData.metodePembayaran || []).map((m: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-muted/50 border text-left">
                    <p className="text-[11px] text-muted-foreground font-medium">{m.name}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{m.value} Transaksi</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Arrears / Tunggakan Terbesar Widget */}
      {widgetData.outstandingInvoices && widgetData.outstandingInvoices.length > 0 && (
        <Card className="shadow-sm border-rose-200/60 bg-rose-50/10">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-rose-950 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" /> Top 5 Siswa dengan Tunggakan SPP Terbesar
            </CardTitle>
            <Badge variant="destructive" className="text-xs font-normal">Perhatian Khusus</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-rose-50/30">
                  <TableHead className="text-xs font-semibold">Nama Siswa</TableHead>
                  <TableHead className="text-xs font-semibold">Bulan Menunggak</TableHead>
                  <TableHead className="text-xs font-semibold">Total Tunggakan</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Aksi Arahan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {widgetData.outstandingInvoices.map((inv: any, idx: number) => (
                  <TableRow key={idx} className="hover:bg-rose-50/20">
                    <TableCell className="font-semibold text-xs text-foreground">
                      {inv.name}
                      <p className="text-[11px] text-muted-foreground font-normal">{inv.grade}</p>
                    </TableCell>
                    <TableCell className="text-xs text-rose-700 font-medium">
                      <Badge variant="outline" className="border-rose-200 bg-rose-100/50 text-rose-700 text-[10px]">
                        {inv.months} Bulan
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-rose-600">
                      {formatIDR(inv.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 gap-1"
                        onClick={() => handleOpenCorrectionModal({ studentName: inv.name, amount: inv.amount })}
                      >
                        <Send className="h-3 w-3" /> Remind Bendahara
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Main Invoices Table Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" /> Daftar Monitoring Tagihan & Transaksi SPP
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daftar rincian invoice siswa beserta status kelunasan dan riwayat transaksi.
              </p>
            </div>
            
            {/* Controls Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari siswa / invoice..."
                  className="pl-8 text-xs h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(val: any) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-32 text-xs h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="PAID">Lunas</SelectItem>
                  <SelectItem value="PENDING">Belum Bayar</SelectItem>
                  <SelectItem value="FAILED">Gagal</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedMonth.toString()}
                onValueChange={(val) => {
                  setSelectedMonth(parseInt(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-32 text-xs h-9">
                  <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {getMonthName(m)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(val) => {
                  setSelectedYear(parseInt(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-28 text-xs h-9">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-xs font-semibold">Nomor / Ref Invoice</TableHead>
                <TableHead className="text-xs font-semibold">Nama Siswa</TableHead>
                <TableHead className="text-xs font-semibold">Periode SPP</TableHead>
                <TableHead className="text-xs font-semibold">Nominal SPP</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Metode / Tgl</TableHead>
                <TableHead className="text-xs font-semibold text-right">Detail Monitoring</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : invoices.length > 0 ? (
                invoices.map((inv, idx) => {
                  const refNo = formatInvoiceRef(inv);
                  return (
                    <TableRow key={inv.id || idx} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs font-medium text-foreground">
                        {refNo}
                        <p className="text-[10px] text-muted-foreground font-sans">
                          {inv.orderId || formatDisplayId(inv.id, 'INV')}
                        </p>
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">
                        {inv.studentName || 'Siswa'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-medium">
                        {getMonthName(inv.month)} {inv.year}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        {formatIDR(inv.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inv.status === 'PAID'
                              ? 'default'
                              : inv.status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-[10px] uppercase tracking-wider font-semibold"
                        >
                          {inv.status === 'PAID' ? 'Lunas' : inv.status === 'PENDING' ? 'Belum Bayar' : 'Gagal'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {inv.paymentMethod ? (
                          <span className="font-semibold text-foreground uppercase">{inv.paymentMethod}</span>
                        ) : (
                          <span className="italic text-[11px]">Belum Dibayar</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => setSelectedInvoiceDetails(inv)}
                        >
                          <Eye className="h-3.5 w-3.5" /> Lihat Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    Tidak ada data tagihan SPP yang sesuai dengan filter pencarian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-xs text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{invoices.length}</span> dari{' '}
              <span className="font-semibold text-foreground">{totalInvoicesCount}</span> data tagihan
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
              >
                Sebelumnya
              </Button>
              <span className="text-xs font-medium px-2">
                Halaman {currentPage} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loading}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal 1: Read-Only Detail Monitoring Invoice */}
      <Dialog open={!!selectedInvoiceDetails} onOpenChange={(open: boolean) => !open && setSelectedInvoiceDetails(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> Detail Invoice SPP (Monitoring)
            </DialogTitle>
          </DialogHeader>

          {selectedInvoiceDetails && (
            <div className="space-y-4 text-xs py-2">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Hak Akses Mode Pengawasan (Read-Only)
                </p>
                Sebagai Kepala Sekolah, Anda dapat meninjau rincian pembayaran ini. Untuk pembuatan, pembatalan, atau perubahan nominal/status transaksi, silakan kirim arahan kepada pihak <strong>Bendahara Sekolah</strong>.
              </div>

              <div className="space-y-2 border-b pb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Nomor Ref Invoice:</span>
                  <span className="font-mono font-bold text-foreground">
                    {formatInvoiceRef(selectedInvoiceDetails)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Order ID Sistem:</span>
                  <span className="font-mono text-muted-foreground">
                    {selectedInvoiceDetails.orderId || formatDisplayId(selectedInvoiceDetails.id, 'INV')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Nama Siswa:</span>
                  <span className="font-bold text-foreground">{selectedInvoiceDetails.studentName || 'Siswa'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Periode SPP:</span>
                  <span className="font-semibold">{getMonthName(selectedInvoiceDetails.month)} {selectedInvoiceDetails.year}</span>
                </div>
              </div>

              <div className="space-y-2 border-b pb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Nominal Tagihan:</span>
                  <span className="font-bold text-base text-foreground">{formatIDR(selectedInvoiceDetails.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Status Pembayaran:</span>
                  <Badge
                    variant={
                      selectedInvoiceDetails.status === 'PAID'
                        ? 'default'
                        : selectedInvoiceDetails.status === 'PENDING'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className="text-[10px] uppercase font-bold"
                  >
                    {selectedInvoiceDetails.status === 'PAID' ? 'Lunas' : selectedInvoiceDetails.status === 'PENDING' ? 'Belum Bayar' : 'Gagal'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Metode Pembayaran:</span>
                  <span className="font-semibold uppercase text-foreground">
                    {selectedInvoiceDetails.paymentMethod || 'Belum Ada (Menunggu)'}
                  </span>
                </div>
                {selectedInvoiceDetails.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Jatuh Tempo:</span>
                    <span>{new Date(selectedInvoiceDetails.dueDate).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs"
              onClick={() => setSelectedInvoiceDetails(null)}
            >
              Tutup
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto text-xs bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
              onClick={() => {
                const target = selectedInvoiceDetails;
                setSelectedInvoiceDetails(null);
                handleOpenCorrectionModal(target);
              }}
            >
              <Send className="h-3.5 w-3.5" /> Arahkan Koreksi ke Bendahara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Form Arahan Koreksi ke Bendahara */}
      <Dialog open={isCorrectionModalOpen} onOpenChange={setIsCorrectionModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-amber-600" /> Kirim Arahan Koreksi / Instruksi ke Bendahara
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitCorrection} className="space-y-4 py-2 text-xs">
            {correctionSuccessMsg ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="font-bold text-sm">Berhasil Terkirim</p>
                <p>{correctionSuccessMsg}</p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Subjek / Judul Arahan</label>
                  <Input
                    className="text-xs h-9"
                    value={correctionTitle}
                    onChange={(e) => setCorrectionTitle(e.target.value)}
                    placeholder="Masukkan judul instruksi koreksi..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Tingkat Prioritas</label>
                  <Select
                    value={correctionPriority}
                    onValueChange={(val: any) => setCorrectionPriority(val)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORMAL">Normal (Informasi / Catatan)</SelectItem>
                      <SelectItem value="HIGH">Tinggi (Perlu Penanganan Cepat)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Detail Catatan / Instruksi Koreksi Operasional</label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed"
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="Contoh: Mohon lakukan pengecekan ulang status pembayaran manual untuk siswa X, atau berikan dispensasi tunggakan..."
                  />
                </div>

                <div className="p-3 rounded-lg bg-muted/60 text-muted-foreground text-[11px]">
                  Pesan ini akan otomatis dikirimkan ke dashboard & notifikasi role <strong>BENDAHARA</strong> untuk diproses secara operasional.
                </div>
              </>
            )}

            {!correctionSuccessMsg && (
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  disabled={submittingCorrection}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
                  disabled={submittingCorrection}
                >
                  {submittingCorrection ? 'Sending...' : 'Kirim Arahan ke Bendahara'}
                </Button>
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
