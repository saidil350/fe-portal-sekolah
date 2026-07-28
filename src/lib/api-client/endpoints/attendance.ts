import { apiClient } from '../client';
import { API_ROUTES } from '@/lib/constants';
import { ApiResponse, PaginatedResponse, AttendanceRecord, CheckInPayload } from '@/types';

export const attendanceApi = {
  checkIn: async (payload: CheckInPayload): Promise<ApiResponse<AttendanceRecord>> => {
    return apiClient.post<ApiResponse<AttendanceRecord>>(API_ROUTES.ATTENDANCE.CHECK_IN, payload);
  },
  
  checkOut: async (payload: CheckInPayload = {}): Promise<ApiResponse<AttendanceRecord>> => {
    return apiClient.post<ApiResponse<AttendanceRecord>>(API_ROUTES.ATTENDANCE.CHECK_OUT, payload);
  },
  
  getHistory: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<AttendanceRecord>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<AttendanceRecord>>>(API_ROUTES.ATTENDANCE.HISTORY, { params });
  },
};
