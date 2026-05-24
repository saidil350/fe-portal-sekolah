'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button, useToast, Dialog } from '@portal-sekolah/ui';
import { CalendarCheck, FileText, CreditCard, QrCode } from 'lucide-react';

export default function SiswaDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isQrisOpen, setIsQrisOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);

  const stats = [
    { title: 'Persentase Kehadiran Anda', value: '98.2%', icon: CalendarCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Tugas Belum Dikumpul', value: '2 Tugas', icon: FileText, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Tagihan SPP Aktif', value: 'Rp 450.000', icon: CreditCard, color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
  ];

  const assignmentsList = [
    { title: 'Tugas 1: Eksperimen Kimia Organik', subject: 'Kimia', due: '28 Mei 2026', status: 'BELUM_KUMPUL' },
    { title: 'Ulangan Harian: Stoikiometri Larutan', subject: 'Kimia', due: 'Lulus Nilai: 92', status: 'SELESAI' },
  ];

  const handleOpenQris = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsQrisOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Siswa"
        description="Pantau status kehadiran Anda hari ini, unduh modul pengumpulan tugas, dan bayar SPP bulanan via QRIS."
        action={
          <Button
            onClick={() => router.push('/dashboard/siswa/attendance')}
            className="rounded-xl gap-2 text-xs font-semibold py-5 shadow-lg shadow-emerald-500/20"
          >
            <CalendarCheck className="h-4 w-4" /> Lihat Status Kehadiran
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="border-border/60 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{s.title}</p>
                  <p className="text-2xl font-black">{s.value}</p>
                </div>
                <div className={`p-3.5 rounded-2xl ${s.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Tasks */}
        <Card className="border-border/60">
          <CardHeader className="text-left pb-4 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Lembar Penugasan Saya
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DataTable
              data={assignmentsList as any}
              columns={[
                { header: 'Nama Tugas', accessorKey: 'title' },
                { header: 'Mata Pelajaran', accessorKey: 'subject' },
                {
                  header: 'Status Pengumpulan',
                  render: (row: any) => (
                    <Badge variant={row.status === 'SELESAI' ? 'success' : 'destructive'}>
                      {row.status === 'SELESAI' ? 'Selesai' : 'Belum Kumpul'}
                    </Badge>
                  ),
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* Right Column: SPP Payments */}
        <Card className="border-border/60">
          <CardHeader className="text-left pb-4 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Rincian Tagihan SPP
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Tagihan Jatuh Tempo</span>
                <h4 className="font-bold text-sm text-red-900 dark:text-red-300 mt-0.5">SPP Bulan Mei 2026</h4>
                <p className="text-2xl font-black text-red-950 dark:text-red-100 mt-1">Rp 450.000</p>
              </div>
              <Button
                onClick={() => handleOpenQris({ id: 'SPP-MEI-2026', amount: 'Rp 450.000' })}
                className="rounded-xl text-xs gap-2 py-4 bg-red-600 hover:bg-red-700 font-bold"
              >
                <QrCode className="h-4 w-4" /> Bayar via QRIS
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-semibold">
              * Harap lakukan pembayaran sebelum tanggal 10 setiap bulannya untuk menghindari denda administrasi.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QRIS PAYMENT POPUP (Mockup Premium) */}
      <Dialog
        isOpen={isQrisOpen}
        onClose={() => setIsQrisOpen(false)}
        title="Pembayaran QRIS SPP"
        description="Pindai kode QRIS di bawah ini dengan aplikasi dompet digital Anda (Gopay, OVO, ShopeePay, Dana, dll.)"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-white rounded-2xl border shadow-inner mb-4">
            {/* Visual QR Simulator */}
            <div className="h-48 w-48 bg-zinc-100 flex flex-col items-center justify-center border border-dashed rounded-xl">
              <QrCode className="h-24 w-24 text-zinc-800" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase mt-2">DUMMY QRIS CODE</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Nominal Pembayaran</span>
            <p className="text-3xl font-black text-primary">{selectedInvoice?.amount}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">ID Invoice: {selectedInvoice?.id}</p>
          </div>

          <div className="flex w-full gap-2 mt-6">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsQrisOpen(false)}>
              Batal
            </Button>
            <Button
              className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold"
              onClick={() => {
                setIsQrisOpen(false);
                toast({
                  title: 'Pembayaran Diterima!',
                  description: 'Terima kasih, pembayaran SPP sebesar ' + selectedInvoice?.amount + ' berhasil dicatat sistem.',
                  type: 'success',
                });
              }}
            >
              Simulasi Sukses
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
