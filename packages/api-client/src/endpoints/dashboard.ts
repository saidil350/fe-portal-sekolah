import { apiClient } from '../client';
import { API_ROUTES } from '@portal-sekolah/constants';
import { ApiResponse } from '@portal-sekolah/types';

export const dashboardApi = {
  getStats: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<unknown>> => {
    return apiClient.get<ApiResponse<unknown>>(API_ROUTES.DASHBOARD.STATS, { params });
  },
  
  getSummary: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<unknown>> => {
    return apiClient.get<ApiResponse<unknown>>(API_ROUTES.DASHBOARD.SUMMARY, { params });
  },
};
