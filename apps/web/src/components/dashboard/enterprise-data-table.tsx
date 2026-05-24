'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpDown, Eye, Search } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@portal-sekolah/ui';
import { DashboardEntity, useDashboardStore } from '@/stores/dashboard-store';
import { DashboardEmptyState } from './dashboard-empty-state';

export type DashboardTableColumn<T extends DashboardEntity> = ColumnDef<T> & {
  detailHref?: (row: T) => string;
  preview?: (row: T) => DashboardEntity;
};

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (context: { row: { original: T } }) => React.ReactNode;
}

export function EnterpriseDataTable<T extends DashboardEntity>({
  title,
  data,
  columns,
  searchPlaceholder = 'Cari data...',
}: {
  title: string;
  data: T[];
  columns: DashboardTableColumn<T>[];
  searchPlaceholder?: string;
}) {
  const [sorting, setSorting] = React.useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pageIndex, setPageIndex] = React.useState(0);
  const setSelectedEntity = useDashboardStore((state) => state.setSelectedEntity);
  const pageSize = 6;

  const filteredData = React.useMemo(() => {
    const query = globalFilter.trim().toLowerCase();
    if (!query) return data;
    return data.filter((item) =>
      Object.values(item).some((value) => String(value ?? '').toLowerCase().includes(query))
    );
  }, [data, globalFilter]);

  const sortedData = React.useMemo(() => {
    if (!sorting.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = String(a[sorting.key!] ?? '');
      const bValue = String(b[sorting.key!] ?? '');
      return sorting.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [filteredData, sorting]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const pageRows = sortedData.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  React.useEffect(() => {
    setPageIndex(0);
  }, [globalFilter]);

  return (
    <Card className="border-border/70">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-left">
            <h3 className="text-base font-bold">{title}</h3>
            <p className="text-xs text-muted-foreground">
              Klik baris untuk membuka detail, atau gunakan preview cepat.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        </div>

        {data.length === 0 ? (
          <DashboardEmptyState />
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={`${String(column.accessorKey)}-${index}`} className="h-10">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"
                        onClick={() => {
                          if (!column.accessorKey) return;
                          setSorting((current) => ({
                            key: column.accessorKey ?? null,
                            direction:
                              current.key === column.accessorKey && current.direction === 'asc' ? 'desc' : 'asc',
                          }));
                        }}
                      >
                        {column.header}
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                  ))}
                  <TableHead className="w-28">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1}>
                      <DashboardEmptyState title="Tidak ada hasil" />
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((row) => (
                    <TableRow key={row.id} className="group cursor-pointer">
                      {columns.map((column, index) => (
                        <TableCell key={`${row.id}-${String(column.accessorKey)}-${index}`} className="py-3">
                          <Link href={row.href} className="block">
                            {column.cell ? column.cell({ row: { original: row } }) : String(row[column.accessorKey ?? 'title'] ?? '')}
                          </Link>
                        </TableCell>
                      ))}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          {row.status && <Badge variant="secondary">{row.status}</Badge>}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setSelectedEntity(row);
                            }}
                            aria-label={`Preview ${row.title}`}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            Halaman {pageIndex + 1} dari {pageCount}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPageIndex((page) => Math.max(0, page - 1))} disabled={pageIndex === 0}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPageIndex((page) => Math.min(pageCount - 1, page + 1))} disabled={pageIndex >= pageCount - 1}>
              Selanjutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
