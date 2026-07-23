import React, { useEffect, useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui';

interface TariffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariff?: any;
  onSave: (data: any) => void;
  saving: boolean;
}

export function TariffDialog({ open, onOpenChange, tariff, onSave, saving }: TariffDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    academicYear: '2026/2027',
    grade: 'ALL',
    class: 'ALL',
    studentId: '',
    isActive: true,
  });

  const [type, setType] = useState('umum'); // umum, jenjang, kelas, siswa

  useEffect(() => {
    if (tariff && open) {
      setFormData({
        name: tariff.name || '',
        amount: tariff.amount ? tariff.amount.toString() : '',
        academicYear: tariff.academicYear || '2026/2027',
        grade: tariff.grade || 'ALL',
        class: tariff.class || 'ALL',
        studentId: tariff.studentId || '',
        isActive: tariff.isActive !== false,
      });

      if (tariff.studentId) setType('siswa');
      else if (tariff.class && tariff.class !== 'ALL') setType('kelas');
      else if (tariff.grade && tariff.grade !== 'ALL') setType('jenjang');
      else setType('umum');
    } else if (open) {
      setFormData({
        name: '',
        amount: '',
        academicYear: '2026/2027',
        grade: 'ALL',
        class: 'ALL',
        studentId: '',
        isActive: true,
      });
      setType('umum');
    }
  }, [tariff, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: any = {
      name: formData.name,
      amount: parseInt(formData.amount, 10),
      academicYear: formData.academicYear,
      isActive: formData.isActive,
    };

    if (type === 'jenjang') {
      submitData.grade = formData.grade;
      submitData.class = 'ALL';
    } else if (type === 'kelas') {
      submitData.grade = formData.grade;
      submitData.class = formData.class;
    } else if (type === 'siswa') {
      submitData.studentId = formData.studentId;
    } else {
      submitData.grade = 'ALL';
      submitData.class = 'ALL';
    }

    onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tariff ? 'Edit Tarif SPP' : 'Tambah Tarif SPP'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Tarif</label>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Contoh: SPP Reguler Kelas X" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nominal (Rp)</label>
            <Input 
              name="amount" 
              type="number" 
              min="1000"
              value={formData.amount} 
              onChange={handleChange} 
              placeholder="Contoh: 500000" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tahun Ajaran</label>
            <Input 
              name="academicYear" 
              value={formData.academicYear} 
              onChange={handleChange} 
              placeholder="Contoh: 2026/2027" 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipe Tarif</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="umum">Umum (Semua Siswa)</option>
              <option value="jenjang">Spesifik Jenjang</option>
              <option value="kelas">Spesifik Kelas</option>
              <option value="siswa">Spesifik Siswa</option>
            </select>
          </div>

          {(type === 'jenjang' || type === 'kelas') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenjang</label>
              <Input 
                name="grade" 
                value={formData.grade} 
                onChange={handleChange} 
                placeholder="Contoh: X, XI, XII" 
                required 
              />
            </div>
          )}

          {type === 'kelas' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Kelas</label>
              <Input 
                name="class" 
                value={formData.class} 
                onChange={handleChange} 
                placeholder="Contoh: IPA 1" 
                required 
              />
            </div>
          )}

          {type === 'siswa' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">ID Siswa</label>
              <Input 
                name="studentId" 
                value={formData.studentId} 
                onChange={handleChange} 
                placeholder="Masukkan ID/UUID Siswa" 
                required 
              />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="isActive" 
              name="isActive"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive" className="text-sm font-medium">Status Aktif</label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
