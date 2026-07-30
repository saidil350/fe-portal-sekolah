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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/components/avatar';
import { Badge } from '@/components/ui/components/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/components/tabs';
import {
  EditTeacherProfileDialog,
  type TeacherProfileData,
} from './edit-profile-dialog';
import { profileApi } from '@/lib/api-client';

export default function TeacherProfilePage() {
  const [loading, setLoading] = React.useState(true);
  const [teacher, setTeacher] = React.useState<TeacherProfileData>({
    name: 'Siti Aminah, S.Pd.',
    nip: '198507122010012004',
    email: 'siti.aminah@sekolah.sch.id',
    phone: '0812-9988-7766',
    role: 'Guru Tetap',
    address: 'Jl. Ahmad Yani No. 12, Bandung',
    status: 'Aktif',

    // Riwayat mengajar (tanpa referensi mapel/kelas)
    teachingHistory: [
      {
        year: '2025/2026',
        period: 'Semester Genap',
        status: 'Sedang Berjalan',
        isCurrent: true,
      },
      {
        year: '2025/2026',
        period: 'Semester Ganjil',
        status: 'Selesai',
        isCurrent: false,
      },
      {
        year: '2024/2025',
        period: 'Semester Genap',
        status: 'Selesai',
        isCurrent: false,
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
          const tp = u.teacherProfile;
          setTeacher((prev) => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            nip: tp?.nip || prev.nip,
          }));
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

  const [editOpen, setEditOpen] = React.useState(false);

  // Inisial untuk avatar
  const initials = teacher.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
            <Avatar className="w-20 h-20 border">
              <AvatarImage src="" alt={teacher.name} />
              <AvatarFallback className="text-xl font-semibold bg-muted text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

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
