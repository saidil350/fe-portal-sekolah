'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  History,
  Building2,
  Award,
  Eye,
  Loader2,
  Pencil
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Input } from '@/components/ui/components/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Badge } from '@/components/ui/components/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import { toast } from '@/components/ui/hooks/use-toast';
import { apiClient } from '@/lib/api-client';

interface StudentDocument {
  id: string;
  name: string;
  type: string;
  fileName: string;
  uploadDate: string;
  status: 'TERVERIFIKASI' | 'MENUNGGU' | 'PERLU_PERBAIKAN';
  fileUrl?: string;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState<any>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [editEmail, setEditEmail] = React.useState('');
  const [editNisn, setEditNisn] = React.useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = React.useState(false);

  const handleOpenEditModal = () => {
    if (!userData) return;
    setEditName(userData.name || '');
    setEditEmail(userData.email || '');
    setEditNisn(userData.studentProfile?.nisn || userData.nisn || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingEdit(true);
    try {
      const payload: any = {
        name: editName,
        email: editEmail,
      };
      if (userData.role === 'SISWA') {
        payload.nisn = editNisn;
      }

      const res = await apiClient.patch<any>(`/users/${userId}`, payload);
      if (res.success) {
        toast({
          title: 'Berhasil Memperbarui Data',
          description: 'Data profil pengguna dan NISN berhasil disimpan.',
        });
        setIsEditModalOpen(false);
        // Refresh user detail data
        const updated = await apiClient.get<any>(`/users/${userId}`);
        if (updated.success && updated.data) {
          setUserData(updated.data);
        }
      } else {
        toast({
          title: 'Gagal Memperbarui Data',
          description: res.message || 'Terjadi kesalahan saat memperbarui data.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Terjadi kesalahan jaringan.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  React.useEffect(() => {
    async function fetchUserDetail() {
      setLoading(true);
      try {
        const res = await apiClient.get<any>(`/users/${userId}`);
        if (res.success && res.data) {
          setUserData(res.data);
        }
      } catch (err) {
        console.error('Error fetching user detail:', err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  // Mock data komprehensif dokumen dan profil pribadi siswa
  const mockDocuments: StudentDocument[] = [
    {
      id: 'doc-1',
      name: 'Akte Kelahiran',
      type: 'PDF / Gambar',
      fileName: 'Akte_Kelahiran_Siswa.pdf',
      uploadDate: '12 Juli 2025',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'doc-2',
      name: 'Kartu Keluarga (KK)',
      type: 'PDF / Gambar',
      fileName: 'Kartu_Keluarga_Siswa.pdf',
      uploadDate: '12 Juli 2025',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'doc-3',
      name: 'Ijazah SMP / SKL',
      type: 'PDF',
      fileName: 'Ijazah_SMP_Siswa.pdf',
      uploadDate: '14 Juli 2025',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'doc-4',
      name: 'Pas Foto 3x4 (Latar Merah)',
      type: 'JPG',
      fileName: 'Pasfoto_Siswa.jpg',
      uploadDate: '15 Juli 2025',
      status: 'TERVERIFIKASI',
    },
    {
      id: 'doc-5',
      name: 'KTP Orang Tua / Wali',
      type: 'PDF / Gambar',
      fileName: 'KTP_OrangTua.pdf',
      uploadDate: '16 Juli 2025',
      status: 'MENUNGGU',
    },
  ];

  const sp = userData?.studentProfile;
  const currentClassObj = userData?.currentClass;

  const birthPlaceStr = sp?.birthPlace || userData?.birthPlace || '';
  const birthDateStr = sp?.birthDate || userData?.birthDate || '';
  const formattedBirth = (birthPlaceStr || birthDateStr)
    ? `${birthPlaceStr}${birthPlaceStr && birthDateStr ? ', ' : ''}${birthDateStr}`
    : (userData?.birthPlaceDate || '-');

  const studentDetail = {
    name: userData?.name || '-',
    email: userData?.email || '-',
    role: userData?.role || '-',
    isActive: userData?.isActive ?? true,
    nisn: sp?.nisn || userData?.nisn || '-',
    nis: sp?.nis || userData?.nis || '-',
    gender: sp?.gender === 'L' ? 'Laki-laki' : sp?.gender === 'P' ? 'Perempuan' : (sp?.gender || userData?.gender || '-'),
    birthPlaceDate: formattedBirth,
    phone: userData?.phone || userData?.phoneNumber || sp?.guardianPhone || '-',
    currentClass: currentClassObj?.name ? `Kelas ${currentClassObj.name}` : (userData?.className || '-'),
    address: userData?.address || sp?.guardianAddress || '-',
    nik: sp?.nik || userData?.nik || '-',
    religion: sp?.religion || userData?.religion || '-',
    
    // Data Orang Tua
    fatherName: sp?.fatherName || userData?.fatherName || '-',
    fatherOccupation: sp?.fatherOccupation || userData?.fatherOccupation || '-',
    fatherPhone: sp?.guardianPhone || userData?.fatherPhone || '-',
    motherName: sp?.motherName || userData?.motherName || '-',
    motherOccupation: sp?.motherOccupation || userData?.motherOccupation || '-',
    guardianAddress: userData?.address || userData?.guardianAddress || '-',

    // Riwayat Akademik
    academicHistory: Array.isArray(userData?.academicHistory) && userData.academicHistory.length > 0
      ? userData.academicHistory
      : [],
  };

  const handleViewDocument = (doc: StudentDocument) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      const dummyContent = `=== DOKUMEN SISWA (ADMIN IT VIEW) ===\nNama Dokumen: ${doc.name}\nNama File: ${doc.fileName}\nTanggal Unggah: ${doc.uploadDate}\nNama Siswa: ${studentDetail.name}\nEmail: ${studentDetail.email}`;
      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const handleDownloadDocument = (doc: StudentDocument) => {
    const link = document.createElement('a');
    if (doc.fileUrl) {
      link.href = doc.fileUrl;
    } else {
      const dummyContent = `=== BERKAS SISWA (PORTAL SEKOLAH ADMIN IT) ===\nNama Dokumen: ${doc.name}\nNama File: ${doc.fileName}\nTanggal Unggah: ${doc.uploadDate}\nNama Siswa: ${studentDetail.name}`;
      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      link.href = URL.createObjectURL(blob);
    }
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: 'Mengunduh Berkas Siswa',
      description: `File ${doc.fileName} berhasil diunduh.`,
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat detail profil pengguna...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold">Pengguna tidak ditemukan</h2>
        <p className="text-sm text-muted-foreground">Data profil pengguna yang dicari tidak dapat ditemukan.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin/users">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Pengguna
          </Link>
        </Button>
      </div>
    );
  }

  const initials = studentDetail.name !== '-'
    ? studentDetail.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto text-left">
      {/* Tombol Kembali & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/admin/users">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detail Data Profil Pengguna</h1>
            <p className="text-sm text-muted-foreground">
              Dokumen fisik, profil lengkap, dan status verifikasi pengguna.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleOpenEditModal} className="text-xs gap-1.5 h-8">
            <Pencil className="w-3.5 h-3.5" />
            Edit Data / NISN
          </Button>
          <Badge variant={studentDetail.isActive ? 'default' : 'destructive'} className="text-xs px-3 py-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Akun {studentDetail.isActive ? 'Aktif' : 'Nonaktif'}
          </Badge>
          <Badge variant="secondary" className="text-xs px-3 py-1">
            Role: {studentDetail.role}
          </Badge>
        </div>
      </div>

      {/* Main Header Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24 border shadow-sm">
              <AvatarImage src={userData?.image || userData?.avatarUrl || ''} alt={studentDetail.name} />
              <AvatarFallback className="text-2xl font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold">{studentDetail.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mt-1">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    {studentDetail.currentClass} • NISN: <strong className="text-foreground">{studentDetail.nisn}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-sm border-t">
                <div>
                  <span className="text-xs text-muted-foreground block">Email Siswa</span>
                  <span className="font-semibold">{studentDetail.email}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Nomor Telepon</span>
                  <span className="font-semibold">{studentDetail.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Nomor Induk Siswa (NIS)</span>
                  <span className="font-semibold">{studentDetail.nis}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Informasi Komprehensif */}
      <Tabs defaultValue="biodata" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="biodata">Biodata & Data Keluarga</TabsTrigger>
          <TabsTrigger value="documents">Berkas & Surat Penting</TabsTrigger>
          <TabsTrigger value="academic">Riwayat Akademik</TabsTrigger>
        </TabsList>

        {/* Tab 1: Biodata & Data Keluarga */}
        <TabsContent value="biodata" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Data Diri */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-primary" />
                  Identitas Pribadi Siswa
                </CardTitle>
                <CardDescription>Informasi KTP/NIK dan tempat tanggal lahir.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">NIK (No. KTP)</span>
                  <span className="font-semibold">{studentDetail.nik}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold">{studentDetail.birthPlaceDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Jenis Kelamin</span>
                  <span className="font-semibold">{studentDetail.gender}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Agama</span>
                  <span className="font-semibold">{studentDetail.religion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Alamat Domisili</span>
                  <span className="font-semibold flex items-start gap-1.5 bg-muted/40 p-2.5 rounded-md text-xs leading-relaxed">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {studentDetail.address}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Card Data Orang Tua / Wali */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4.5 h-4.5 text-primary" />
                  Data Orang Tua / Wali
                </CardTitle>
                <CardDescription>Informasi kontak dan identitas wali siswa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Nama Ayah</span>
                  <span className="font-semibold">{studentDetail.fatherName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Pekerjaan Ayah</span>
                  <span className="font-semibold">{studentDetail.fatherOccupation}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">No. Telepon Orang Tua</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    {studentDetail.fatherPhone}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Nama Ibu</span>
                  <span className="font-semibold">{studentDetail.motherName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Pekerjaan Ibu</span>
                  <span className="font-semibold">{studentDetail.motherOccupation}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Berkas & Surat Penting yang diupload siswa */}
        <TabsContent value="documents" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Surat & Dokumen Persyaratan Siswa
                </CardTitle>
                <CardDescription>
                  Berkas fisik seperti Akte Kelahiran, KK, Ijazah, dan KTP yang diunggah oleh siswa dapat dilihat dan diunduh oleh Admin IT.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-muted/60 border border-border/50 text-foreground mt-0.5">
                        <FileText className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{doc.name}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{doc.fileName}</span>
                          <span>•</span>
                          <span>Diunggah pada {doc.uploadDate}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 text-xs"
                        onClick={() => handleViewDocument(doc)}
                        title="Lihat Berkas"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat Berkas
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs"
                        onClick={() => handleDownloadDocument(doc)}
                        title="Unduh Berkas"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh Berkas
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Riwayat Akademik */}
        <TabsContent value="academic" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Histori Pendidikan & Rombel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentDetail.academicHistory.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg border bg-muted/20">
                    <div>
                      <h4 className="font-semibold text-sm">{item.className}</h4>
                      <p className="text-xs text-muted-foreground">TA {item.academicYear} • {item.semester}</p>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Edit Data Pengguna / NISN */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-background border shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                Ubah Profil Pengguna & NISN
              </CardTitle>
              <CardDescription className="text-xs">
                Perbarui data identitas utama dan NISN siswa di bawah ini.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveEditUser}>
              <CardContent className="space-y-4 pt-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nama Lengkap</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className="text-xs h-9"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email Pengguna"
                    className="text-xs h-9"
                    required
                  />
                </div>
                {userData?.role === 'SISWA' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">NISN (Nomor Induk Siswa Nasional)</label>
                    <Input
                      value={editNisn}
                      onChange={(e) => setEditNisn(e.target.value)}
                      placeholder="Masukkan 10 Digit NISN"
                      className="text-xs h-9"
                      maxLength={10}
                    />
                    <p className="text-[11px] text-muted-foreground">NISN terdiri dari 10 digit angka resmi Kemdikbud.</p>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-3 border-t mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="h-8 text-xs px-3"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingEdit}
                    className="h-8 text-xs px-4 gap-1.5"
                  >
                    {isSubmittingEdit && <Loader2 className="h-3 w-3 animate-spin" />}
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
