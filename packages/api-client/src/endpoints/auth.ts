import { apiClient } from '../client';
import { API_ROUTES } from '@portal-sekolah/constants';
import { ApiResponse, Session, LoginPayload, User } from '@portal-sekolah/types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<Session>> => {
    return apiClient.post<ApiResponse<Session>>(API_ROUTES.AUTH.LOGIN, payload);
  },
  
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(API_ROUTES.AUTH.LOGOUT);
  },
  
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<ApiResponse<User>>(API_ROUTES.AUTH.ME);
  },
  
  refreshToken: async (): Promise<ApiResponse<Session>> => {
    return apiClient.post<ApiResponse<Session>>(API_ROUTES.AUTH.REFRESH);
  },
};
