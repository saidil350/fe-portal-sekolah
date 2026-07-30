import { Session } from '@/types';

// Helper ringan untuk memeriksa sesi statis di sisi klien/server (jika cookie di-parsing manual)
export function isAuthenticated(session: Session | null): boolean {
  if (!session) return false;
  
  // Periksa apakah token kadaluarsa
  const expiry = new Date(session.expiresAt).getTime();
  const now = new Date().getTime();
  
  return expiry > now;
}

export function isSessionExpired(session: Session | null): boolean {
  return !isAuthenticated(session);
}

export function extractTenantFromDomain(hostname: string): string | null {
  // Abaikan localhost, domain Vercel, Render, dan domain utama portal
  if (
    hostname.includes('localhost') ||
    hostname.endsWith('.vercel.app') ||
    hostname.endsWith('.onrender.com') ||
    hostname === 'portalsekolah.id' ||
    hostname.endsWith('.portalsekolah.id') && hostname.split('.').length === 2
  ) {
    return null;
  }

  // Misal: sman1jkt.portalsekolah.id -> sman1jkt
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
}
