"use client";

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { Plus, Search, Trash2, PowerOff, Power } from 'lucide-react';
import { TariffsTable } from '../../../admin/payments/tariffs/components/tariffs-table';
import { TariffDialog } from '../../../admin/payments/tariffs/components/tariff-dialog';
import { apiClient } from '@/lib/api-client';

export default function BendaharaTariffsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchTariffs = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };
      if (search) params.search = search;
      if (filterActive !== 'all') params.isActive = filterActive;
      
      const res = await apiClient.get<any>('/admin/payments/tariffs', { params });
      if (res.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tariffs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, [search, filterActive]);

  const handleCreate = () => {
    setEditingTariff(null);
    setDialogOpen(true);
  };

  const handleEdit = (tariff: any) => {
    setEditingTariff(tariff);
    setDialogOpen(true);
  };

  const handleSave = async (formData: any) => {
    setSaving(true);
    try {
      if (editingTariff) {
        await apiClient.put(`/admin/payments/tariffs/${editingTariff.id}`, formData);
      } else {
        await apiClient.post('/admin/payments/tariffs', formData);
      }
      setDialogOpen(false);
      fetchTariffs();
    } catch (err) {
      console.error('Failed to save tariff:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tarif ini?')) return;
    try {
      await apiClient.delete(`/admin/payments/tariffs/${id}`);
      fetchTariffs();
      setSelectedIds(prev => prev.filter(selId => selId !== id));
    } catch (err) {
      console.error('Failed to delete tariff:', err);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedIds.length) return;
    const confirmMsg = action === 'DELETE' ? 'menghapus' : action === 'ACTIVATE' ? 'mengaktifkan' : 'menonaktifkan';
    if (!confirm(`Apakah Anda yakin ingin ${confirmMsg} ${selectedIds.length} tarif?`)) return;
    
    try {
      await apiClient.post('/admin/payments/tariffs/bulk', { ids: selectedIds, action });
      setSelectedIds([]);
      fetchTariffs();
    } catch (err) {
      console.error(`Failed to bulk ${action} tariffs:`, err);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) setSelectedIds([]);
    else setSelectedIds(data.map(item => item.id));
  };

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen & Posting Tarif SPP</h2>
          <p className="text-muted-foreground mt-1">
            Atur dan tetapkan nominal harga pembayaran SPP bulanan berdasarkan tingkat jenjang, kelas, atau khusus siswa.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tarif SPP Baru
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama tarif..." 
              className="pl-8" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">{selectedIds.length} terpilih</span>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('ACTIVATE')}>
              <Power className="mr-2 h-4 w-4 text-green-600" />
              Aktifkan
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('DEACTIVATE')}>
              <PowerOff className="mr-2 h-4 w-4 text-gray-600" />
              Nonaktifkan
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction('DELETE')}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        )}
      </div>

      <TariffsTable 
        data={data} 
        loading={loading}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TariffDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tariff={editingTariff}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
