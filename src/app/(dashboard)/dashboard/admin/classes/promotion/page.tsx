'use client';

import * as React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Calendar, 
  BookOpen,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Badge } from '@/components/ui/components/badge';
import { apiClient } from '@/lib/api-client';

interface ClassItem {
  id: string;
  name: string;
  level: number;
  program?: string;
}

interface AcademicYear {
  id: string;
  name: string;
  semester: number;
  isCurrent: boolean;
}

interface StudentItem {
  id: string;
  name: string;
  nis?: string;
  action: 'PROMOTE' | 'RETAIN' | 'GRADUATE';
}

const DEFAULT_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-2026-1', name: '2026/2027', semester: 1, isCurrent: true },
  { id: 'ay-2025-2', name: '2025/2026', semester: 2, isCurrent: false },
  { id: 'ay-2025-1', name: '2025/2026', semester: 1, isCurrent: false },
];

const DEFAULT_CLASSES: ClassItem[] = [
  { id: 'cls-10-1', name: 'X-1', level: 10 },
  { id: 'cls-10-2', name: 'X-2', level: 10 },
  { id: 'cls-10-3', name: 'X-3', level: 10 },
  { id: 'cls-11-1', name: 'XI-1', level: 11 },
  { id: 'cls-11-2', name: 'XI-2', level: 11 },
  { id: 'cls-11-3', name: 'XI-3', level: 11 },
  { id: 'cls-12-1', name: 'XII-1', level: 12 },
  { id: 'cls-12-2', name: 'XII-2', level: 12 },
];

export default function ClassPromotionPage() {
  const [academicYears, setAcademicYears] = React.useState<AcademicYear[]>(DEFAULT_ACADEMIC_YEARS);
  const [classesList, setClassesList] = React.useState<ClassItem[]>(DEFAULT_CLASSES);
  const [selectedYearId, setSelectedYearId] = React.useState<string>(DEFAULT_ACADEMIC_YEARS[0].id);
  
  const [fromClassId, setFromClassId] = React.useState<string>(DEFAULT_CLASSES[0].id);
  const [toClassId, setToClassId] = React.useState<string>(DEFAULT_CLASSES[3].id); // XI-1
  
  const [students, setStudents] = React.useState<StudentItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form tambah tahun ajaran baru
  const [showAddYear, setShowAddYear] = React.useState(false);
  const [newYearName, setNewYearName] = React.useState('');
  const [newYearSemester, setNewYearSemester] = React.useState('1');

  // Fetch initial classes and academic years
  React.useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        const [yearRes, classRes] = await Promise.all([
          apiClient.get<any>('/admin/academic-years'),
          apiClient.get<any>('/admin/classes'),
        ]);

        if (yearRes?.data && Array.isArray(yearRes.data) && yearRes.data.length > 0) {
          const years = yearRes.data;
          setAcademicYears(years);
          const current = years.find((y: AcademicYear) => y.isCurrent) || years[0];
          if (current) setSelectedYearId(current.id);
        } else {
          setAcademicYears(DEFAULT_ACADEMIC_YEARS);
          setSelectedYearId(DEFAULT_ACADEMIC_YEARS[0].id);
        }

        if (classRes?.data && Array.isArray(classRes.data) && classRes.data.length > 0) {
          setClassesList(classRes.data);
          if (classRes.data[0]?.id) setFromClassId(classRes.data[0].id);
        } else {
          setClassesList(DEFAULT_CLASSES);
          setFromClassId(DEFAULT_CLASSES[0].id);
        }
      } catch (err) {
        console.error('Gagal mengambil data kelas/tahun ajaran, menggunakan data default:', err);
        setAcademicYears(DEFAULT_ACADEMIC_YEARS);
        setSelectedYearId(DEFAULT_ACADEMIC_YEARS[0].id);
        setClassesList(DEFAULT_CLASSES);
        setFromClassId(DEFAULT_CLASSES[0].id);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Set default Rombel Tujuan ketika Rombel Asal berubah
  React.useEffect(() => {
    if (!fromClassId) return;
    const currentClass = classesList.find((c) => c.id === fromClassId);
    if (!currentClass) return;

    // Cari kelas dengan level N+1
    const nextLevelClass = classesList.find((c) => c.level === currentClass.level + 1);
    if (nextLevelClass) {
      setToClassId(nextLevelClass.id);
    } else {
      setToClassId('');
    }

    // Dummy/Mock data siswa rombel asal jika API get students dikembalikan
    // Nanti bisa diambil via endpoint /admin/classes/:id/students
    fetchClassStudents(fromClassId, currentClass.level);
  }, [fromClassId, classesList]);

  const fetchClassStudents = async (classId: string, level: number) => {
    try {
      const res = await apiClient.get<any>(`/admin/classes/${classId}/students`);
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setStudents(
          res.data.map((s: any) => ({
            id: s.id,
            name: s.name,
            nis: s.nis || '10293' + s.id.slice(0, 3),
            action: level >= 12 ? 'GRADUATE' : 'PROMOTE',
          }))
        );
      } else {
        // Mock fallback siswa jika backend belum memiliki data siswa terdaftar di rombel tersebut
        const isFinalLevel = level >= 12;
        setStudents([
          { id: 'std-1', name: 'Ahmad Fauzi', nis: '20241001', action: isFinalLevel ? 'GRADUATE' : 'PROMOTE' },
          { id: 'std-2', name: 'Budi Santoso', nis: '20241002', action: isFinalLevel ? 'GRADUATE' : 'PROMOTE' },
          { id: 'std-3', name: 'Citra Dewi', nis: '20241003', action: isFinalLevel ? 'GRADUATE' : 'PROMOTE' },
          { id: 'std-4', name: 'Dian Permana', nis: '20241004', action: isFinalLevel ? 'GRADUATE' : 'PROMOTE' },
          { id: 'std-5', name: 'Eka Putri', nis: '20241005', action: isFinalLevel ? 'GRADUATE' : 'PROMOTE' },
        ]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleActionChange = (studentId: string, action: 'PROMOTE' | 'RETAIN' | 'GRADUATE') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, action } : s))
    );
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;
    try {
      const res = await apiClient.post<any>('/admin/academic-years', {
        name: newYearName,
        semester: parseInt(newYearSemester, 10),
        isCurrent: true,
      });
      if (res?.data) {
        setAcademicYears((prev) => [res.data, ...prev]);
        setSelectedYearId(res.data.id);
        setShowAddYear(false);
        setNewYearName('');
        setMessage({ type: 'success', text: 'Tahun Ajaran Baru berhasil dibuat dan diaktifkan!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Gagal membuat tahun ajaran' });
    }
  };

  const handleSubmitPromotion = async () => {
    if (!fromClassId || !selectedYearId) {
      setMessage({ type: 'error', text: 'Harap pilih Rombel Asal dan Tahun Ajaran Tujuan' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        fromClassId,
        toClassId: toClassId || undefined,
        academicYearId: selectedYearId,
        promotions: students.map((s) => ({
          studentId: s.id,
          action: s.action,
        })),
      };

      const res = await apiClient.post<any>('/admin/classes/promote', payload);
      if (res?.data) {
        setMessage({
          type: 'success',
          text: `Proses kenaikan kelas berhasil! ${res.data.processedCount} siswa diproses.`,
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Gagal memproses kenaikan kelas' });
    } finally {
      setSubmitting(false);
    }
  };

  const currentFromClass = classesList.find((c) => c.id === fromClassId);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Kenaikan Kelas & Kelulusan</h1>
            <Badge variant="outline" className="gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              Siklus 2 Semester
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola kenaikan tingkat kelas siswa dan penetapan kelulusan pada akhir Tahun Ajaran.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddYear(!showAddYear)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {showAddYear ? 'Batal' : 'Tambah Tahun Ajaran'}
        </Button>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form Tambah Tahun Ajaran (Collapse) */}
      {showAddYear && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Buat Tahun Ajaran Baru</CardTitle>
            <CardDescription>Menambahkan periode akademik baru untuk kenaikan kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateYear} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Tahun Ajaran</label>

                <input
                  type="text"
                  placeholder="Contoh: 2026/2027"
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border bg-background"
                  required
                />
              </div>

              <div className="w-40 space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Semester</label>

                <select
                  value={newYearSemester}
                  onChange={(e) => setNewYearSemester(e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border bg-background"
                >
                  <option value="1">Semester 1 (Ganjil)</option>
                  <option value="2">Semester 2 (Genap)</option>
                </select>
              </div>

              <Button type="submit" size="sm" className="h-9">
                Simpan & Aktifkan
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Config Step Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Langkah 1: Konfigurasi Rombel & Tahun Ajaran
          </CardTitle>
          <CardDescription>Pilih rombel yang akan diproses dan alokasi rombel tujuannya.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tahun Ajaran Tujuan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Tahun Ajaran Baru</label>
            <select
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-md border bg-background"
            >
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name} (Sem {year.semester}) {year.isCurrent ? '— AKTIF' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Rombel Asal */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Rombel Asal</label>
            <select
              value={fromClassId}
              onChange={(e) => setFromClassId(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-md border bg-background"
            >
              <option value="">-- Pilih Rombel Asal --</option>
              {classesList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Kelas {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rombel Tujuan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Rombel Tujuan (Naik Kelas)</label>
            <select
              value={toClassId}
              onChange={(e) => setToClassId(e.target.value)}
              disabled={Boolean(currentFromClass && currentFromClass.level >= 12)}
              className="w-full h-10 px-3 text-sm rounded-md border bg-background disabled:opacity-50"
            >
              <option value="">
                {currentFromClass && currentFromClass.level >= 12
                  ? '-- Tingkat Akhir (Kelulusan) --'
                  : '-- Pilih Rombel Tujuan --'}
              </option>
              {classesList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  Kelas {cls.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Student List & Action Table */}
      {fromClassId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Langkah 2: Daftar Siswa & Status Kenaikan ({students.length} Siswa)
              </CardTitle>
              <CardDescription>
                Sesuaikan status individual (Naik Kelas / Tinggal Kelas / Lulus) untuk setiap siswa.
              </CardDescription>
            </div>

            <Button
              onClick={handleSubmitPromotion}
              disabled={submitting}
              className="gap-2 bg-primary text-primary-foreground"
            >
              <ArrowRight className="w-4 h-4" />
              {submitting ? 'Memproses...' : 'Eksekusi Kenaikan Kelas'}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-y text-muted-foreground">
                  <tr>
                    <th className="p-4 font-semibold">No</th>
                    <th className="p-4 font-semibold">NIS</th>
                    <th className="p-4 font-semibold">Nama Siswa</th>
                    <th className="p-4 font-semibold text-center">Status Keputusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-accent/30 transition-colors">
                      <td className="p-4 font-medium text-muted-foreground">{index + 1}</td>
                      <td className="p-4 font-mono text-xs">{student.nis}</td>
                      <td className="p-4 font-semibold">{student.name}</td>
                      <td className="p-4 text-center">
                        <div className="inline-flex rounded-md border p-1 bg-muted/40 gap-1">
                          <button
                            type="button"
                            onClick={() => handleActionChange(student.id, 'PROMOTE')}
                            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                              student.action === 'PROMOTE'
                                ? 'bg-green-600 text-white font-bold shadow'
                                : 'text-muted-foreground hover:bg-background'
                            }`}
                          >
                            Naik Kelas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionChange(student.id, 'RETAIN')}
                            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                              student.action === 'RETAIN'
                                ? 'bg-amber-600 text-white font-bold shadow'
                                : 'text-muted-foreground hover:bg-background'
                            }`}
                          >
                            Tinggal Kelas
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionChange(student.id, 'GRADUATE')}
                            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                              student.action === 'GRADUATE'
                                ? 'bg-blue-600 text-white font-bold shadow'
                                : 'text-muted-foreground hover:bg-background'
                            }`}
                          >
                            Lulus (Alumni)
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
