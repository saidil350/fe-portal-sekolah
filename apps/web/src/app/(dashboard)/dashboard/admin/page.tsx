'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button } from '@portal-sekolah/ui';
import { Users, BookOpen, UserCheck, Settings, Sparkles } from 'lucide-react';

export default function AdminItDashboard() {
  const stats = [
    { title: 'Total Siswa Terdaftar', value: '1.240 Siswa', icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
    { title: 'Total Guru & Staff', value: '86 Pengajar', icon: UserCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { title: 'Total Kelas Aktif', value: '36 Rombel', icon: BookOpen, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/30' },
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
        description="Pusat kontrol infrastruktur sistem sekolah, manajemen data guru, siswa, kelas, dan audit keamanan."
        action={
          <Button className="rounded-xl gap-2 text-xs font-semibold">
            <Sparkles className="h-4 w-4" /> Tambah Pengguna Baru
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

      {/* User Management Overview */}
      <Card className="border-border/60">
        <CardHeader className="text-left pb-4 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" /> Pengguna Baru Ditambahkan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            data={recentUsers as any}
            searchKey="name"
            searchPlaceholder="Cari pengguna..."
            columns={[
              { header: 'Nama Lengkap', accessorKey: 'name' },
              { header: 'Email Akun', accessorKey: 'email' },
              {
                header: 'Hak Akses (Role)',
                render: (row: any) => (
                  <Badge variant={row.role === 'GURU' ? 'default' : 'secondary'}>
                    {row.role}
                  </Badge>
                ),
              },
              {
                header: 'Status Akun',
                render: (row: any) => (
                  <Badge variant={row.status === 'ACTIVE' ? 'success' : 'outline'}>
                    {row.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
