import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, 
  Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui';
import { MoreHorizontal, Edit, Trash2, ShieldAlert } from 'lucide-react';

interface TariffsTableProps {
  data: any[];
  loading: boolean;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (tariff: any) => void;
  onDelete: (id: string) => void;
}

export function TariffsTable({ data, loading, selectedIds, onSelect, onSelectAll, onEdit, onDelete }: TariffsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Memuat data tarif...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
        <ShieldAlert className="h-8 w-8 mb-2 opacity-20" />
        <p>Belum ada data tarif SPP</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={allSelected} 
                onChange={onSelectAll} 
              />
            </TableHead>
            <TableHead>Nama Tarif</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Tahun Ajaran</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tariff) => {
            const isSelected = selectedIds.includes(tariff.id);
            let target = 'Umum';
            if (tariff.grade) target = `Jenjang ${tariff.grade}`;
            if (tariff.class) target = `Kelas ${tariff.class}`;
            if (tariff.studentId) target = 'Khusus Siswa';

            return (
              <TableRow key={tariff.id} className={isSelected ? 'bg-muted/50' : ''}>
                <TableCell>
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={isSelected} 
                    onChange={() => onSelect(tariff.id)} 
                  />
                </TableCell>
                <TableCell className="font-medium">{tariff.name}</TableCell>
                <TableCell>{formatCurrency(tariff.amount)}</TableCell>
                <TableCell>{tariff.academicYear}</TableCell>
                <TableCell>
                  <Badge variant="outline">{target}</Badge>
                </TableCell>
                <TableCell>
                  {tariff.isActive ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Aktif</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">Nonaktif</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(tariff)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => onDelete(tariff.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
