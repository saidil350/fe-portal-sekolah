'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/dashboard-route-page';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { Users, UserCheck, Settings, UserPlus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminItDashboard() {
  const router = useRouter();

  const stats = [
    { title: 'Total Siswa Terdaftar', value: '1.240', icon: Users, trend: '36 rombel aktif' },
    { title: 'Total Guru & Staff', value: '86', icon: UserCheck, trend: '74 aktif hari ini' },
  ];

  const recentUsers = [
    { name: 'Dr. Budi Santoso', email: 'budi.santoso@sekolah1.sch.id', role: 'GURU', status: 'ACTIVE' },
    { name: 'Rian Hidayat', email: 'rian.hidayat@sekolah1.sch.id', role: 'SISWA', status: 'ACTIVE' },
    { name: 'Siti Aminah, S.Pd', email: 'siti.aminah@sekolah1.sch.id', role: 'GURU', status: 'ACTIVE' },
    { name: 'Lia Lestari', email: 'lia.lestari@sekolah1.sch.id', role: 'STAFF', status: 'INACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Admin IT"
        description="Pusat kontrol infrastruktur sistem sekolah, manajemen data guru, siswa, dan audit keamanan."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push('/dashboard/admin/users')}
            >
              Kelola Pengguna
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> Tambah Pengguna Baru
            </Button>
          </div>
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
                  <p className="text-xs text-muted-foreground">{s.trend}</p>
                </div>
                <div className="p-3 rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Management Overview */}
      <Card>
        <CardHeader className="text-left pb-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" /> Pengguna Baru Ditambahkan
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => router.push('/dashboard/admin/users')}
          >
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email Akun</TableHead>
                <TableHead>Hak Akses (Role)</TableHead>
                <TableHead>Status Akun</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'GURU' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'outline'}>
                      {user.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
