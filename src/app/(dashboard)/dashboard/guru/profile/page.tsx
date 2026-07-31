'use client';

import * as React from 'react';
import {
  User,
  Phone,
  MapPin,
  Award,
  Calendar,
  ShieldCheck,
  Edit3,
  History,
  Camera,
  Trash2,
  Loader2,
  Eye,
  Download,
  FileText,
  BookOpen
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

import { useTenant } from '@/hooks/use-tenant';
import { profileApi } from '@/lib/api-client';
import { compressImage, getInitials } from '@/lib/utils/image-compression';
import { useAuthStore } from '@/stores/auth-store';

export default function TeacherProfilePage() {
  const { academicYear, semester } = useTenant();
  const authUser = useAuthStore((state) => state.user);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [teacher, setTeacher] = React.useState<TeacherProfileData>(() => {
    const user = useAuthStore.getState().user;
    return {
      name: user?.name || 'Guru',
      nip: '-',
      email: user?.email || '',
      phone: '-',
      role: 'Tenaga Pendidik',
      address: '-',
      nik: '-',
      birthPlace: '-',
      birthDate: '-',
      gender: '-',
      religion: '-',
      education: 'S1 - Sarjana Pendidikan',
      subjectArea: 'Mata Pelajaran Umum',
      academicYear: `${academicYear} (${semester})`,
      status: 'Aktif',
      avatarUrl: user?.avatarUrl || null,
      teachingHistory: [
        {
          academicYear: academicYear,
          period: `Semester ${semester} (Aktif)`,
          status: 'Sedang Mengajar',
          isCurrent: true,
        },
      ],
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
            phone: u.phone && u.phone !== '-' ? u.phone : prev.phone,
            address: u.address && u.address !== '-' ? u.address : prev.address,
            avatarUrl: u.avatarUrl !== undefined ? u.avatarUrl : prev.avatarUrl,
            nip: tp?.nip || prev.nip,
            nik: tp?.nik || prev.nik,
            birthPlace: tp?.birthPlace || prev.birthPlace,
            birthDate: tp?.birthDate || prev.birthDate,
            religion: tp?.religion || prev.religion,
            education: tp?.education || prev.education,
            gender: tp?.gender === 'L' ? 'Laki-laki' : tp?.gender === 'P' ? 'Perempuan' : (tp?.gender || prev.gender),
            subjectArea: Array.isArray(tp?.subjectArea) && tp.subjectArea.length > 0 ? tp.subjectArea.join(', ') : prev.subjectArea,
            teachingHistory: Array.isArray(u.academicHistory) && u.academicHistory.length > 0
              ? u.academicHistory.map(item => ({
                  academicYear: item.academicYear,
                  period: item.semester,
                  status: item.status,
                  isCurrent: item.isCurrent,
                }))
              : prev.teachingHistory,
          }));

          useAuthStore.getState().updateUser({
            name: u.name || undefined,
            avatarUrl: u.avatarUrl || null,
          });
        }
      } catch (err) {
        console.error('Gagal memuat profil guru:', err);
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

  const [documents, setDocuments] = React.useState<Array<{
    id: string;
    name: string;
    fileName: string;
    date: string;
    fileUrl?: string;
  }>>([
    { id: '1', name: 'SK Pengangkatan Guru / Pegawai', fileName: 'SK_Pengangkatan_Guru.pdf', date: '10 Jan 2025' },
    { id: '2', name: 'Ijazah Pendidikan Terakhir (S1/S2)', fileName: 'Ijazah_S1_Pendidikan.pdf', date: '10 Jan 2025' },
    { id: '3', name: 'Sertifikat Pendidik (Serdik)', fileName: 'Sertifikat_Pendidik_Guru.pdf', date: '12 Jan 2025' },
    { id: '4', name: 'Pas Foto 3x4 (Latar Merah)', fileName: 'Pasfoto_Guru.jpg', date: '15 Jan 2025' },
    { id: '5', name: 'Kartu Tanda Penduduk (KTP)', fileName: 'KTP_Guru.pdf', date: '16 Jan 2025' },
  ]);

  const [editOpen, setEditOpen] = React.useState(false);

  const handleUploadSimulated = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            fileName: file.name,
            fileUrl,
            date: 'Hari ini',
          };
        }
        return doc;
      }));
      toast({
        title: 'Berkas Diunggah',
        description: `File ${file.name} telah disimpan.`,
      });
    }
  };

  const handleViewDocument = (doc: { name: string; fileName: string; fileUrl?: string }) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      const dummyContent = `=== PRATINJAU DOKUMEN GURU ===\nNama Dokumen: ${doc.name}\nNama File: ${doc.fileName}\nDiunggah oleh: ${teacher.name} (${teacher.nip})\nStatus: Dokumen Persyaratan Terdaftar`;
      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const handleDownloadDocument = (doc: { name: string; fileName: string; fileUrl?: string }) => {
    const link = document.createElement('a');
    if (doc.fileUrl) {
      link.href = doc.fileUrl;
    } else {
      const dummyContent = `=== BERKAS PERSYARATAN GURU ===\nNama Dokumen: ${doc.name}\nNama File: ${doc.fileName}\nDiunggah oleh: ${teacher.name} (${teacher.nip})\nStatus: Dokumen Persyaratan Terdaftar`;
      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      link.href = URL.createObjectURL(blob);
    }
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Mengunduh Berkas',
      description: `File ${doc.fileName} berhasil diunduh.`,
    });
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-5xl mx-auto text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profil & Berkas Guru</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kelola biodata pribadi, data kepegawaian, serta kelengkapan dokumen persyaratan sertifikasi & mengajar.
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto gap-2" onClick={() => setEditOpen(true)}>
          <Edit3 className="w-4 h-4" />
          Edit Biodata & Kepegawaian
        </Button>
      </div>

      {/* Main Profile Header Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
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

            <div className="flex-1 text-center md:text-left space-y-2 w-full">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{teacher.name}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mt-1">
                    <Award className="w-4 h-4 text-muted-foreground shrink-0" />
                    {teacher.role} • TA {teacher.academicYear}
                  </p>
                </div>
                <Badge variant="outline" className="w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Status: {teacher.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-3 text-xs sm:text-sm border-t text-left">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>NIP: <strong className="text-foreground font-semibold">{teacher.nip}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>Mapel Utama: <strong className="text-foreground font-semibold">{teacher.subjectArea}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Menu */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 gap-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="hidden sm:inline">Biodata & Kepegawaian</span>
            <span className="sm:hidden truncate">Biodata & NIP</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="hidden sm:inline">Berkas & Surat Penting</span>
            <span className="sm:hidden truncate">Berkas & Surat</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="hidden sm:inline">Riwayat Mengajar</span>
            <span className="sm:hidden truncate">Riwayat Mengajar</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Biodata & Kepegawaian */}
        <TabsContent value="overview" className="space-y-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Identitas Pribadi Guru
                </CardTitle>
                <CardDescription className="text-xs">Informasi NIK, Tempat/Tanggal Lahir, dan Alamat Domisili.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2.5 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">NIK (No. KTP)</span>
                  <span className="font-semibold">{teacher.nik}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold">{teacher.birthPlace}, {teacher.birthDate}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Jenis Kelamin</span>
                  <span className="font-semibold">{teacher.gender}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Agama</span>
                  <span className="font-semibold">{teacher.religion}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Email Resmi</span>
                  <span className="font-semibold break-all">{teacher.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Nomor HP / WA</span>
                  <span className="font-semibold">{teacher.phone}</span>
                </div>
                <div className="pt-1">
                  <span className="text-xs text-muted-foreground block mb-1">Alamat Tinggal</span>
                  <span className="font-medium flex items-start gap-1.5 text-xs bg-muted/40 p-2.5 rounded-md leading-relaxed">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {teacher.address}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Data Kepegawaian & Kualifikasi
                </CardTitle>
                <CardDescription className="text-xs">Informasi NIP, pendidikan terakhir, dan mata pelajaran yang diampu.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2.5 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">NIP / ID Tenaga Pendidik</span>
                  <span className="font-semibold">{teacher.nip}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Jabatan / Role</span>
                  <span className="font-semibold">{teacher.role}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Pendidikan Terakhir</span>
                  <span className="font-semibold">{teacher.education}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Mata Pelajaran Utama</span>
                  <span className="font-semibold">{teacher.subjectArea}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Status Keaktifan</span>
                  <Badge variant="default" className="w-fit text-[10px]">
                    {teacher.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Berkas & Surat Penting */}
        <TabsContent value="documents" className="space-y-4 pt-3">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">Upload Berkas & Surat Persyaratan Guru</CardTitle>
              <CardDescription className="text-xs">
                Unggah dokumen penting seperti SK Pengangkatan, Ijazah S1/S2, Sertifikat Pendidik, KTP, dan Pasfoto untuk keperluan sertifikasi dan verifikasi Admin IT.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-xl bg-card gap-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted/60 border border-border/50 text-foreground shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm">{doc.name}</h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 break-all">
                        File: <strong className="text-foreground font-semibold">{doc.fileName}</strong> • Diunggah {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2.5 text-xs gap-1"
                      onClick={() => handleViewDocument(doc)}
                      title="Lihat Berkas"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Lihat</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5 text-xs gap-1"
                      onClick={() => handleDownloadDocument(doc)}
                      title="Unduh Berkas"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh</span>
                    </Button>

                    <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-2.5">
                      Unggah Ulang
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleUploadSimulated(doc.id, e)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Riwayat Mengajar */}
        <TabsContent value="academic" className="space-y-4 pt-3">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Jejak Tahun Ajaran Mengajar
              </CardTitle>
              <CardDescription className="text-xs">
                Riwayat perjalanan mengajar dan pengampuan semester dari tahun ke tahun.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4 text-left">
              <div className="relative border-l border-border ml-2.5 sm:ml-4 pl-4 sm:pl-6 space-y-5">
                {teacher.teachingHistory.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Circle Bullet */}
                    <div className={`absolute -left-[23px] sm:-left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border bg-background ${item.isCurrent ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                          Tahun Ajaran {item.academicYear}
                          {item.isCurrent && (
                            <Badge variant="default" className="text-[10px] sm:text-xs">Aktif</Badge>
                          )}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                          {item.period}
                        </p>
                      </div>

                      <Badge
                        variant={item.isCurrent ? 'default' : 'secondary'}
                        className="w-fit text-[10px] sm:text-xs"
                      >
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
              birthPlace: data.birthPlace,
              birthDate: data.birthDate,
              gender: data.gender === 'Laki-laki' ? 'L' : data.gender === 'Perempuan' ? 'P' : data.gender,
              nik: data.nik,
              religion: data.religion,
              education: data.education,
            });
          } catch (err) {
            console.error('Gagal memperbarui profil guru di backend:', err);
          }
        }}
      />
    </div>
  );
}
