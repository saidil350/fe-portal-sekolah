export interface Tenant {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantConfig {
  themeMode: 'light' | 'dark' | 'system';
  primaryColor: string;
  academicYearStart: string;
  academicYearEnd: string;
}
