import { apiClient } from '../client';
import { API_ROUTES } from '@/lib/constants';
import { ApiResponse, PaginatedResponse, User } from '@/types';

export const usersApi = {
  getUsers: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<User>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<User>>>(API_ROUTES.USERS.BASE, { params });
  },
  
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get<ApiResponse<User>>(API_ROUTES.USERS.DETAIL(id));
  },
  
  createUser: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.post<ApiResponse<User>>(API_ROUTES.USERS.BASE, data);
  },
  
  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.patch<ApiResponse<User>>(API_ROUTES.USERS.DETAIL(id), data);
  },
  
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ROUTES.USERS.DETAIL(id));
  },
};
