import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@/components/ui';
import { Send, Loader2, DollarSign, Calendar, Users, UserCheck, Search, Check } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface PublishInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMonth: number;
  defaultYear: number;
}

interface StudentOption {
  id: string;
  name: string;
  email?: string;
}

export function PublishInvoiceModal({
  isOpen,
  onClose,
  onSuccess,
  defaultMonth,
  defaultYear,
}: PublishInvoiceModalProps) {
  const [month, setMonth] = useState<number>(defaultMonth);
  const [year, setYear] = useState<number>(defaultYear);
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(450000);
  const [dueDate, setDueDate] = useState<string>('');
  
  // Target Selection: ALL vs STUDENTS
  const [targetType, setTargetType] = useState<'ALL' | 'STUDENTS'>('ALL');
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const months = [
    { val: 1, label: "Januari" },
    { val: 2, label: "Februari" },
    { val: 3, label: "Maret" },
    { val: 4, label: "April" },
    { val: 5, label: "Mei" },
    { val: 6, label: "Juni" },
    { val: 7, label: "Juli" },
    { val: 8, label: "Agustus" },
    { val: 9, label: "September" },
    { val: 10, label: "Oktober" },
    { val: 11, label: "November" },
    { val: 12, label: "Desember" }
  ];

  // Fetch daftar siswa ketika targetType diubah ke STUDENTS
  useEffect(() => {
    if (targetType === 'STUDENTS' && isOpen) {
      fetchStudents();
    }
  }, [targetType, isOpen]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await apiClient.get<any>('/users?role=SISWA&limit=100');
      if (res.success && res.data) {
        const items = res.data.items || res.data.data || (Array.isArray(res.data) ? res.data : []);
        setStudents(items);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleSelectStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handlePublish = async () => {
    if (targetType === 'STUDENTS' && selectedStudentIds.length === 0) {
      alert('Pilih minimal satu siswa jika memilih opsi siswa tertentu.');
      return;
    }

    if (useCustomAmount) {
      if (!customAmount || isNaN(customAmount) || customAmount <= 0) {
        alert('Nominal custom SPP harus bernilai angka positif lebih dari 0.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload: any = {
        month,
        year,
        targetType,
      };

      if (targetType === 'STUDENTS') {
        payload.studentIds = selectedStudentIds;
      }

      if (useCustomAmount && customAmount > 0) {
        payload.overrideAmount = Number(customAmount);
      }

      if (dueDate) {
        payload.dueDate = dueDate;
      }

      const res = await apiClient.post<any>('/admin/payments/publish', payload);

      if (res.success) {
        alert(res.data.message || 'Tagihan SPP berhasil diterbitkan!');
        onSuccess();
        onClose();
      } else {
        alert(res.error?.message || 'Gagal menerbitkan tagihan.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Terjadi kesalahan saat menerbitkan tagihan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Send className="h-5 w-5 text-primary" />
            Publish Tagihan SPP
          </DialogTitle>
          <DialogDescription>
            Terbitkan tagihan invoice SPP untuk seluruh siswa atau siswa tertentu dengan nominal custom khusus.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-3">
          {/* Periode Bulan & Tahun */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Bulan SPP</Label>
              <Select value={month.toString()} onValueChange={(val) => setMonth(parseInt(val, 10))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.val} value={m.val.toString()}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Tahun</Label>
              <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val, 10))}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i).map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Opsi Target Penerbitan (Seluruh Siswa vs Siswa Tertentu) */}
          <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              Target Siswa Penerima
            </Label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTargetType('ALL')}
                className={`p-2.5 rounded-md border text-xs text-left transition-all ${
                  targetType === 'ALL'
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'border-input bg-background hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Seluruh Siswa</span>
                  {targetType === 'ALL' && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                  Terbitkan untuk semua siswa aktif
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('STUDENTS')}
                className={`p-2.5 rounded-md border text-xs text-left transition-all ${
                  targetType === 'STUDENTS'
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'border-input bg-background hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Siswa Tertentu</span>
                  {targetType === 'STUDENTS' && <Check className="h-3.5 w-3.5 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                  Pilih orang-orang tertentu saja
                </p>
              </button>
            </div>

            {/* List pemilih siswa jika targetType === STUDENTS */}
            {targetType === 'STUDENTS' && (
              <div className="mt-3 space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Pilih Siswa:</span>
                  <Badge variant="outline" className="text-[10px]">
                    {selectedStudentIds.length} Siswa Terpilih
                  </Badge>
                </div>

                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari nama siswa..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>

                {loadingStudents ? (
                  <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Memuat daftar siswa...
                  </div>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1 border rounded-md p-1.5 bg-background">
                    {filteredStudents.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground text-center py-2">
                        Tidak ada siswa ditemukan.
                      </p>
                    ) : (
                      filteredStudents.map((st) => {
                        const isSelected = selectedStudentIds.includes(st.id);
                        return (
                          <div
                            key={st.id}
                            onClick={() => toggleSelectStudent(st.id)}
                            className={`flex items-center justify-between p-1.5 rounded text-xs cursor-pointer select-none transition-colors ${
                              isSelected ? 'bg-primary/15 font-medium' : 'hover:bg-muted'
                            }`}
                          >
                            <span>{st.name}</span>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded border-gray-300 text-primary h-3.5 w-3.5"
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Opsi Custom Biaya */}
          <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-semibold">Custom Biaya SPP</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={useCustomAmount}
                  onChange={(e) => setUseCustomAmount(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                Atur Biaya Khusus
              </label>
            </div>

            {useCustomAmount ? (
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs text-muted-foreground">Nominal SPP (Rp)</Label>
                <Input
                  type="number"
                  value={customAmount || ''}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  placeholder="Masukkan nominal custom..."
                  className="h-9"
                  min={1}
                />
                {customAmount > 0 && (
                  <p className="text-[11px] font-medium text-emerald-600">
                    Terbaca: Rp {customAmount.toLocaleString('id-ID')}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Nominal ini akan diterapkan secara khusus pada siswa yang dipilih di atas.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Menggunakan tarif standar yang dikonfigurasi pada menu Tarif SPP (Rp 450.000 / default).
              </p>
            )}
          </div>

          {/* Tanggal Jatuh Tempo */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Tanggal Jatuh Tempo (Opsional)
            </Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button onClick={handlePublish} disabled={submitting} className="bg-primary hover:bg-primary/90">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menerbitkan...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publish Tagihan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
