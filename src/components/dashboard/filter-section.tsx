'use client';

import * as React from 'react';
import { Download, Search, SlidersHorizontal } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  // Status/Kategori Filter
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  statusPlaceholder?: string;

  // Sorting
  sortBy?: string;
  onSortByChange?: (value: string) => void;
  sortOptions?: FilterOption[];
  sortPlaceholder?: string;

  // Export actions
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void;
}

export function FilterSection({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Cari data...',
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  statusPlaceholder = 'Semua Status',
  sortBy,
  onSortByChange,
  sortOptions = [],
  sortPlaceholder = 'Urutkan berdasarkan',
  onExport,
}: FilterSectionProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-left">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span>Filter & Alat Laporan</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-12">
        {/* Search Input */}
        <div className="relative xl:col-span-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 w-full"
          />
        </div>

        {/* Status/Category Filter */}
        {onStatusFilterChange && statusOptions.length > 0 && (
          <div className="xl:col-span-3">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={statusPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{statusPlaceholder}</SelectItem>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort Filter */}
        {onSortByChange && sortOptions.length > 0 && (
          <div className="xl:col-span-3">
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={sortPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Export Buttons */}
        {onExport && (
          <div className="flex w-full gap-2 sm:col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onExport('pdf')}
              className="flex-1 gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" /> PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onExport('csv')}
              className="flex-1 gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
