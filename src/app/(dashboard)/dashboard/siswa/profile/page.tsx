'use client';

import * as React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  History,
  TrendingUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Badge } from '@/components/ui/components/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import {
  EditProfileDialog,
  type StudentProfileData,
} from './edit-profile-dialog';

import { useTenant } from '@/hooks/use-tenant';

export default function StudentProfilePage() {
  const { academicYear, semester } = useTenant();
  const [student, setStudent] = React.useState<StudentProfileData>({
    name: 'Rian Hidayat',
    nisn: '0054819203',
    nis: '2026-1108',
    email: 'rian.hidayat@sekolah.sch.id',
    phone: '0812-3456-7890',
    currentClass: 'Kelas 11 IPA 1',
    address: 'Jl. Merdeka No. 45, RT 02 / RW 05, Kel. Citarum, Kec. Bandung Wetan, Kota Bandung',
    nik: '3273011405080002',
    birthPlace: 'Bandung',
    birthDate: '2008-05-14',
    gender: 'Laki-laki',
    religion: 'Islam',
    fatherName: 'Budi Hidayat',
    fatherOccupation: 'Karyawan Swasta',
    motherName: 'Siti Aminah',
    motherOccupation: 'Ibu Rumah Tangga',
    guardianName: 'Budi Hidayat (Ayah)',
    guardianPhone: '0813-9876-5432',
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
      {
        academicYear: academicYear,
        grade: 'Kelas 11',
        className: 'Kelas 11 IPA 1',
        semester: semester === 'Genap' ? 'Semester Ganjil' : 'Semester Lalu',
        status: 'Tuntas',
        isCurrent: false,
      },
      {
        academicYear: '2024/2025',
        grade: 'Kelas 10',
        className: 'Kelas 10 IPA 1',
        semester: 'Semester Genap',
        status: 'Naik Kelas',
        isCurrent: false,
      },
      {
        academicYear: '2024/2025',
        grade: 'Kelas 10',
        className: 'Kelas 10 IPA 1',
        semester: 'Semester Ganjil',
        status: 'Tuntas',
        isCurrent: false,
      },
    ],
  });

  const [documents, setDocuments] = React.useState([
    { id: '1', name: 'Akte Kelahiran', fileName: 'Akte_Kelahiran_Rian.pdf', status: 'TERVERIFIKASI', date: '12 Jul 2025' },
    { id: '2', name: 'Kartu Keluarga (KK)', fileName: 'Kartu_Keluarga_Rian.pdf', status: 'TERVERIFIKASI', date: '12 Jul 2025' },
    { id: '3', name: 'Ijazah SMP / SKL', fileName: 'Ijazah_SMP_Rian.pdf', status: 'TERVERIFIKASI', date: '14 Jul 2025' },
    { id: '4', name: 'Pas Foto 3x4 (Latar Merah)', fileName: 'Pasfoto_Rian.jpg', status: 'TERVERIFIKASI', date: '15 Jul 2025' },
    { id: '5', name: 'KTP Orang Tua / Wali', fileName: 'KTP_OrangTua.pdf', status: 'MENUNGGU', date: '16 Jul 2025' },
  ]);

  const [editOpen, setEditOpen] = React.useState(false);

  const handleUploadSimulated = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            fileName: file.name,
            status: 'MENUNGGU',
            date: 'Hari ini',
          };
        }
        return doc;
      }));
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil & Berkas Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Kelola biodata pribadi, data orang tua, serta kelengkapan dokumen persyaratan sekolah.
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
          <Edit3 className="w-4 h-4" />
          Edit Biodata & Ortu
        </Button>
      </div>

      {/* Main Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-20 h-20 border">
              <AvatarImage src="" alt={student.name} />
              <AvatarFallback className="text-xl font-semibold bg-muted text-foreground">
                RH
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold">{student.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mt-1">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    {student.currentClass} • TA {student.academicYear}
                  </p>
                </div>
                <Badge variant="outline">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Status: {student.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-sm border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>NISN: <strong className="text-foreground">{student.nisn}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>NIS: <strong className="text-foreground">{student.nis}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Menu */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Biodata & Data Keluarga</TabsTrigger>
          <TabsTrigger value="documents">Berkas & Surat Penting</TabsTrigger>
          <TabsTrigger value="academic">Riwayat Kenaikan Kelas</TabsTrigger>
        </TabsList>

        {/* Tab 1: Biodata & Data Keluarga */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Identitas Pribadi Siswa
                </CardTitle>
                <CardDescription>Informasi NIK, TTL, dan domisili siswa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">NIK (No. KTP)</span>
                  <span className="font-semibold">{student.nik}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Tempat, Tanggal Lahir</span>
                  <span className="font-semibold">{student.birthPlace}, {student.birthDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Jenis Kelamin</span>
                  <span className="font-semibold">{student.gender}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Agama</span>
                  <span className="font-semibold">{student.religion}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="font-semibold">{student.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Nomor HP / WA</span>
                  <span className="font-semibold">{student.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Alamat Tinggal</span>
                  <span className="font-medium flex items-start gap-1 text-xs bg-muted/40 p-2.5 rounded-md">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {student.address}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Data Orang Tua & Wali
                </CardTitle>
                <CardDescription>Identitas ayah, ibu, dan wali siswa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Nama Ayah</span>
                  <span className="font-semibold">{student.fatherName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Pekerjaan Ayah</span>
                  <span className="font-semibold">{student.fatherOccupation}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Nama Ibu</span>
                  <span className="font-semibold">{student.motherName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Pekerjaan Ibu</span>
                  <span className="font-semibold">{student.motherOccupation}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Nama Wali</span>
                  <span className="font-semibold">{student.guardianName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs text-muted-foreground">Kontak Wali / Ortu</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    {student.guardianPhone}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Berkas & Surat Penting */}
        <TabsContent value="documents" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Berkas & Surat Persyaratan</CardTitle>
              <CardDescription>
                Unggah dokumen penting seperti Akte Kelahiran, KK, dan Ijazah untuk diverifikasi oleh Panitia/Admin Sekolah.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl bg-card gap-3">
                  <div>
                    <h4 className="font-semibold text-sm">{doc.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      File: <strong className="text-foreground">{doc.fileName}</strong> • Diunggah {doc.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge variant={doc.status === 'TERVERIFIKASI' ? 'default' : 'secondary'}>
                      {doc.status}
                    </Badge>
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3">
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
        <TabsContent value="academic" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Jejak Kenaikan Kelas & Semester
              </CardTitle>
              <CardDescription>
                Riwayat perjalanan akademik dari awal masuk hingga jenjang kelas saat ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="relative border-l border-border ml-4 pl-6 space-y-6">
                {student.academicHistory.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Circle Bullet */}
                    <div className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border bg-background ${
                      item.isCurrent ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          {item.className}
                          {item.isCurrent && (
                            <Badge variant="default" className="text-xs">Aktif</Badge>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Tahun Ajaran {item.academicYear} • {item.semester}
                        </p>
                      </div>

                      <Badge 
                        variant={item.status === 'Naik Kelas' ? 'default' : 'secondary'}
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
        onSaved={(data) =>
          setStudent((prev) => ({ ...prev, ...data }))
        }
      />
    </div>
  );
}
