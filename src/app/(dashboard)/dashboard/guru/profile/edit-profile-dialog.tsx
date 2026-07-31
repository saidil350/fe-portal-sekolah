'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/components/dialog';
import { Button } from '@/components/ui/components/button';
import { Input } from '@/components/ui/components/input';
import { toast } from '@/components/ui/hooks/use-toast';

export interface TeacherProfileData {
  name: string;
  avatarUrl?: string | null;
  nip: string;
  email: string;
  phone: string;
  address: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  religion: string;
  role: string;
  status: string;
  education: string;
  subjectArea: string;
  academicYear: string;
  teachingHistory: Array<{
    academicYear: string;
    period: string;
    status: string;
    isCurrent: boolean;
  }>;
}

export type EditableTeacherFields = Pick<
  TeacherProfileData,
  | 'email'
  | 'phone'
  | 'address'
  | 'nik'
  | 'birthPlace'
  | 'birthDate'
  | 'gender'
  | 'religion'
  | 'education'
  | 'subjectArea'
>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: TeacherProfileData;
  onSaved: (data: EditableTeacherFields) => void;
}

const labelClass = 'text-xs text-muted-foreground block mb-1.5 font-medium';

export function EditTeacherProfileDialog({
  open,
  onOpenChange,
  teacher,
  onSaved,
}: EditProfileDialogProps) {
  const [form, setForm] = React.useState<EditableTeacherFields>({
    email: teacher.email,
    phone: teacher.phone,
    address: teacher.address,
    nik: teacher.nik,
    birthPlace: teacher.birthPlace,
    birthDate: teacher.birthDate,
    gender: teacher.gender,
    religion: teacher.religion,
    education: teacher.education,
    subjectArea: teacher.subjectArea,
  });

  // Sinkronkan form setiap kali dialog dibuka dengan data terbaru.
  React.useEffect(() => {
    if (open) {
      setForm({
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address,
        nik: teacher.nik,
        birthPlace: teacher.birthPlace,
        birthDate: teacher.birthDate,
        gender: teacher.gender,
        religion: teacher.religion,
        education: teacher.education,
        subjectArea: teacher.subjectArea,
      });
    }
  }, [open, teacher]);

  const handleChange =
    (field: keyof EditableTeacherFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.phone.trim()) {
      toast({
        title: 'Data belum lengkap',
        description: 'Email dan nomor HP wajib diisi.',
        variant: 'destructive',
      });
      return;
    }

    onSaved(form);
    toast({
      title: 'Biodata & Data Kepegawaian Berhasil Diperbarui',
      description: 'Perubahan data pribadi dan kepegawaian Anda telah disimpan.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto text-left">
        <DialogHeader>
          <DialogTitle>Edit Biodata & Data Kepegawaian Guru</DialogTitle>
          <DialogDescription>
            Lengkapi data pribadi, tempat tanggal lahir, NIK, serta kontak resmi tenaga pendidik. Data identitas utama (NIP & nama) dikelola oleh Admin IT.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Section 1: Identitas Kepegawaian (Read-only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border">
            <div>
              <label className={labelClass}>Nama Lengkap (Guru)</label>
              <Input value={teacher.name} disabled className="bg-background" />
            </div>
            <div>
              <label className={labelClass}>NIP / ID Tenaga Pendidik</label>
              <Input value={teacher.nip} disabled className="bg-background" />
            </div>
          </div>

          {/* Section 2: Data Pribadi Guru */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Data Pribadi & Kontak</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="edit-guru-nik">NIK (Nomor KTP)</label>
                <Input
                  id="edit-guru-nik"
                  value={form.nik}
                  onChange={handleChange('nik')}
                  placeholder="32730xxxxxxxxx"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guru-gender">Jenis Kelamin</label>
                <select
                  id="edit-guru-gender"
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guru-birth-place">Tempat Lahir</label>
                <Input
                  id="edit-guru-birth-place"
                  value={form.birthPlace}
                  onChange={handleChange('birthPlace')}
                  placeholder="Kota Kelahiran"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guru-birth-date">Tanggal Lahir</label>
                <Input
                  id="edit-guru-birth-date"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange('birthDate')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guru-religion">Agama</label>
                <select
                  id="edit-guru-religion"
                  value={form.religion}
                  onChange={handleChange('religion')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guru-phone">Nomor HP / WhatsApp</label>
                <Input
                  id="edit-guru-phone"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="0812-xxxx-xxxx"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-guru-email">Email Resmi Guru</label>
              <Input
                id="edit-guru-email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="guru@sekolah.sch.id"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-guru-address">Alamat Tinggal</label>
              <textarea
                id="edit-guru-address"
                value={form.address}
                onChange={handleChange('address')}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Alamat domisili lengkap"
              />
            </div>
          </div>

          {/* Section 3: Data Kepegawaian & Kualifikasi */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. Kualifikasi & Bidang Studi</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="edit-guru-education">Pendidikan Terakhir</label>
                <select
                  id="edit-guru-education"
                  value={form.education}
                  onChange={handleChange('education')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="S1 - Sarjana Pendidikan">S1 - Sarjana Pendidikan</option>
                  <option value="S1 - Non Pendidikan">S1 - Non Pendidikan</option>
                  <option value="S2 - Magister Pendidikan">S2 - Magister Pendidikan</option>
                  <option value="S2 - Magister Non Pendidikan">S2 - Magister Non Pendidikan</option>
                  <option value="S3 - Doktor">S3 - Doktor</option>
                  <option value="D4 / Setara">D4 / Setara</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guru-subject">Mata Pelajaran Utama</label>
                <Input
                  id="edit-guru-subject"
                  value={form.subjectArea}
                  onChange={handleChange('subjectArea')}
                  placeholder="Contoh: Matematika, Fisika"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
