import { apiClient } from '../client';
import { API_ROUTES } from '@/lib/constants';
import { ApiResponse, PaginatedResponse, Assignment, Submission } from '@/types';

export const assignmentsApi = {
  getAssignments: async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<PaginatedResponse<Assignment>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<Assignment>>>(API_ROUTES.ASSIGNMENTS.BASE, { params });
  },
  
  getAssignmentById: async (id: string): Promise<ApiResponse<Assignment>> => {
    return apiClient.get<ApiResponse<Assignment>>(API_ROUTES.ASSIGNMENTS.DETAIL(id));
  },
  
  createAssignment: async (data: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
    return apiClient.post<ApiResponse<Assignment>>(API_ROUTES.ASSIGNMENTS.BASE, data);
  },
  
  updateAssignment: async (id: string, data: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
    return apiClient.patch<ApiResponse<Assignment>>(API_ROUTES.ASSIGNMENTS.DETAIL(id), data);
  },
  
  deleteAssignment: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(API_ROUTES.ASSIGNMENTS.DETAIL(id));
  },
  
  submitAssignment: async (assignmentId: string, data: Partial<Submission>): Promise<ApiResponse<Submission>> => {
    return apiClient.post<ApiResponse<Submission>>(API_ROUTES.ASSIGNMENTS.SUBMISSIONS(assignmentId), data);
  },
  
  getSubmissions: async (assignmentId: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<Submission[]>> => {
    return apiClient.get<ApiResponse<Submission[]>>(API_ROUTES.ASSIGNMENTS.SUBMISSIONS(assignmentId), { params });
  },
  
  gradeSubmission: async (assignmentId: string, submissionId: string, score: number, feedback?: string): Promise<ApiResponse<Submission>> => {
    return apiClient.post<ApiResponse<Submission>>(API_ROUTES.ASSIGNMENTS.GRADE(assignmentId, submissionId), { score, feedback });
  },
};
