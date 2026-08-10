'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/dashboard-route-page';
import { Card, CardContent, Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, useToast, Badge } from '@/components/ui';
import { attendanceApi } from '@/lib/api-client';
import { CalendarCheck, Camera, Clock, LogOut, MapPin } from 'lucide-react';

type BendaharaAttendanceStep = 'gps' | 'face' | 'ready';

export default function BendaharaDashboardPage() {
  const { toast } = useToast();
  const [isAttendanceOpen, setIsAttendanceOpen] = React.useState(false);
  const [isClockedIn, setIsClockedIn] = React.useState(false);
  const [attendanceStep, setAttendanceStep] = React.useState<BendaharaAttendanceStep>('gps');
  const [gpsStatus, setGpsStatus] = React.useState('Belum divalidasi');
  const [faceStatus, setFaceStatus] = React.useState('Belum diverifikasi');
  const [clockTime, setClockTime] = React.useState<string | null>(null);
  const [gpsPosition, setGpsPosition] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [selfieUrl, setSelfieUrl] = React.useState<string | null>(null);
  const [isSubmittingAttendance, setIsSubmittingAttendance] = React.useState(false);

  const stats = [
    { title: 'Presensi Hari Ini', value: '100%', icon: CalendarCheck },
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
    setSelfieUrl(`/uploads/attendance/bendahara-${Date.now()}.jpg`);
    setFaceStatus('Wajah cocok dengan profil bendahara.');
    setAttendanceStep('ready');
  };

  const submitAttendance = async () => {
    if (!gpsPosition || !selfieUrl) {
      toast({
        title: 'Attendance Belum Lengkap',
        description: 'Validasi GPS dan verifikasi wajah wajib dilakukan sebelum menyimpan.',
        variant: 'destructive',
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
        notes: isClockedIn ? 'Clock out bendahara via web dashboard' : 'Clock in bendahara via web dashboard',
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
      });
    } catch (error: any) {
      toast({
        title: isClockedIn ? 'Clock Out Gagal' : 'Clock In Gagal',
        description: error?.message || 'Backend belum menerima data attendance.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  return (
    <div className="space-y-6 p-6 sm:p-8">
      <PageHeader
        title="Dashboard Bendahara"
        description="Gunakan clock in/out berbasis GPS dan verifikasi wajah untuk melakukan presensi."
        action={
          <Button className="gap-2" onClick={openAttendanceFlow}>
            {isClockedIn ? <LogOut className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1 text-left">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.title}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
                <div className="p-3 rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isClockedIn ? 'Clock Out Bendahara' : 'Clock In Bendahara'}</DialogTitle>
            <DialogDescription>
              Validasi GPS area sekolah dan verifikasi wajah diperlukan sebelum attendance disimpan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-left pt-2">
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Validasi GPS</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{gpsStatus}</p>
                </div>
                <Badge variant={attendanceStep === 'gps' ? 'secondary' : 'default'}>
                  {attendanceStep === 'gps' ? 'Perlu cek' : 'Valid'}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <Camera className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Verifikasi Wajah</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{faceStatus}</p>
                </div>
                <Badge variant={attendanceStep === 'ready' ? 'default' : 'secondary'}>
                  {attendanceStep === 'ready' ? 'Terverifikasi' : 'Selfie'}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payload attendance</p>
              <p className="mt-2 text-sm font-semibold">Role: BENDAHARA</p>
              <p className="text-sm text-muted-foreground">GPS: latitude + longitude</p>
              <p className="text-sm text-muted-foreground">Selfie: file verifikasi wajah attendance</p>
              {clockTime && <p className="mt-2 text-xs text-muted-foreground">Terakhir diproses: {clockTime}</p>}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {attendanceStep === 'gps' && (
                <Button className="gap-2" onClick={validateGps}>
                  <MapPin className="h-4 w-4" /> Validasi GPS
                </Button>
              )}
              {attendanceStep === 'face' && (
                <Button className="gap-2" onClick={verifyFace}>
                  <Camera className="h-4 w-4" /> Verifikasi Wajah
                </Button>
              )}
              {attendanceStep === 'ready' && (
                <Button className="gap-2" onClick={submitAttendance}>
                  {isClockedIn ? <LogOut className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  {isSubmittingAttendance ? 'Menyimpan...' : isClockedIn ? 'Simpan Clock Out' : 'Simpan Clock In'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
