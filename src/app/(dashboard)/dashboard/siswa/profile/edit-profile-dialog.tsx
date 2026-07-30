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

export interface StudentProfileData {
  name: string;
  avatarUrl?: string | null;
  nisn: string;
  nis: string;
  email: string;
  phone: string;
  currentClass: string;
  address: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  religion: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  guardianName: string;
  guardianPhone: string;
  academicYear: string;
  status: string;
  academicHistory: Array<{
    academicYear: string;
    grade: string;
    className: string;
    semester: string;
    status: string;
    isCurrent: boolean;
  }>;
}

type EditableFields = Pick<
  StudentProfileData,
  | 'email'
  | 'phone'
  | 'address'
  | 'nik'
  | 'birthPlace'
  | 'birthDate'
  | 'gender'
  | 'religion'
  | 'fatherName'
  | 'fatherOccupation'
  | 'motherName'
  | 'motherOccupation'
  | 'guardianName'
  | 'guardianPhone'
>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileData;
  onSaved: (data: EditableFields) => void;
}

const labelClass = 'text-xs text-muted-foreground block mb-1.5 font-medium';

export function EditProfileDialog({
  open,
  onOpenChange,
  student,
  onSaved,
}: EditProfileDialogProps) {
  const [form, setForm] = React.useState<EditableFields>({
    email: student.email,
    phone: student.phone,
    address: student.address,
    nik: student.nik,
    birthPlace: student.birthPlace,
    birthDate: student.birthDate,
    gender: student.gender,
    religion: student.religion,
    fatherName: student.fatherName,
    fatherOccupation: student.fatherOccupation,
    motherName: student.motherName,
    motherOccupation: student.motherOccupation,
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
  });

  // Sinkronkan form setiap kali dialog dibuka dengan data terbaru.
  React.useEffect(() => {
    if (open) {
      setForm({
        email: student.email,
        phone: student.phone,
        address: student.address,
        nik: student.nik,
        birthPlace: student.birthPlace,
        birthDate: student.birthDate,
        gender: student.gender,
        religion: student.religion,
        fatherName: student.fatherName,
        fatherOccupation: student.fatherOccupation,
        motherName: student.motherName,
        motherOccupation: student.motherOccupation,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
      });
    }
  }, [open, student]);

  const handleChange =
    (field: keyof EditableFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim() || !form.phone.trim() || !form.nik.trim()) {
      toast({
        title: 'Data belum lengkap',
        description: 'Email, nomor HP, dan NIK wajib diisi.',
        variant: 'destructive',
      });
      return;
    }

    onSaved(form);
    toast({
      title: 'Biodata & Data Keluarga berhasil diperbarui',
      description: 'Perubahan data pribadi Anda telah disimpan.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto text-left">
        <DialogHeader>
          <DialogTitle>Edit Biodata & Data Keluarga</DialogTitle>
          <DialogDescription>
            Lengkapi data pribadi, tempat tanggal lahir, NIK, serta data orang tua/wali siswa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Section 1: Identitas Sekolah (Read-only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border">
            <div>
              <label className={labelClass}>Nama Lengkap (Siswa)</label>
              <Input value={student.name} disabled className="bg-background" />
            </div>
            <div>
              <label className={labelClass}>NISN</label>
              <Input value={student.nisn} disabled className="bg-background" />
            </div>
          </div>

          {/* Section 2: Data Pribadi Siswa */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Data Pribadi Siswa</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="edit-nik">NIK (Nomor KTP)</label>
                <Input
                  id="edit-nik"
                  value={form.nik}
                  onChange={handleChange('nik')}
                  placeholder="32730xxxxxxxxx"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-gender">Jenis Kelamin</label>
                <select
                  id="edit-gender"
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-birth-place">Tempat Lahir</label>
                <Input
                  id="edit-birth-place"
                  value={form.birthPlace}
                  onChange={handleChange('birthPlace')}
                  placeholder="Kota Kelahiran"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-birth-date">Tanggal Lahir</label>
                <Input
                  id="edit-birth-date"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange('birthDate')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-religion">Agama</label>
                <select
                  id="edit-religion"
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
                <label className={labelClass} htmlFor="edit-phone">Nomor HP / WhatsApp</label>
                <Input
                  id="edit-phone"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="0812-xxxx-xxxx"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-email">Email Siswa</label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="email@sekolah.sch.id"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-address">Alamat Domisili Lengkap</label>
              <textarea
                id="edit-address"
                value={form.address}
                onChange={handleChange('address')}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Alamat lengkap RT/RW, Kelurahan, Kecamatan"
              />
            </div>
          </div>

          {/* Section 3: Data Orang Tua / Wali */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. Data Orang Tua & Wali</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="edit-father-name">Nama Ayah</label>
                <Input
                  id="edit-father-name"
                  value={form.fatherName}
                  onChange={handleChange('fatherName')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-father-occ">Pekerjaan Ayah</label>
                <Input
                  id="edit-father-occ"
                  value={form.fatherOccupation}
                  onChange={handleChange('fatherOccupation')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-mother-name">Nama Ibu</label>
                <Input
                  id="edit-mother-name"
                  value={form.motherName}
                  onChange={handleChange('motherName')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-mother-occ">Pekerjaan Ibu</label>
                <Input
                  id="edit-mother-occ"
                  value={form.motherOccupation}
                  onChange={handleChange('motherOccupation')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guardian-name">Nama Wali / Kontak Darurat</label>
                <Input
                  id="edit-guardian-name"
                  value={form.guardianName}
                  onChange={handleChange('guardianName')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-guardian-phone">Nomor HP Orang Tua / Wali</label>
                <Input
                  id="edit-guardian-phone"
                  value={form.guardianPhone}
                  onChange={handleChange('guardianPhone')}
                  placeholder="0813-xxxx-xxxx"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
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
