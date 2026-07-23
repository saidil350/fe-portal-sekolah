import { Role } from './roles';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId?: string; // Nullable hanya untuk ADMIN_IT (sebelumnya SUPER_ADMIN)
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  token: string;
  expiresAt: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password?: string;
  tenantDomain?: string; // Optional domain pencarian sekolah
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
