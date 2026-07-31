'use client';

import * as React from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Badge } from '@/components/ui/components/badge';
import { toast } from '@/components/ui/hooks/use-toast';
import { Input } from '@/components/ui/components/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/components/tabs';
import { formatCurrency } from '@/lib/utils';
import { apiClient } from '@/lib/api-client/client';
import { API_ROUTES } from '@/lib/constants/api-routes';
import { ReceiptDialog, type ReceiptPayment } from './receipt-dialog';

// Konfigurasi polling status pembayaran (untuk QRIS/e-wallet yang pembayarannya async).
const POLL_INTERVAL_MS = 4000; // cek tiap 4 detik
const POLL_MAX_DURATION_MS = 180000; // maks 3 menit

interface PaymentItem {
  id: string;
  title: string;
  month: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  paidAt?: string;
  method?: string;
  orderId?: string;
}

export default function StudentPaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isPaying, setIsPaying] = React.useState(false);
  const [processingInvoiceId, setProcessingInvoiceId] = React.useState<string | null>(null);

  // Pagination & Filters
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [search, setSearch] = React.useState("");
  
  // Total stats
  const [unpaidTotal, setUnpaidTotal] = React.useState(0);
  const [paidTotal, setPaidTotal] = React.useState(0);

  const fetchInvoices = React.useCallback(async (p: number, s: string, q: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>(`/payments/invoices?page=${p}&limit=5&status=${s}&search=${encodeURIComponent(q)}`);
      if (res.success) {
        setPayments(res.data.items || []);
        setTotalPages(res.data.meta?.totalPages || 1);
        
        // Simulating totals for demo from fetched page (In a real app, backend provides global aggregate)
        // Here we just calc based on current loaded items to avoid making extra requests
        setUnpaidTotal(res.data.items.filter((i: any) => i.status === 'UNPAID').reduce((acc: number, i: any) => acc + i.amount, 0));
        setPaidTotal(res.data.items.filter((i: any) => i.status === 'PAID').reduce((acc: number, i: any) => acc + i.amount, 0));
      }
    } catch (err: any) {
      console.error("Gagal mengambil data tagihan:", err);
      toast({ title: 'Gagal Memuat Data', description: 'Silakan periksa koneksi internet Anda.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchInvoices(page, statusFilter, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, statusFilter, search, fetchInvoices]);

  const [receipt, setReceipt] = React.useState<ReceiptPayment | null>(null);

  // Polling status pembayaran (cleanup ref agar tidak bocor antar render / unmount)
  const pollTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollDeadlineRef = React.useRef<number>(0);

  const stopPolling = React.useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  // Cleanup polling saat komponen unmount
  React.useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  /**
   * Polling endpoint status (yang cek langsung ke Midtrans) sampai status jadi PAID
   * atau batas waktu tercapai. Jalur ini andal walau webhook tidak sampai ke backend.
   */
  const startPolling = React.useCallback((orderId: string, p: number, s: string, q: string) => {
    stopPolling();
    pollDeadlineRef.current = Date.now() + POLL_MAX_DURATION_MS;

    const tick = async () => {
      if (Date.now() > pollDeadlineRef.current) {
        stopPolling();
        toast({ title: 'Info', description: 'Pembayaran masih diproses. Status akan diperbarui otomatis nanti.' });
        return;
      }

      try {
        const res = await apiClient.get<any>(API_ROUTES.PAYMENTS.STATUS(orderId));
        if (res.success && res.data?.status === 'PAID') {
          stopPolling();
          toast({ title: 'Berhasil', description: 'Pembayaran berhasil dikonfirmasi.' });
          fetchInvoices(p, s, q);
          return;
        }
      } catch (err) {
        // Abaikan error transient, lanjut polling sampai deadline
      }

      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
  }, [stopPolling, fetchInvoices]);

  const handlePay = async (id: string) => {
    if (isPaying) return;

    try {
      setIsPaying(true);
      setProcessingInvoiceId(id);
      const data = await apiClient.post<any>('/payments/create', { invoiceId: id });

      if (!data.success) {
        throw new Error(data.error?.message || 'Terjadi kesalahan saat memproses pembayaran');
      }

      const orderId: string | undefined = data.data?.orderId;

      if (typeof window !== 'undefined' && (window as any).snap) {
        (window as any).snap.pay(data.data.token, {
          onSuccess: function(result: any) {
            toast({ title: 'Berhasil', description: 'Pembayaran berhasil diproses.' });
            // Walau onSuccess sudah muncul, tetap poll sebentar untuk memastikan backend ter-sync
            if (orderId) startPolling(orderId, page, statusFilter, search);
          },
          onPending: function(result: any) {
            toast({ title: 'Pending', description: 'Menunggu pembayaran diselesaikan. Status akan dicek otomatis.' });
            if (orderId) startPolling(orderId, page, statusFilter, search);
          },
          onError: function(result: any) {
            toast({ title: 'Gagal', description: 'Pembayaran gagal.', variant: 'destructive' });
          },
          onClose: function() {
            toast({ title: 'Info', description: 'Popup ditutup. Jika sudah membayar, status akan dicek otomatis.' });
            // Untuk QRIS user biasanya tutup popup lalu bayar di app lain -> tetap polling.
            if (orderId) startPolling(orderId, page, statusFilter, search);
          }
        });
      } else {
        throw new Error('Midtrans snap.js tidak ditemukan atau koneksi terputus');
      }
    } catch (err: any) {
      toast({ title: 'Gagal', description: err.message || 'Terjadi kesalahan jaringan', variant: 'destructive' });
    } finally {
      setIsPaying(false);
      setProcessingInvoiceId(null);
    }
  };

  const [checkingOrderId, setCheckingOrderId] = React.useState<string | null>(null);

  const handleSyncStatus = React.useCallback(async (orderId: string) => {
    try {
      setCheckingOrderId(orderId);
      const res = await apiClient.get<any>(API_ROUTES.PAYMENTS.STATUS(orderId));
      if (res.success && res.data?.status === 'PAID') {
        toast({ title: 'Berhasil', description: 'Pembayaran telah dikonfirmasi LUNAS!' });
        fetchInvoices(page, statusFilter, search);
      } else {
        toast({
          title: 'Status Pembayaran',
          description: `Status transaksi: ${res.data?.status || 'PENDING'}. Jika Anda telah menyelesaikan pembayaran, tunggu beberapa detik dan coba lagi.`,
        });
      }
    } catch (err: any) {
      toast({ title: 'Gagal Memeriksa Status', description: err.message || 'Terjadi kesalahan jaringan', variant: 'destructive' });
    } finally {
      setCheckingOrderId(null);
    }
  }, [fetchInvoices, page, statusFilter, search]);

  // Otomatis verifikasi jika halaman dibuka setelah redirect dari Midtrans (misal membawa query ?order_id=SPP-xxx)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectOrderId = urlParams.get('order_id');

      if (redirectOrderId) {
        handleSyncStatus(redirectOrderId);
        // Bersihkan query string dari URL browser agar bersih
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [handleSyncStatus]);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b text-left">
        <h1 className="text-2xl font-bold tracking-tight">Pembayaran SPP Siswa</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pantau status tagihan SPP bulanan dan riwayat pembayaran Anda.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="text-left space-y-1">
              <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                Belum Dibayar
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                {formatCurrency(unpaidTotal)}
              </h2>
              <p className="text-xs text-muted-foreground">
                Di halaman ini
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted text-muted-foreground">
              {unpaidTotal > 0 ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="text-left space-y-1">
              <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                Total Terbayar
              </p>
              <h2 className="text-2xl font-bold text-foreground">
                {formatCurrency(paidTotal)}
              </h2>
              <p className="text-xs text-muted-foreground">
                Di halaman ini
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted text-muted-foreground">
              <Receipt className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Tagihan */}
      <Card>
        <CardHeader className="pb-3 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              Daftar Tagihan SPP
            </CardTitle>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari bulan/tahun..."
                  className="pl-8 h-8 text-xs"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <Tabs value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }} className="w-full sm:w-auto">
                <TabsList className="h-8">
                  <TabsTrigger value="ALL" className="text-xs px-3">Semua</TabsTrigger>
                  <TabsTrigger value="UNPAID" className="text-xs px-3">Belum Lunas</TabsTrigger>
                  <TabsTrigger value="PAID" className="text-xs px-3">Lunas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-sm">Memuat data tagihan...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Inbox className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada tagihan ditemukan</p>
              <p className="text-xs opacity-70">Ubah filter pencarian untuk melihat data lain.</p>
            </div>
          ) : (
            payments.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors gap-3 text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{item.title}</span>
                    {item.status === 'PAID' ? (
                      <Badge variant="outline">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Lunas
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        Belum Lunas
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>
                      Nominal Tagihan: <strong className="text-foreground">{formatCurrency(item.amount)}</strong>
                    </span>
                    {item.status === 'PAID' && (
                      <span>Dibayar: {item.paidAt} ({item.method})</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  {item.status === 'UNPAID' ? (
                    <>
                      {item.orderId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSyncStatus(item.orderId!)}
                          disabled={checkingOrderId === item.orderId}
                          className="w-full sm:w-auto text-xs gap-1"
                          title="Periksa status pembayaran langsung ke Midtrans"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${checkingOrderId === item.orderId ? 'animate-spin' : ''}`} />
                          {checkingOrderId === item.orderId ? "Mengecek..." : "Cek Status"}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        onClick={() => handlePay(item.id)} 
                        disabled={isPaying && processingInvoiceId === item.id}
                        className="w-full sm:w-auto gap-1"
                      >
                        {isPaying && processingInvoiceId === item.id ? "Memproses..." : "Bayar Sekarang"}
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full sm:w-auto text-xs gap-1"
                      onClick={() => setReceipt(item)}
                    >
                      Kuitansi Digital
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {!loading && payments.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <p className="text-xs text-muted-foreground">
                Halaman {page} dari {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ReceiptDialog
        payment={receipt}
        open={!!receipt}
        onOpenChange={(v) => !v && setReceipt(null)}
      />
    </div>
  );
}
