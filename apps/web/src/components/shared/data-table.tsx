'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Input,
  Button,
} from '@portal-sekolah/ui';

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = 'Cari...',
  searchKey,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Filter Data
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  }, [data, searchQuery, searchKey]);

  // Paginated Data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {searchKey && (
        <div className="relative w-full max-w-sm flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 rounded-xl"
          />
        </div>
      )}

      {/* Table Element */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <div className="h-4 bg-muted animate-pulse rounded w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground font-medium">
                  Tidak ada data yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              paginatedData.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx}>
                      {col.render
                        ? col.render(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '')
                        : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs text-muted-foreground font-medium">
            Halaman {currentPage} dari {totalPages} ({filteredData.length} data)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg text-xs"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg text-xs"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
