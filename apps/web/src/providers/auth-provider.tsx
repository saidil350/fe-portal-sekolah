'use client';

import * as React from 'react';
import { useAuthStore } from '../stores/auth-store';
import { setAuthToken, setTenantId } from '@portal-sekolah/api-client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user, clearAuth } = useAuthStore();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Sinkronisasi token otentikasi di Axios saat load pertama
    if (session && session.token) {
      const expiry = new Date(session.expiresAt).getTime();
      const now = new Date().getTime();

      if (expiry > now) {
        setAuthToken(session.token);
        setTenantId(user?.tenantId || null);
      } else {
        // Hapus otentikasi jika kadaluarsa
        clearAuth();
      }
    }
    setIsLoaded(true);
  }, [session, user, clearAuth]);

  if (!isLoaded) {
    return null; // Atau loader spinner
  }

  return <>{children}</>;
}
