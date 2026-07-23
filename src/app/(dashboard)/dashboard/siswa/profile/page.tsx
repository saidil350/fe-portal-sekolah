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

export default function StudentProfilePage() {
  const [student, setStudent] = React.useState<StudentProfileData>({
    name: 'Rian Hidayat',
    nisn: '0054819203',
    nis: '2026-1108',
    email: 'rian.hidayat@sekolah.sch.id',
    phone: '0812-3456-7890',
    currentClass: 'Kelas 11 IPA 1',
    address: 'Jl. Merdeka No. 45, Bandung',
    guardianName: 'Budi Hidayat (Ayah)',
    guardianPhone: '0813-9876-5432',
    academicYear: '2025/2026',
    status: 'Aktif',

    // Academic Progression History
    academicHistory: [
      {
        academicYear: '2025/2026',
        grade: 'Kelas 11',
        className: 'Kelas 11 IPA 1',
        semester: 'Semester Genap (Aktif)',
        status: 'Sedang Berjalan',
        isCurrent: true,
      },
      {
        academicYear: '2025/2026',
        grade: 'Kelas 11',
        className: 'Kelas 11 IPA 1',
        semester: 'Semester Ganjil',
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

  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data pribadi dan riwayat jenjang kelas/semester.
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-sm">
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Informasi Umum</TabsTrigger>
          <TabsTrigger value="academic">Riwayat Semester & Kelas</TabsTrigger>
        </TabsList>

        {/* Tab 1: Informasi Umum */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="text-left">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Kontak & Akun
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-left">
                <div>
                  <span className="text-xs text-muted-foreground block">Email</span>
                  <span className="font-medium">{student.email}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Nomor HP/WhatsApp</span>
                  <span className="font-medium">{student.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Alamat Tinggal</span>
                  <span className="font-medium flex items-start gap-1 mt-0.5">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {student.address}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-left">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Data Orang Tua / Wali
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-left">
                <div>
                  <span className="text-xs text-muted-foreground block">Nama Wali</span>
                  <span className="font-medium">{student.guardianName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Kontak Wali</span>
                  <span className="font-medium flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {student.guardianPhone}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Riwayat Semester & Kenaikan Kelas */}
        <TabsContent value="academic" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="text-left">
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
