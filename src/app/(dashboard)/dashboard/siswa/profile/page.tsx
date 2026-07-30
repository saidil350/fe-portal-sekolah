'use client';

import * as React from 'react';
import {
  User,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Edit3,
  History,
  TrendingUp,
  Camera,
  Trash2,
  Loader2,
  Eye,
  Download,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Badge } from '@/components/ui/components/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import { toast } from '@/components/ui/hooks/use-toast';
import {
  EditProfileDialog,
  type StudentProfileData,
} from './edit-profile-dialog';

import { useTenant } from '@/hooks/use-tenant';
import { profileApi } from '@/lib/api-client';
import { compressImage, getInitials } from '@/lib/utils/image-compression';
import { useAuthStore } from '@/stores/auth-store';

export default function StudentProfilePage() {
  const { academicYear, semester } = useTenant();
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [student, setStudent] = React.useState<StudentProfileData>({
    name: 'Siswa',
    avatarUrl: null,
    nisn: '-',
    nis: '-',
    email: '-',
    phone: '-',
    currentClass: 'Kelas 11 IPA 1',
    address: 'Belum diisi',
    nik: '-',
    birthPlace: '-',
    birthDate: '-',
    gender: '-',
    religion: '-',
    fatherName: '-',
    fatherOccupation: '-',
    motherName: '-',
    motherOccupation: '-',
    guardianName: '-',
    guardianPhone: '-',
    academicYear: `${academicYear} (${semester})`,
    status: 'Aktif',

    // Academic Progression History
    academicHistory: [
      {
        academicYear: academicYear,
        grade: 'Kelas 11',
        className: 'Kelas 11 IPA 1',
        semester: `Semester ${semester} (Aktif)`,
        status: 'Sedang Berjalan',
        isCurrent: true,
      },
    ],
  });

  React.useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const res = await profileApi.getProfile();
        if (res?.data && isMounted) {
          const u = res.data;
          const sp = u.studentProfile;
          setStudent((prev) => ({
            ...prev,
            name: u.name || prev.name,
            avatarUrl: u.avatarUrl || null,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            address: u.address || prev.address,
            nis: sp?.nis || prev.nis,
            nisn: sp?.nisn || prev.nisn,
            currentClass: u.currentClass?.name ? `Kelas ${u.currentClass.name}` : prev.currentClass,
            gender: sp?.gender === 'L' ? 'Laki-laki' : sp?.gender === 'P' ? 'Perempuan' : sp?.gender || prev.gender,
            birthPlace: sp?.birthPlace || prev.birthPlace,
            birthDate: sp?.birthDate || prev.birthDate,
            nik: sp?.nik || prev.nik,
            religion: sp?.religion || prev.religion,
            fatherName: sp?.fatherName || prev.fatherName,
            fatherOccupation: sp?.fatherOccupation || prev.fatherOccupation,
            motherName: sp?.motherName || prev.motherName,
            motherOccupation: sp?.motherOccupation || prev.motherOccupation,
            guardianName: sp?.guardianName || prev.guardianName,
            guardianPhone: sp?.guardianPhone || prev.guardianPhone,
            academicHistory: Array.isArray(u.academicHistory) && u.academicHistory.length > 0 ? u.academicHistory : prev.academicHistory,
          }));
        }
      } catch (err) {
        console.error('Gagal memuat profil siswa:', err);
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

      setStudent((prev) => ({ ...prev, avatarUrl: base64Image }));
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

      setStudent((prev) => ({ ...prev, avatarUrl: null }));
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
    { id: '1', name: 'Akte Kelahiran', fileName: 'Akte_Kelahiran_Rian.pdf', date: '12 Jul 2025' },
    { id: '2', name: 'Kartu Keluarga (KK)', fileName: 'Kartu_Keluarga_Rian.pdf', date: '12 Jul 2025' },
    { id: '3', name: 'Ijazah SMP / SKL', fileName: 'Ijazah_SMP_Rian.pdf', date: '14 Jul 2025' },
    { id: '4', name: 'Pas Foto 3x4 (Latar Merah)', fileName: 'Pasfoto_Rian.jpg', date: '15 Jul 2025' },
    { id: '5', name: 'KTP Orang Tua / Wali', fileName: 'KTP_OrangTua.pdf', date: '16 Jul 2025' },
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
      const dummyContent = `=== PRATINJAU DOKUMEN SISWA ===\nNama Dokumen: ${doc.name}\nNama File: ${doc.fileName}\nDiunggah oleh: ${student.name} (${student.nisn})\nStatus: Berkas Persyaratan Terdaftar`;
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
      const dummyContent = `=== BERKAS PERSYARATAN SISWA ===\nNama Dokumen: ${doc.name}\nNama File: ${doc.fileName}\nDiunggah oleh: ${student.name} (${student.nisn})\nStatus: Berkas Persyaratan Terdaftar`;
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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profil & Berkas Siswa</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kelola biodata pribadi, data orang tua, serta kelengkapan dokumen persyaratan sekolah.
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto gap-2" onClick={() => setEditOpen(true)}>
          <Edit3 className="w-4 h-4" />
          Edit Biodata & Ortu
        </Button>
      </div>

      {/* Main Profile Header Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
            <div className="relative group shrink-0">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-primary/20 shadow-md">
                <AvatarImage src={student.avatarUrl || ''} alt={student.name} />
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>

              {/* Overlay loading / camera button */}
              <label
                htmlFor="profile-photo-input"
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-all hover:scale-110"
                title="Ubah Foto Profil"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoSelect}
                  disabled={isUploadingPhoto}
                />
              </label>

              {/* Remove photo button if photo exists */}
              {student.avatarUrl && !isUploadingPhoto && (
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
                  <h2 className="text-lg sm:text-xl font-bold">{student.name}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mt-1">
                    <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
                    {student.currentClass} • TA {student.academicYear}
                  </p>
                </div>
                <Badge variant="outline" className="w-fit">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Status: {student.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-3 text-xs sm:text-sm border-t text-left">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>NISN: <strong className="text-foreground font-semibold">{student.nisn}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>NIS: <strong className="text-foreground font-semibold">{student.nis}</strong></span>
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
            <span className="hidden sm:inline">Biodata & Data Keluarga</span>
            <span className="sm:hidden truncate">Biodata & Ortu</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="hidden sm:inline">Berkas & Surat Penting</span>
            <span className="sm:hidden truncate">Berkas & Surat</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
            <span className="hidden sm:inline">Riwayat Kenaikan Kelas</span>
            <span className="sm:hidden truncate">Riwayat Kelas</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Biodata & Data Keluarga */}
        <TabsContent value="overview" className="space-y-4 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Identitas Pribadi Siswa
                </CardTitle>
                <CardDescription className="text-xs">Informasi NIK, TTL, dan domisili siswa.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2.5 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">NIK (No. KTP)</span>
                  <span className="font-semibold">{student.nik}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold">{student.birthPlace}, {student.birthDate}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Jenis Kelamin</span>
                  <span className="font-semibold">{student.gender}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Agama</span>
                  <span className="font-semibold">{student.religion}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="font-semibold break-all">{student.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Nomor HP / WA</span>
                  <span className="font-semibold">{student.phone}</span>
                </div>
                <div className="pt-1">
                  <span className="text-xs text-muted-foreground block mb-1">Alamat Tinggal</span>
                  <span className="font-medium flex items-start gap-1.5 text-xs bg-muted/40 p-2.5 rounded-md leading-relaxed">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {student.address}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Data Orang Tua & Wali
                </CardTitle>
                <CardDescription className="text-xs">Identitas ayah, ibu, dan wali siswa.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2.5 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Nama Ayah</span>
                  <span className="font-semibold">{student.fatherName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Pekerjaan Ayah</span>
                  <span className="font-semibold">{student.fatherOccupation}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Nama Ibu</span>
                  <span className="font-semibold">{student.motherName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Pekerjaan Ibu</span>
                  <span className="font-semibold">{student.motherOccupation}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Nama Wali</span>
                  <span className="font-semibold">{student.guardianName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2 gap-0.5">
                  <span className="text-xs text-muted-foreground">Kontak Wali / Ortu</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {student.guardianPhone}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Berkas & Surat Penting */}
        <TabsContent value="documents" className="space-y-4 pt-3">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">Upload Berkas & Surat Persyaratan</CardTitle>
              <CardDescription className="text-xs">
                Unggah dokumen penting seperti Akte Kelahiran, KK, dan Ijazah untuk dapat dilihat dan diunduh oleh Admin IT.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-xl bg-card gap-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
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

        {/* Tab 3: Riwayat Semester & Kenaikan Kelas */}
        <TabsContent value="academic" className="space-y-4 pt-3">
          <Card>
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Jejak Kenaikan Kelas & Semester
              </CardTitle>
              <CardDescription className="text-xs">
                Riwayat perjalanan akademik dari awal masuk hingga jenjang kelas saat ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4 text-left">
              <div className="relative border-l border-border ml-2.5 sm:ml-4 pl-4 sm:pl-6 space-y-5">
                {student.academicHistory.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Circle Bullet */}
                    <div className={`absolute -left-[23px] sm:-left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border bg-background ${item.isCurrent ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                          {item.className}
                          {item.isCurrent && (
                            <Badge variant="default" className="text-[10px] sm:text-xs">Aktif</Badge>
                          )}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                          Tahun Ajaran {item.academicYear} • {item.semester}
                        </p>
                      </div>

                      <Badge
                        variant={item.status === 'Naik Kelas' ? 'default' : 'secondary'}
                        className="w-fit text-[10px] sm:text-xs"
                      >
                        {item.status === 'Naik Kelas' && <TrendingUp className="w-3 h-3 mr-1" />}
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

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        student={student}
        onSaved={async (data) => {
          setStudent((prev) => ({ ...prev, ...data }));
          try {
            await profileApi.updateProfile({
              phone: data.phone,
              address: data.address,
              birthPlace: data.birthPlace,
              birthDate: data.birthDate,
              gender: data.gender === 'Laki-laki' ? 'L' : data.gender === 'Perempuan' ? 'P' : data.gender,
              nik: data.nik,
              religion: data.religion,
              fatherName: data.fatherName,
              fatherOccupation: data.fatherOccupation,
              motherName: data.motherName,
              motherOccupation: data.motherOccupation,
              guardianName: data.guardianName,
              guardianPhone: data.guardianPhone,
            });
          } catch (err) {
            console.error('Gagal memperbarui profil di backend:', err);
          }
        }}
      />
    </div>
  );
}
