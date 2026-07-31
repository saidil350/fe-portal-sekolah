'use client';

import * as React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  ShieldCheck,
  Edit3,
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
import { toast } from '@/components/ui/hooks/use-toast';
import {
  EditTeacherProfileDialog,
  type TeacherProfileData,
} from './edit-profile-dialog';
import { profileApi } from '@/lib/api-client';
import { compressImage, getInitials } from '@/lib/utils/image-compression';
import { useAuthStore } from '@/stores/auth-store';

export default function TeacherProfilePage() {
  const authUser = useAuthStore((state) => state.user);
  const [loading, setLoading] = React.useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [teacher, setTeacher] = React.useState<TeacherProfileData>(() => {
    const user = useAuthStore.getState().user;
    return {
      name: user?.name || 'Guru',
      nip: '-',
      email: user?.email || '',
      phone: '-',
      role: 'Guru',
      address: '-',
      status: 'Aktif',
      avatarUrl: user?.avatarUrl || null,
      teachingHistory: [],
    };
  });

  React.useEffect(() => {
    if (authUser) {
      setTeacher((prev) => ({
        ...prev,
        name: prev.name && prev.name !== 'Guru' ? prev.name : authUser.name || 'Guru',
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
          const tp = u.teacherProfile;
          setTeacher((prev) => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            address: u.address || prev.address,
            avatarUrl: u.avatarUrl !== undefined ? u.avatarUrl : prev.avatarUrl,
            nip: tp?.nip || prev.nip,
          }));

          useAuthStore.getState().updateUser({
            name: u.name || undefined,
            avatarUrl: u.avatarUrl || null,
          });
        }
      } catch (err) {
        console.error('Gagal memuat profil guru:', err);
      } finally {
        if (isMounted) setLoading(false);
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

      setTeacher((prev) => ({ ...prev, avatarUrl: base64Image }));
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

      setTeacher((prev) => ({ ...prev, avatarUrl: null }));
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

  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Guru</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data kontak dan lihat riwayat mengajar Anda.
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
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
                <AvatarImage src={teacher.avatarUrl || ''} alt={teacher.name} />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(teacher.name)}
                </AvatarFallback>
              </Avatar>

              {/* Overlay loading / camera button */}
              <label
                htmlFor="teacher-photo-input"
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-all hover:scale-110"
                title="Ubah Foto Profil"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  id="teacher-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoSelect}
                  disabled={isUploadingPhoto}
                />
              </label>

              {/* Remove photo button if photo exists */}
              {teacher.avatarUrl && !isUploadingPhoto && (
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
                  <h2 className="text-xl font-bold">{teacher.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mt-1">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    {teacher.role}
                  </p>
                </div>
                <Badge variant="outline">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Status: {teacher.status}
                </Badge>
              </div>

              <div className="pt-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>NIP: <strong className="text-foreground">{teacher.nip}</strong></span>
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
          <TabsTrigger value="teaching">Riwayat Mengajar</TabsTrigger>
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
                <span className="font-medium">{teacher.email}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Nomor HP/WhatsApp</span>
                <span className="font-medium flex items-center gap-1 mt-0.5">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {teacher.phone}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-muted-foreground block">Alamat Tinggal</span>
                <span className="font-medium flex items-start gap-1 mt-0.5">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  {teacher.address}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Riwayat Mengajar — tanpa kolom mapel/kelas */}
        <TabsContent value="teaching" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="text-left">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Riwayat Tahun Ajaran Mengajar
              </CardTitle>
              <CardDescription>
                Rekam jejak tahun ajaran dan semester yang telah diselesaikan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="relative border-l border-border ml-4 pl-6 space-y-6">
                {teacher.teachingHistory?.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Circle Bullet */}
                    <div className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border bg-background ${
                      item.isCurrent ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          Tahun Ajaran {item.year}
                          {item.isCurrent && (
                            <Badge variant="default" className="text-xs">Aktif</Badge>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.period}
                        </p>
                      </div>

                      <Badge variant={item.isCurrent ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditTeacherProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        teacher={teacher}
        onSaved={async (data) => {
          setTeacher((prev) => ({ ...prev, ...data }));
          try {
            await profileApi.updateProfile({
              phone: data.phone,
              address: data.address,
            });
          } catch (err) {
            console.error('Gagal memperbarui profil guru di backend:', err);
          }
        }}
      />
    </div>
  );
}
