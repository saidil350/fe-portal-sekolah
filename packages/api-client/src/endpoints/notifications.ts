import { apiClient } from '../client';
import { API_ROUTES } from '@portal-sekolah/constants';
import { ApiResponse, PaginatedResponse, Notification } from '@portal-sekolah/types';

export const notificationsApi = {
  getNotifications: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<Notification>>>(API_ROUTES.NOTIFICATIONS.BASE, { params });
  },
  
  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    return apiClient.post<ApiResponse<Notification>>(API_ROUTES.NOTIFICATIONS.MARK_READ(id));
  },
  
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
  },
  
  broadcast: async (data: Partial<Notification>): Promise<ApiResponse<Notification>> => {
    return apiClient.post<ApiResponse<Notification>>(API_ROUTES.NOTIFICATIONS.BROADCAST, data);
  },
};
