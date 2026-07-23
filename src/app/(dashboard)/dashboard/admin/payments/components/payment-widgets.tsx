import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Skeleton, Avatar, AvatarFallback, Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { Receipt, Search, ChevronLeft, ChevronRight, Filter, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export interface InvoiceItem {
  id?: string;
  invoiceNumber?: string;
  studentName?: string;
  month?: number;
  year?: number;
  amount?: number;
  status?: string;
  dueDate?: string;
  createdAt?: string;
}

export function PaymentWidgets() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [totalInvoices, setTotalInvoices] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'FAILED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = async (invoiceId: string) => {
    try {
      setSyncingId(invoiceId);
      const res = await apiClient.post<any>(`/admin/payments/invoices/${invoiceId}/sync`);
      if (res.success) {
        // Update status invoice lokal
        const updatedStatus = res.data.invoiceStatus || res.data.status;
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoiceId ? { ...inv, status: updatedStatus } : inv
          )
        );
      } else {
        alert(res.error?.message || 'Gagal sinkronisasi.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setSyncingId(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', itemsPerPage.toString());
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (statusFilter !== 'ALL') params.set('status', statusFilter);
        
        const result = await apiClient.get<any>(`/admin/payments/invoices?${params.toString()}`);
        if (result.success && result.data) {
          if (Array.isArray(result.data)) {
            // Backward compatibility
            setInvoices(result.data);
            setTotalInvoices(result.data.length);
          } else {
            // New paginated response
            setInvoices(result.data.items || []);
            setTotalInvoices(result.data.pagination?.total || 0);
          }
        } else {
          setInvoices([]);
          setTotalInvoices(0);
        }
      } catch (error) {
        console.warn('Failed to fetch invoices', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, itemsPerPage, debouncedSearch, statusFilter]);

  const paginatedInvoices = invoices;
  const totalPages = Math.ceil(totalInvoices / itemsPerPage) || 1;

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Lunas</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pending</Badge>;
      case 'FAILED':
      case 'EXPIRED':
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Gagal</Badge>;
      default:
        return <Badge variant="outline">{status || 'Draft'}</Badge>;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: 'ALL' | 'PAID' | 'PENDING' | 'FAILED') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {/* Invoice Terbaru */}
      <Card>
        <CardHeader className="space-y-4 sm:space-y-0 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Invoice Terbaru</CardTitle>
              <Badge variant="outline" className="font-normal text-xs">
                Total: {totalInvoices} Invoice
              </Badge>
            </div>
            
            {/* Direct Link to full invoice / history page if needed */}
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <a href="/dashboard/admin/payments/history">Lihat Semua Riwayat &rarr;</a>
            </Button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari no. invoice atau siswa..."
                className="pl-9 text-xs h-9"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
                <Filter className="h-3 w-3" /> Status:
              </span>
              {(['ALL', 'PAID', 'PENDING', 'FAILED'] as const).map((st) => (
                <Button
                  key={st}
                  variant={statusFilter === st ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-[11px] px-2.5"
                  onClick={() => handleStatusFilterChange(st)}
                >
                  {st === 'ALL' ? 'Semua' : st === 'PAID' ? 'Lunas' : st === 'PENDING' ? 'Pending' : 'Gagal'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : paginatedInvoices.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
              <Receipt className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">Tidak ada data invoice yang sesuai</p>
              <p className="text-xs opacity-75">Coba ubah kata kunci atau filter status Anda.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-xs">No. Invoice</TableHead>
                      <TableHead className="text-xs">Siswa</TableHead>
                      <TableHead className="text-xs">Periode</TableHead>
                      <TableHead className="text-xs">Nominal</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedInvoices.map((invoice: InvoiceItem, idx: number) => (
                      <TableRow key={invoice.id || idx} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-medium text-xs font-mono">{invoice.invoiceNumber || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                {invoice.studentName?.substring(0, 2).toUpperCase() || 'SI'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{invoice.studentName || 'Siswa'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {invoice.month && invoice.year ? `${invoice.month}/${invoice.year}` : '-'}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          {invoice.status !== 'PAID' && invoice.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleSync(invoice.id!)}
                              disabled={syncingId === invoice.id}
                              title="Sinkronisasi status Midtrans"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${syncingId === invoice.id ? 'animate-spin' : ''}`} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-2">
                  <span>Tampilkan:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5" className="text-xs">5 per halaman</SelectItem>
                      <SelectItem value="10" className="text-xs">10 per halaman</SelectItem>
                      <SelectItem value="20" className="text-xs">20 per halaman</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="hidden sm:inline">
                    | Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalInvoices)} - {Math.min(currentPage * itemsPerPage, totalInvoices)} dari {totalInvoices} invoice
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Button>

                  {/* Numbered Page Buttons */}
                  <div className="flex items-center gap-1 mx-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                      })
                      .map((page, index, array) => {
                        const showEllipsis = index > 0 && page - array[index - 1] > 1;
                        return (
                          <React.Fragment key={page}>
                            {showEllipsis && <span className="px-1 text-muted-foreground">...</span>}
                            <Button
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              className="h-8 w-8 p-0 text-xs"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

