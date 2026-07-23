"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Settings, Plus, Edit, Trash2, School, CalendarCheck, Bell, Users, CheckCircle, Save, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface ClassItem {
  id: string;
  name: string;
  isActive: boolean;
  homeroomTeacherId?: string;
  homeroomTeacherName?: string;
}



export default function AdminSettingsPage() {
  // Config state
  const [schoolName, setSchoolName] = useState('Portal Sekolah');
  const [sppDueDate, setSppDueDate] = useState('10');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('portal_school_name');
      if (storedName) setSchoolName(storedName);
    }
  }, []);

  // Classes state
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [formName, setFormName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch classes
  const fetchData = async () => {
    try {
      setLoadingClasses(true);
      const classRes = await apiClient.get<any>('/admin/classes');

      if (classRes.success && classRes.data) {
        setClassesList(classRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings data:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingClass(null);
    setFormName('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: ClassItem) => {
    setEditingClass(cls);
    setFormName(cls.name);
    setIsModalOpen(true);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    // Mock save configurations
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('portal_school_name', schoolName);
      window.dispatchEvent(new Event('schoolNameChanged'));
    }
    
    setIsSavingConfig(false);
    alert('Pengaturan sekolah berhasil disimpan!');
  };

  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Nama kelas wajib diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formName,
      };

      let res;
      if (editingClass) {
        res = await apiClient.put<any>(`/admin/classes/${editingClass.id}`, payload);
      } else {
        res = await apiClient.post<any>('/admin/classes', payload);
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(res.error?.message || 'Gagal menyimpan kelas');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menghubungi server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini?')) return;

    try {
      const res = await apiClient.delete<any>(`/admin/classes/${id}`);
      if (res.success) {
        fetchData();
      } else {
        alert(res.error?.message || 'Gagal menghapus kelas');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menghubungi server');
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pengaturan Sekolah</h2>
          <p className="text-muted-foreground mt-1">
            Kelola profil tenant sekolah, konfigurasi akademik, dan kelola daftar kelas kustom Anda.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-primary/10 p-2.5 text-primary">
              <School className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Profil Sekolah</p>
              <h3 className="text-lg font-bold">Lengkap</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Identitas dan kontak tervalidasi</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-green-500/10 p-2.5 text-green-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tahun Ajaran</p>
              <h3 className="text-lg font-bold">2025/2026</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Semester genap aktif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-md bg-blue-500/10 p-2.5 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Kelas Kustom</p>
              <h3 className="text-lg font-bold">{classesList.length} Kelas</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Dikelola dinamis di database</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: General settings form */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" /> Pengaturan Umum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Nama Sekolah</label>
                <Input 
                  value={schoolName} 
                  onChange={(e) => setSchoolName(e.target.value)} 
                  placeholder="Nama sekolah" 
                  className="text-xs" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Batas Hari Bayar SPP Bulanan</label>
                <Input 
                  type="number"
                  value={sppDueDate} 
                  onChange={(e) => setSppDueDate(e.target.value)} 
                  placeholder="Batas Tanggal bayar" 
                  className="text-xs" 
                />
              </div>
              <Button type="submit" disabled={isSavingConfig} className="w-full text-xs h-9 gap-1.5 mt-2">
                {isSavingConfig ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Simpan Konfigurasi
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Side: Classes list / management */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <School className="h-4 w-4 text-primary" /> Daftar Kelas Kustom
              </CardTitle>
              <Button onClick={handleOpenAddModal} size="sm" className="h-8 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Tambah Kelas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingClasses ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : classesList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                <School className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-semibold">Belum ada kelas kustom</p>
                <p className="text-xs opacity-75">Gunakan tombol tambah kelas untuk membuat kelas kustom baru.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-xs">Nama Kelas</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classesList.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="text-xs font-semibold">{cls.name}</TableCell>
                        <TableCell>
                          <Badge variant={cls.isActive ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0.5">
                            {cls.isActive ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEditModal(cls)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteClass(cls.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Class Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-background border shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <School className="h-5 w-5 text-primary" /> 
                {editingClass ? 'Ubah Kelas Kustom' : 'Tambah Kelas Kustom'}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmitClass}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Nama Kelas (kustom)</label>
                  <Input 
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)} 
                    placeholder="Contoh: Kelas 10-A, Unggulan 1, Rombel X" 
                    className="text-xs"
                    required
                  />
                </div>


                {editingClass && (
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="isActive"
                      checked={editingClass.isActive}
                      onChange={(e) => setEditingClass({ ...editingClass, isActive: e.target.checked })}
                      className="rounded border-input text-primary"
                    />
                    <label htmlFor="isActive" className="text-xs font-semibold text-muted-foreground">Kelas Aktif</label>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)} 
                    className="h-9 text-xs font-semibold px-4"
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="h-9 text-xs font-semibold px-4 gap-1.5"
                  >
                    {isSubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
                    Simpan
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
