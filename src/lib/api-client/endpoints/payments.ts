import { apiClient } from '../client';
import { API_ROUTES } from '@/lib/constants';
import { ApiResponse, PaginatedResponse, Invoice, Payment, QrisData } from '@/types';

export const paymentsApi = {
  getInvoices: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<Invoice>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<Invoice>>>(API_ROUTES.PAYMENTS.INVOICES, { params });
  },
  
  getInvoiceById: async (id: string): Promise<ApiResponse<Invoice>> => {
    return apiClient.get<ApiResponse<Invoice>>(API_ROUTES.PAYMENTS.INVOICE_DETAIL(id));
  },
  
  payInvoice: async (id: string, paymentMethod: 'QRIS' | 'BANK_TRANSFER'): Promise<ApiResponse<Payment>> => {
    return apiClient.post<ApiResponse<Payment>>(API_ROUTES.PAYMENTS.PAY(id), { paymentMethod });
  },
  
  generateQris: async (id: string): Promise<ApiResponse<QrisData>> => {
    return apiClient.get<ApiResponse<QrisData>>(API_ROUTES.PAYMENTS.QRIS(id));
  },
  
  getPaymentHistory: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<Payment>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<Payment>>>(API_ROUTES.PAYMENTS.HISTORY, { params });
  },
  
  // Tariffs
  getTariffs: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<any>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<any>>>('/admin/payments/tariffs', { params });
  },
  createTariff: async (data: any): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>('/admin/payments/tariffs', data);
  },
  updateTariff: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return apiClient.put<ApiResponse<any>>(`/admin/payments/tariffs/${id}`, data);
  },
  deleteTariff: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(`/admin/payments/tariffs/${id}`);
  },
  bulkActionTariffs: async (data: { ids: string[], action: string }): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>('/admin/payments/tariffs/bulk', data);
  },
};
