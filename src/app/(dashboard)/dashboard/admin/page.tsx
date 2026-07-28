'use client';

import * as React from 'react';
import { PageHeader } from '@/components/dashboard/dashboard-route-page';
import {
  Card,
  CardContent,
  CardHeader,
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
import { Users, UserCheck, Settings, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export default function AdminItDashboard() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [statsData, setStatsData] = React.useState<{ totalStudents: number; totalTeachers: number }>({
    totalStudents: 0,
    totalTeachers: 0,
  });
  const [recentUsers, setRecentUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          apiClient.get<any>('/dashboard/stats'),
          apiClient.get<any>('/users?limit=5'),
        ]);

        if (statsRes?.success && statsRes.data) {
          setStatsData({
            totalStudents: statsRes.data.totalStudents || 0,
            totalTeachers: statsRes.data.totalTeachers || 0,
          });
        }

        if (usersRes?.success && usersRes.data?.items) {
          setRecentUsers(usersRes.data.items);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { title: 'Total Siswa Terdaftar', value: statsData.totalStudents.toLocaleString('id-ID'), icon: Users, trend: 'Siswa aktif tenant' },
    { title: 'Total Guru & Staff', value: statsData.totalTeachers.toLocaleString('id-ID'), icon: UserCheck, trend: 'Guru aktif tenant' },
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
            <Button className="gap-2" onClick={() => router.push('/dashboard/admin/users')}>
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
                  <p className="text-2xl font-bold">{loading ? '-' : s.value}</p>
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
          {loading ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat data pengguna...</span>
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Belum ada pengguna terdaftar.</div>
          ) : (
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
                  <TableRow key={user.id || index}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'GURU' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'outline'}>
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

