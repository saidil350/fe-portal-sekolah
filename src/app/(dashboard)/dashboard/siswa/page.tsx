'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Badge } from '@/components/ui/components/badge';
import { toast } from '@/components/ui/hooks/use-toast';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Megaphone,
  GraduationCap,
  ArrowRight,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { apiClient } from '@/lib/api-client/client';
import { useAuth } from '@/hooks/use-auth';
import { useTenant } from '@/hooks/use-tenant';

export default function SiswaDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { academicYear, semester } = useTenant();
  const [loading, setLoading] = React.useState(true);
  const [activeInvoices, setActiveInvoices] = React.useState<any[]>([]);
  const [isPaying, setIsPaying] = React.useState(false);
  const [processingInvoiceId, setProcessingInvoiceId] = React.useState<string | null>(null);

  const student = {
    name: user?.name ?? 'Siswa',
    nisn: '0054819203',
    currentClass: 'Kelas 11 IPA 1',
    academicYear: `${academicYear} (Semester ${semester})`,
    sppCategory: 'Beasiswa Prestasi',
    monthlySpp: 500000,
  };

  React.useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<any>('/payments/invoices');
      if (res.success && Array.isArray(res.data?.items)) {
        setActiveInvoices(res.data.items);
      }
    } catch (error: any) {
      console.error("Gagal mengambil data invoice", error);
      toast({
        title: 'Gagal Memuat Tagihan',
        description: error?.message || 'Gagal memuat tagihan.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const announcements = [
    {
      id: '1',
      title: 'Tagihan SPP Bulan Ini Diterbitkan',
      date: '10 Mei 2026',
      category: 'Keuangan',
      desc: 'Pembayaran SPP bulan ini sudah dapat dilakukan melalui transfer virtual account atau QRIS.',
    },
    {
      id: '2',
      title: 'Pengumuman Libur Nasional',
      date: '12 Mei 2026',
      category: 'Informasi',
      desc: 'Diberitahukan kepada seluruh siswa bahwa kegiatan sekolah diliburkan pada Kamis mendatang.',
    },
  ];

  const handlePay = async (invoiceId: string) => {
    if (isPaying) return;
    
    try {
      setIsPaying(true);
      setProcessingInvoiceId(invoiceId);
      const data = await apiClient.post<any>('/payments/create', { invoiceId });
      
      if (!data.success) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses pembayaran');
      }

      if (typeof window !== 'undefined' && (window as any).snap) {
        (window as any).snap.pay(data.data.token, {
          onSuccess: function(result: any) {
            toast({ title: 'Berhasil', description: 'Pembayaran berhasil diproses.' });
            fetchInvoices();
          },
          onPending: function(result: any) {
            toast({ title: 'Pending', description: 'Menunggu pembayaran diselesaikan.' });
            fetchInvoices();
          },
          onError: function(result: any) {
            toast({ title: 'Gagal', description: 'Pembayaran gagal.', variant: 'destructive' });
          },
          onClose: function() {
            toast({ title: 'Info', description: 'Anda menutup popup sebelum menyelesaikan pembayaran.' });
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

  const currentUnpaid = activeInvoices.find((i) => i.status === 'UNPAID');

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary">Portal Siswa • {student.academicYear}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat Datang, {student.name}!
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Terdaftar aktif di <strong className="text-foreground">{student.currentClass}</strong> • NISN: {student.nisn}
            </p>
          </div>

          <Button
            variant="outline"
            className="shrink-0 gap-2"
            onClick={() => router.push('/dashboard/siswa/profile')}
          >
            Lihat Profil Lengkap
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="text-left space-y-1">
              <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                Status Akademik
              </p>
              <h2 className="text-xl font-bold text-foreground">
                {student.currentClass}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                Status Siswa Aktif
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted text-muted-foreground">
              <GraduationCap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="text-left space-y-1">
              <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                SPP Bulan Ini
              </p>
              <h2 className="text-xl font-bold text-foreground">
                {loading
                  ? 'Memuat...'
                  : activeInvoices.length === 0
                  ? 'Belum Ada Tagihan'
                  : currentUnpaid
                  ? formatCurrency(currentUnpaid.amount)
                  : 'Lunas'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {loading
                  ? '...'
                  : activeInvoices.length === 0
                  ? 'Belum ada tagihan SPP diterbitkan'
                  : currentUnpaid
                  ? 'Menunggu pembayaran'
                  : 'Pembayaran tepat waktu'}
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted text-muted-foreground">
              <CreditCard className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SPP Payment Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 text-left">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                Tagihan SPP Terbaru
              </CardTitle>
              <CardDescription className="text-xs">
                Status pembayaran kewajiban bulanan Anda.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={() => router.push('/dashboard/siswa/payments')}
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-center text-sm text-muted-foreground py-4">Memuat tagihan...</div>
            ) : activeInvoices.slice(0, 3).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3.5 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{inv.month}</span>
                    {inv.status === 'PAID' ? (
                      <Badge variant="outline">
                        Lunas
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Belum Lunas
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Nominal: <strong className="text-foreground">{formatCurrency(inv.amount)}</strong>
                  </p>
                </div>

                <div>
                  {inv.status === 'UNPAID' ? (
                    <Button
                      size="sm"
                      onClick={() => handlePay(inv.id)}
                      disabled={isPaying && processingInvoiceId === inv.id}
                      className="gap-1 text-xs"
                    >
                      {isPaying && processingInvoiceId === inv.id ? "Memproses..." : "Bayar"}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Terbayar
                    </span>
                  )}
                </div>
              </div>
            ))}
            {!loading && activeInvoices.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">Tidak ada tagihan tersedia.</div>
            )}
          </CardContent>
        </Card>

        {/* School Announcements Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3 text-left">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-muted-foreground" />
                Pengumuman Sekolah
              </CardTitle>
              <CardDescription className="text-xs">
                Informasi penting terbaru dari pihak sekolah.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={() => router.push('/dashboard/siswa/notifications')}
            >
              Lihat Notifikasi
              <Bell className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border bg-card space-y-1.5 hover:bg-accent/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm leading-tight text-foreground">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
