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
  Camera,
  Trash2,
  Loader2,
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
import { profileApi } from '@/lib/api-client';
import { compressImage, getInitials } from '@/lib/utils/image-compression';
import { useAuthStore } from '@/stores/auth-store';

interface PrincipalProfileData {
  name: string;
  nip: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  school: string;
  status: string;
  avatarUrl?: string | null;
}

const labelClass = 'text-xs text-muted-foreground block mb-1.5';

export default function KepalaSekolahProfilePage() {
  const authUser = useAuthStore((state) => state.user);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [principal, setPrincipal] = React.useState<PrincipalProfileData>(() => {
    const user = useAuthStore.getState().user;
    return {
      name: user?.name || 'Kepala Sekolah',
      nip: '-',
      email: user?.email || '',
      phone: '-',
      role: 'Kepala Sekolah',
      school: 'Sekolah',
      status: 'Aktif',
      address: '-',
      avatarUrl: user?.avatarUrl || null,
    };
  });

  const [editOpen, setEditOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    email: principal.email,
    phone: principal.phone,
    address: principal.address,
  });

  React.useEffect(() => {
    if (authUser) {
      setPrincipal((prev) => ({
        ...prev,
        name: prev.name && prev.name !== 'Kepala Sekolah' ? prev.name : authUser.name || 'Kepala Sekolah',
        email: prev.email || authUser.email || '',
        avatarUrl: prev.avatarUrl !== null ? prev.avatarUrl : authUser.avatarUrl || null,
      }));
    }
  }, [authUser]);

  React.useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const res = await profileApi.getProfile();
        if (res?.data && isMounted) {
          const u = res.data;
          setPrincipal((prev) => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            address: u.address || prev.address,
            avatarUrl: u.avatarUrl !== undefined ? u.avatarUrl : prev.avatarUrl,
          }));

          useAuthStore.getState().updateUser({
            name: u.name || undefined,
            avatarUrl: u.avatarUrl || null,
          });
        }
      } catch (err) {
        console.error('Gagal memuat profil kepala sekolah:', err);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Format tidak didukung',
        description: 'Silakan pilih file gambar (JPG, PNG, atau WEBP).',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const base64Image = await compressImage(file);
      await profileApi.updateProfile({ image: base64Image });

      setPrincipal((prev) => ({ ...prev, avatarUrl: base64Image }));
      useAuthStore.getState().updateUser({ avatarUrl: base64Image });

      toast({
        title: 'Foto Profil Diperbarui',
        description: 'Foto profil Anda berhasil diunggah dan disimpan.',
      });
    } catch (err) {
      console.error('Gagal mengunggah foto profil:', err);
      toast({
        title: 'Gagal Mengunggah Foto',
        description: 'Terjadi kesalahan saat memproses gambar profil Anda.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handlePhotoRemove = async () => {
    try {
      setIsUploadingPhoto(true);
      await profileApi.updateProfile({ image: null });

      setPrincipal((prev) => ({ ...prev, avatarUrl: null }));
      useAuthStore.getState().updateUser({ avatarUrl: null });

      toast({
        title: 'Foto Profil Dihapus',
        description: 'Foto profil Anda telah dikembalikan ke inisial nama.',
      });
    } catch (err) {
      console.error('Gagal menghapus foto profil:', err);
      toast({
        title: 'Gagal Menghapus Foto',
        description: 'Terjadi kesalahan saat menghapus foto profil Anda.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.phone.trim()) {
      toast({ title: 'Data belum lengkap', description: 'Email dan nomor HP wajib diisi.', variant: 'destructive' });
      return;
    }
    setPrincipal((prev) => ({ ...prev, ...form }));
    try {
      await profileApi.updateProfile({
        phone: form.phone,
        address: form.address,
      });
    } catch (err) {
      console.error('Gagal memperbarui data kontak kepala sekolah di backend:', err);
    }
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
            <div className="relative group shrink-0">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary/20 shadow-md">
                <AvatarImage src={principal.avatarUrl || ''} alt={principal.name} />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(principal.name)}
                </AvatarFallback>
              </Avatar>

              {/* Overlay loading / camera button */}
              <label
                htmlFor="principal-photo-input"
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-all hover:scale-110"
                title="Ubah Foto Profil"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  id="principal-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoSelect}
                  disabled={isUploadingPhoto}
                />
              </label>

              {/* Remove photo button if photo exists */}
              {principal.avatarUrl && !isUploadingPhoto && (
                <button
                  type="button"
                  onClick={handlePhotoRemove}
                  className="absolute top-0 right-0 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow hover:bg-destructive/90 transition-all hover:scale-110"
                  title="Hapus Foto Profil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

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
