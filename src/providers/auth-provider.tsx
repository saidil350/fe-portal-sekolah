'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../stores/auth-store';
import { authApi } from '@/lib/api-client/endpoints/auth';
import { setAuthToken, setTenantId } from '@/lib/api-client';
import { register401Listener } from '@/lib/api-client/interceptors';
import { ROLE_DASHBOARD_PATH } from '@/lib/role-dashboard-path';

function clearCookies() {
  document.cookie = 'portal_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
  document.cookie = 'portal_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
  document.cookie = 'portal_user_tenant=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Register 401 interceptor — auto-clear auth on unauthorized response
  React.useEffect(() => {
    register401Listener(() => {
      clearAuth();
      clearCookies();
      router.push('/login');
    });
  }, [clearAuth, router]);

  // Validate session on mount — call getMe() to verify token with backend
  React.useEffect(() => {
    const validateSession = async () => {
      const { isAuthenticated, session, user, clearAuth } = useAuthStore.getState();

      if (isAuthenticated && session?.token) {
        try {
          const response = await authApi.getMe();

          if (response.success && response.data) {
            // Token valid — restore Axios headers
            setAuthToken(session.token);
            setTenantId(user?.tenantId || null);

            // If on login page with valid session, redirect to dashboard
            if (pathname === '/login') {
              router.replace(ROLE_DASHBOARD_PATH[response.data.role]);
            }
          } else {
            // Backend rejected token — clear everything
            clearAuth();
            clearCookies();
          }
        } catch {
          // Network error or 401 — clear auth state
          clearAuth();
          clearCookies();
        }
      } else if (!isAuthenticated) {
        // No auth state — clear stale cookies if any
        clearCookies();
      }
    };

    validateSession();
  }, [pathname, router]);

  // Always render children — don't block the UI during auth validation
  return <>{children}</>;
}
