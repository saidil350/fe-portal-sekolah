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
  nip: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
  teachingHistory?: Array<{
    year: string;
    period: string;
    status: string;
    isCurrent: boolean;
  }>;
}

type EditableFields = Pick<
  TeacherProfileData,
  'email' | 'phone' | 'address'
>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: TeacherProfileData;
  onSaved: (data: EditableFields) => void;
}

const labelClass = 'text-xs text-muted-foreground block mb-1.5';

export function EditTeacherProfileDialog({
  open,
  onOpenChange,
  teacher,
  onSaved,
}: EditProfileDialogProps) {
  const [form, setForm] = React.useState<EditableFields>({
    email: teacher.email,
    phone: teacher.phone,
    address: teacher.address,
  });

  // Sinkronkan form setiap kali dialog dibuka dengan data terbaru.
  React.useEffect(() => {
    if (open) {
      setForm({
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address,
      });
    }
  }, [open, teacher]);

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
      description: 'Perubahan data kontak telah disimpan.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] text-left">
        <DialogHeader>
          <DialogTitle>Edit Profil Guru</DialogTitle>
          <DialogDescription>
            Perbarui data kontak Anda. Data identitas (NIP, nama, jabatan) tidak
            dapat diubah langsung — hubungi Admin IT.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Identitas (read-only) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nama Lengkap</label>
              <Input value={teacher.name} disabled />
            </div>
            <div>
              <label className={labelClass}>NIP</label>
              <Input value={teacher.nip} disabled />
            </div>
          </div>

          {/* Field editable */}
          <div>
            <label className={labelClass} htmlFor="teacher-edit-email">
              Email
            </label>
            <Input
              id="teacher-edit-email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="email@sekolah.sch.id"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="teacher-edit-phone">
              Nomor HP / WhatsApp
            </label>
            <Input
              id="teacher-edit-phone"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="0812-xxxx-xxxx"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="teacher-edit-address">
              Alamat Tinggal
            </label>
            <textarea
              id="teacher-edit-address"
              value={form.address}
              onChange={handleChange('address')}
              rows={2}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Alamat lengkap"
            />
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
