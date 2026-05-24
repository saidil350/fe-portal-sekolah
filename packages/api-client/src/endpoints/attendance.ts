import { apiClient } from '../client';
import { API_ROUTES } from '@portal-sekolah/constants';
import { ApiResponse, PaginatedResponse, AttendanceRecord, CheckInPayload } from '@portal-sekolah/types';

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
  
  getReports: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<unknown>> => {
    return apiClient.get<ApiResponse<unknown>>(API_ROUTES.ATTENDANCE.REPORTS, { params });
  },
};
