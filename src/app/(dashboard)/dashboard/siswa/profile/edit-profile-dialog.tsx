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
  nisn: string;
  nis: string;
  email: string;
  phone: string;
  currentClass: string;
  address: string;
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
  'email' | 'phone' | 'address' | 'guardianName' | 'guardianPhone'
>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileData;
  onSaved: (data: EditableFields) => void;
}

const labelClass = 'text-xs text-muted-foreground block mb-1.5';

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
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
      });
    }
  }, [open, student]);

  const handleChange =
    (field: keyof EditableFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      title: 'Profil berhasil diperbarui',
      description: 'Perubahan data pribadi telah disimpan.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] text-left">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
          <DialogDescription>
            Perbarui data kontak dan data wali. Data identitas sekolah (NISN,
            NIS, kelas) tidak dapat diubah.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Identitas (read-only) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <Input value={student.name} disabled />
            </div>
            <div>
              <label className={labelClass}>NISN</label>
              <Input value={student.nisn} disabled />
            </div>
          </div>

          {/* Field editable */}
          <div>
            <label className={labelClass} htmlFor="edit-email">
              Email
            </label>
            <Input
              id="edit-email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="email@sekolah.sch.id"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-phone">
              Nomor HP / WhatsApp
            </label>
            <Input
              id="edit-phone"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="0812-xxxx-xxxx"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="edit-address">
              Alamat Tinggal
            </label>
            <textarea
              id="edit-address"
              value={form.address}
              onChange={handleChange('address')}
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Alamat lengkap"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="edit-guardian-name">
                Nama Wali
              </label>
              <Input
                id="edit-guardian-name"
                value={form.guardianName}
                onChange={handleChange('guardianName')}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="edit-guardian-phone">
                Kontak Wali
              </label>
              <Input
                id="edit-guardian-phone"
                value={form.guardianPhone}
                onChange={handleChange('guardianPhone')}
                placeholder="0813-xxxx-xxxx"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
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
