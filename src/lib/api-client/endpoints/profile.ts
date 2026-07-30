import { apiClient } from '../client';
import { API_ROUTES } from '@/lib/constants';
import { ApiResponse } from '@/types';

export interface StudentProfileDetail {
  id: string;
  tenantId: string;
  userId: string;
  classId?: string;
  nis: string;
  nisn?: string;
  gender: string;
  birthPlace?: string;
  birthDate?: string;
  nik?: string;
  religion?: string;
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface TeacherProfileDetail {
  id: string;
  tenantId: string;
  userId: string;
  nip?: string;
  gender: string;
  subjectArea?: string[];
  isHomeroom: boolean;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string | null;
  avatarUrl: string | null;
  phone?: string | null;
  address?: string | null;
  isActive: boolean;
  studentProfile?: StudentProfileDetail | null;
  teacherProfile?: TeacherProfileDetail | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  image?: string | null;
  phone?: string;
  address?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  nik?: string;
  religion?: string;
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export const profileApi = {
  getProfile: async (): Promise<ApiResponse<UserProfileResponse>> => {
    return apiClient.get<ApiResponse<UserProfileResponse>>(API_ROUTES.PROFILE);
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<ApiResponse<UserProfileResponse>> => {
    return apiClient.patch<ApiResponse<UserProfileResponse>>(API_ROUTES.PROFILE, data);
  },
};
