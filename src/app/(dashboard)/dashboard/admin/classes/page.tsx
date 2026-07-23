'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/components/card';

export default function AdminClassesPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-10 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 mx-auto text-muted-foreground" />
          <h2 className="text-lg font-semibold">Fitur Tidak Tersedia</h2>
          <p className="text-sm text-muted-foreground">
            Halaman manajemen kelas telah dihapus sesuai pembaruan sistem.
            Silakan hubungi Super Admin untuk informasi lebih lanjut.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
