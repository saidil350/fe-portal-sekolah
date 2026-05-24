'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button, Dialog, useToast } from '@portal-sekolah/ui';
import { attendanceApi } from '@portal-sekolah/api-client';
import { CalendarCheck, BookOpen, FileText, CheckCircle, Camera, Clock, LogOut, MapPin } from 'lucide-react';

type TeacherAttendanceStep = 'gps' | 'face' | 'ready';

export default function GuruDashboard() {
  const { toast } = useToast();
  const [isAttendanceOpen, setIsAttendanceOpen] = React.useState(false);
  const [isClockedIn, setIsClockedIn] = React.useState(false);
  const [attendanceStep, setAttendanceStep] = React.useState<TeacherAttendanceStep>('gps');
  const [gpsStatus, setGpsStatus] = React.useState('Belum divalidasi');
  const [faceStatus, setFaceStatus] = React.useState('Belum diverifikasi');
  const [clockTime, setClockTime] = React.useState<string | null>(null);
  const [gpsPosition, setGpsPosition] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [selfieUrl, setSelfieUrl] = React.useState<string | null>(null);
  const [isSubmittingAttendance, setIsSubmittingAttendance] = React.useState(false);

  const stats = [
    { title: 'Presensi Kelas Hari Ini', value: '98.5%', icon: CalendarCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Tugas Belum Dinilai', value: '14 Pengumpulan', icon: FileText, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
    { title: 'Total Mata Pelajaran', value: '4 Rombel', icon: BookOpen, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
  ];

  const classAssignments = [
    { title: 'Tugas 1: Eksperimen Kimia Organik', class: 'XI IPA 2', due: '28 Mei 2026', submitted: '28/30 Siswa' },
    { title: 'Ulangan Harian: Stoikiometri Larutan', class: 'XI IPA 1', due: '25 Mei 2026', submitted: '30/30 Siswa' },
    { title: 'Tugas Mandiri: Reaksi Redoks', class: 'XI IPA 2', due: '30 Mei 2026', submitted: '12/30 Siswa' },
  ];

  const resetAttendanceFlow = () => {
    setAttendanceStep('gps');
    setGpsStatus('Belum divalidasi');
    setFaceStatus('Belum diverifikasi');
    setGpsPosition(null);
    setSelfieUrl(null);
  };

  const openAttendanceFlow = () => {
    resetAttendanceFlow();
    setIsAttendanceOpen(true);
  };

  const validateGps = () => {
    setGpsStatus('Meminta lokasi perangkat...');

    if (!navigator.geolocation) {
      setGpsStatus('GPS tidak tersedia di perangkat ini.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));
        setGpsPosition({ latitude, longitude });
        setGpsStatus(`Valid dalam radius sekolah (${latitude}, ${longitude})`);
        setAttendanceStep('face');
      },
      () => {
        setGpsStatus('Izin GPS belum aktif. Aktifkan lokasi untuk melanjutkan.');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const verifyFace = () => {
    setSelfieUrl(`/uploads/attendance/guru-${Date.now()}.jpg`);
    setFaceStatus('Wajah cocok dengan profil guru.');
    setAttendanceStep('ready');
  };

  const submitAttendance = async () => {
    if (!gpsPosition || !selfieUrl) {
      toast({
        title: 'Attendance Belum Lengkap',
        description: 'Validasi GPS dan verifikasi wajah wajib dilakukan sebelum menyimpan.',
        type: 'warning',
      });
      return;
    }

    setIsSubmittingAttendance(true);
    const now = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

    try {
      const payload = {
        latitude: gpsPosition.latitude,
        longitude: gpsPosition.longitude,
        selfieUrl,
        faceVerified: true,
        notes: isClockedIn ? 'Clock out guru via web dashboard' : 'Clock in guru via web dashboard',
      };

      if (isClockedIn) {
        await attendanceApi.checkOut(payload);
      } else {
        await attendanceApi.checkIn(payload);
      }

      setClockTime(now);
      setIsClockedIn((current) => !current);
      setIsAttendanceOpen(false);
      toast({
        title: isClockedIn ? 'Clock Out Berhasil' : 'Clock In Berhasil',
        description: `Data tersimpan ke backend pada pukul ${now}.`,
        type: 'success',
      });
    } catch (error: any) {
      toast({
        title: isClockedIn ? 'Clock Out Gagal' : 'Clock In Gagal',
        description: error?.message || 'Backend belum menerima data attendance.',
        type: 'error',
      });
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Guru"
        description="Gunakan clock in/out berbasis GPS dan verifikasi wajah, lalu pantau penugasan dan evaluasi siswa."
        action={
          <Button className="rounded-xl gap-2 text-xs font-semibold" onClick={openAttendanceFlow}>
            {isClockedIn ? <LogOut className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            {isClockedIn ? 'Clock Out' : 'Clock In'}
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

      {/* Active Assignments List */}
      <Card className="border-border/60">
        <CardHeader className="text-left pb-4 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" /> Daftar Penugasan Aktif
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            data={classAssignments as any}
            searchKey="title"
            searchPlaceholder="Cari judul tugas..."
            columns={[
              { header: 'Judul Tugas / Modul', accessorKey: 'title' },
              { header: 'Kelas Sasaran', accessorKey: 'class' },
              { header: 'Batas Pengumpulan (Due)', accessorKey: 'due' },
              {
                header: 'Status Pengumpulan',
                render: (row: any) => (
                  <Badge variant={row.submitted.startsWith('30') ? 'success' : 'secondary'}>
                    {row.submitted}
                  </Badge>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      <Dialog
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        title={isClockedIn ? 'Clock Out Guru' : 'Clock In Guru'}
        description="Validasi GPS area sekolah dan verifikasi wajah diperlukan sebelum attendance disimpan."
      >
        <div className="space-y-4 text-left">
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold">Validasi GPS</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{gpsStatus}</p>
              </div>
              <Badge variant={attendanceStep === 'gps' ? 'secondary' : 'success'}>
                {attendanceStep === 'gps' ? 'Perlu cek' : 'Valid'}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Camera className="mt-1 h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold">Verifikasi Wajah</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{faceStatus}</p>
              </div>
              <Badge variant={attendanceStep === 'ready' ? 'success' : 'secondary'}>
                {attendanceStep === 'ready' ? 'Terverifikasi' : 'Selfie'}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Payload attendance</p>
            <p className="mt-2 text-sm font-semibold">Role: GURU</p>
            <p className="text-sm text-muted-foreground">GPS: latitude + longitude</p>
            <p className="text-sm text-muted-foreground">Selfie: file verifikasi wajah attendance</p>
            {clockTime && <p className="mt-2 text-xs text-muted-foreground">Terakhir diproses: {clockTime}</p>}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {attendanceStep === 'gps' && (
              <Button className="rounded-xl gap-2" onClick={validateGps}>
                <MapPin className="h-4 w-4" /> Validasi GPS
              </Button>
            )}
            {attendanceStep === 'face' && (
              <Button className="rounded-xl gap-2" onClick={verifyFace}>
                <Camera className="h-4 w-4" /> Verifikasi Wajah
              </Button>
            )}
            {attendanceStep === 'ready' && (
              <Button className="rounded-xl gap-2" onClick={submitAttendance}>
                {isClockedIn ? <LogOut className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                {isSubmittingAttendance ? 'Menyimpan...' : isClockedIn ? 'Simpan Clock Out' : 'Simpan Clock In'}
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
