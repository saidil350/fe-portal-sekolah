import { apiClient } from '../client';
import { API_ROUTES } from '@/lib/constants';
import { ApiResponse, PaginatedResponse, AcademicClass, User } from '@/types';

export const classesApi = {
  getClasses: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<AcademicClass>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<AcademicClass>>>(API_ROUTES.CLASSES.BASE, { params });
  },
  
  getClassById: async (id: string): Promise<ApiResponse<AcademicClass>> => {
    return apiClient.get<ApiResponse<AcademicClass>>(API_ROUTES.CLASSES.DETAIL(id));
  },
  
  createClass: async (data: Partial<AcademicClass>): Promise<ApiResponse<AcademicClass>> => {
    return apiClient.post<ApiResponse<AcademicClass>>(API_ROUTES.CLASSES.BASE, data);
  },
  
  updateClass: async (id: string, data: Partial<AcademicClass>): Promise<ApiResponse<AcademicClass>> => {
    return apiClient.patch<ApiResponse<AcademicClass>>(API_ROUTES.CLASSES.DETAIL(id), data);
  },
  
  deleteClass: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ROUTES.CLASSES.DETAIL(id));
  },
  
  assignStudents: async (classId: string, studentIds: string[]): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(API_ROUTES.CLASSES.STUDENTS(classId), { studentIds });
  },
  
  getStudents: async (classId: string): Promise<ApiResponse<User[]>> => {
    return apiClient.get<ApiResponse<User[]>>(API_ROUTES.CLASSES.STUDENTS(classId));
  },
};
