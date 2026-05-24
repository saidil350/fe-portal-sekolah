'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { Card, CardHeader, CardContent, CardTitle, Badge, Button } from '@portal-sekolah/ui';
import { CalendarCheck, BookOpen, FileText, CheckCircle, Sparkles } from 'lucide-react';

export default function GuruDashboard() {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Guru"
        description="Pantau presensi mandiri kelas bimbingan Anda, kelola lembar penugasan (assignments), dan evaluasi penilaian siswa."
        action={
          <Button className="rounded-xl gap-2 text-xs font-semibold">
            <Sparkles className="h-4 w-4" /> Buat Tugas Baru
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
    </div>
  );
}
