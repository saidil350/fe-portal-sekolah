'use client';

import * as React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Award,
  History,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Badge } from '@/components/ui/components/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/components/dialog';
import { Input } from '@/components/ui/components/input';
import { toast } from '@/components/ui/hooks/use-toast';

interface PrincipalProfileData {
  name: string;
  nip: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  school: string;
  status: string;
}

const labelClass = 'text-xs text-muted-foreground block mb-1.5';

export default function KepalaSekolahProfilePage() {
  const [principal, setPrincipal] = React.useState<PrincipalProfileData>({
    name: 'Drs. H. Rahmat Santoso, M.Pd.',
    nip: '196604201992031007',
    email: 'rahmat.santoso@sekolah.sch.id',
    phone: '0812-5566-7788',
    role: 'Kepala Sekolah',
    school: 'SMA Negeri 1 Jakarta',
    status: 'Aktif',
    address: 'Jl. Kebon Sirih No. 10, Jakarta Pusat',
  });

  const [editOpen, setEditOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    email: principal.email,
    phone: principal.phone,
    address: principal.address,
  });

  const leadershipHistory = [
    {
      year: '2023 — sekarang',
      role: 'Kepala Sekolah',
      school: 'SMA Negeri 1 Jakarta',
      status: 'Sedang Berjalan',
      isCurrent: true,
    },
    {
      year: '2018 — 2023',
      role: 'Wakil Kepala Sekolah Bidang Akademik',
      school: 'SMA Negeri 1 Jakarta',
      status: 'Selesai',
      isCurrent: false,
    },
    {
      year: '2010 — 2018',
      role: 'Guru Ekonomi',
      school: 'SMA Negeri 3 Bandung',
      status: 'Selesai',
      isCurrent: false,
    },
  ];

  // Inisial untuk avatar
  const initials = principal.name
    .replace(/[^a-zA-Z\s]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.phone.trim()) {
      toast({ title: 'Data belum lengkap', description: 'Email dan nomor HP wajib diisi.', variant: 'destructive' });
      return;
    }
    setPrincipal((prev) => ({ ...prev, ...form }));
    toast({ title: 'Profil berhasil diperbarui', description: 'Perubahan data kontak telah disimpan.' });
    setEditOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Kepala Sekolah</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data kontak dan lihat riwayat kepemimpinan Anda.
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => {
          setForm({ email: principal.email, phone: principal.phone, address: principal.address });
          setEditOpen(true);
        }}>
          <Edit3 className="w-4 h-4" />
          Edit Profil
        </Button>
      </div>

      {/* Main Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-20 h-20 border">
              <AvatarImage src="" alt={principal.name} />
              <AvatarFallback className="text-xl font-semibold bg-muted text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold">{principal.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mt-1">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    {principal.role} • {principal.school}
                  </p>
                </div>
                <Badge variant="outline">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Status: {principal.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>NIP: <strong className="text-foreground">{principal.nip}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <span>Sekolah: <strong className="text-foreground">{principal.school}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Menu */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Informasi Umum</TabsTrigger>
          <TabsTrigger value="leadership">Riwayat Kepemimpinan</TabsTrigger>
        </TabsList>

        {/* Tab 1: Informasi Umum */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="text-left">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-left">
              <div>
                <span className="text-xs text-muted-foreground block">Email Resmi</span>
                <span className="font-medium">{principal.email}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Nomor HP/WhatsApp</span>
                <span className="font-medium flex items-center gap-1 mt-0.5">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {principal.phone}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-muted-foreground block">Alamat Tinggal</span>
                <span className="font-medium flex items-start gap-1 mt-0.5">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  {principal.address}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Riwayat Kepemimpinan */}
        <TabsContent value="leadership" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="text-left">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Riwayat Jabatan & Kepemimpinan
              </CardTitle>
              <CardDescription>
                Rekam jejak karir dan jabatan dari awal hingga saat ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="relative border-l border-border ml-4 pl-6 space-y-6">
                {leadershipHistory.map((item, index) => (
                  <div key={index} className="relative">
                    <div className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border bg-background ${
                      item.isCurrent ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          {item.role}
                          {item.isCurrent && <Badge variant="default" className="text-xs">Aktif</Badge>}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.year} • {item.school}
                        </p>
                      </div>
                      <Badge variant={item.isCurrent ? 'default' : 'secondary'}>{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[480px] text-left">
          <DialogHeader>
            <DialogTitle>Edit Profil Kepala Sekolah</DialogTitle>
            <DialogDescription>
              Perbarui data kontak Anda. Data identitas (NIP, nama, jabatan)
              tidak dapat diubah langsung — hubungi Admin IT.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nama Lengkap</label>
                <Input value={principal.name} disabled />
              </div>
              <div>
                <label className={labelClass}>NIP</label>
                <Input value={principal.nip} disabled />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="ks-edit-email">Email</label>
              <Input id="ks-edit-email" type="email" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="email@sekolah.sch.id" />
            </div>
            <div>
              <label className={labelClass} htmlFor="ks-edit-phone">Nomor HP / WhatsApp</label>
              <Input id="ks-edit-phone" value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="0812-xxxx-xxxx" />
            </div>
            <div>
              <label className={labelClass} htmlFor="ks-edit-address">Alamat Tinggal</label>
              <textarea id="ks-edit-address" value={form.address} rows={2}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Alamat lengkap" />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
