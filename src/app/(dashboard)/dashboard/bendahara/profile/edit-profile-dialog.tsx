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

export interface BendaharaProfileData {
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
  academicYear: string;
}

export type EditableBendaharaFields = Pick<
  BendaharaProfileData,
  | 'email'
  | 'phone'
  | 'address'
  | 'nik'
  | 'birthPlace'
  | 'birthDate'
  | 'gender'
  | 'religion'
  | 'education'
>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bendahara: BendaharaProfileData;
  onSaved: (data: EditableBendaharaFields) => void;
}

const labelClass = 'text-xs text-muted-foreground block mb-1.5 font-medium';

export function EditBendaharaProfileDialog({
  open,
  onOpenChange,
  bendahara,
  onSaved,
}: EditProfileDialogProps) {
  const [form, setForm] = React.useState<EditableBendaharaFields>({
    email: bendahara.email,
    phone: bendahara.phone,
    address: bendahara.address,
    nik: bendahara.nik,
    birthPlace: bendahara.birthPlace,
    birthDate: bendahara.birthDate,
    gender: bendahara.gender,
    religion: bendahara.religion,
    education: bendahara.education,
  });

  React.useEffect(() => {
    if (open) {
      setForm({
        email: bendahara.email,
        phone: bendahara.phone,
        address: bendahara.address,
        nik: bendahara.nik,
        birthPlace: bendahara.birthPlace,
        birthDate: bendahara.birthDate,
        gender: bendahara.gender,
        religion: bendahara.religion,
        education: bendahara.education,
      });
    }
  }, [open, bendahara]);

  const handleChange =
    (field: keyof EditableBendaharaFields) =>
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
      title: 'Biodata Berhasil Diperbarui',
      description: 'Perubahan data pribadi dan kepegawaian Anda telah disimpan.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto text-left">
        <DialogHeader>
          <DialogTitle>Edit Biodata & Kepegawaian Bendahara</DialogTitle>
          <DialogDescription>
            Lengkapi data pribadi, tempat tanggal lahir, NIK, serta kontak resmi Bendahara Sekolah. Data identitas utama (NIP & Nama) dikelola oleh Admin IT.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Section 1: Identitas Kepegawaian (Read-only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border">
            <div>
              <label className={labelClass}>Nama Lengkap (Bendahara)</label>
              <Input value={bendahara.name} disabled className="bg-background" />
            </div>
            <div>
              <label className={labelClass}>NIP / ID Pegawai</label>
              <Input value={bendahara.nip} disabled className="bg-background" />
            </div>
          </div>

          {/* Section 2: Data Pribadi Bendahara */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. Data Pribadi & Kontak</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="edit-bendahara-nik">NIK (Nomor KTP)</label>
                <Input
                  id="edit-bendahara-nik"
                  value={form.nik}
                  onChange={handleChange('nik')}
                  placeholder="32730xxxxxxxxx"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-bendahara-gender">Jenis Kelamin</label>
                <select
                  id="edit-bendahara-gender"
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-bendahara-birth-place">Tempat Lahir</label>
                <Input
                  id="edit-bendahara-birth-place"
                  value={form.birthPlace}
                  onChange={handleChange('birthPlace')}
                  placeholder="Kota Kelahiran"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-bendahara-birth-date">Tanggal Lahir</label>
                <Input
                  id="edit-bendahara-birth-date"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange('birthDate')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-bendahara-religion">Agama</label>
                <select
                  id="edit-bendahara-religion"
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
                <label className={labelClass} htmlFor="edit-bendahara-phone">Nomor HP / WhatsApp</label>
                <Input
                  id="edit-bendahara-phone"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="0812-xxxx-xxxx"
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-bendahara-email">Email Resmi</label>
              <Input
                id="edit-bendahara-email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="bendahara@sekolah.sch.id"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="edit-bendahara-address">Alamat Tinggal</label>
              <textarea
                id="edit-bendahara-address"
                value={form.address}
                onChange={handleChange('address')}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Alamat domisili lengkap"
              />
            </div>
          </div>

          {/* Section 3: Data Pendidikan & Kualifikasi */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. Kualifikasi Pendidikan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="edit-bendahara-education">Pendidikan Terakhir</label>
                <select
                  id="edit-bendahara-education"
                  value={form.education}
                  onChange={handleChange('education')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="S1 - Akuntansi / Keuangan">S1 - Akuntansi / Keuangan</option>
                  <option value="S1 - Manajemen">S1 - Manajemen</option>
                  <option value="S1 - Non Keuangan">S1 - Non Keuangan</option>
                  <option value="S2 - Magister Akuntansi / Manajemen">S2 - Magister Akuntansi / Manajemen</option>
                  <option value="D3 - Akuntansi / Keuangan">D3 - Akuntansi / Keuangan</option>
                  <option value="SMA / SMK Sederajat">SMA / SMK Sederajat</option>
                </select>
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
