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
      window.location.replace('/login');
    });
  }, [clearAuth]);

  // Handle browser Back/Forward Cache (bfcache) restoration on back button click
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      const { isAuthenticated } = useAuthStore.getState();
      if ((event.persisted || !isAuthenticated) && pathname.startsWith('/dashboard')) {
        clearCookies();
        window.location.replace('/login');
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [pathname]);

  // Validate session on mount — call getMe() to verify token with backend
  React.useEffect(() => {
    const validateSession = async () => {
      const { isAuthenticated, session, user, clearAuth } = useAuthStore.getState();

      if (isAuthenticated && session?.token) {
        try {
          // Restore token and tenant BEFORE making API requests so interceptors work
          setAuthToken(session.token);
          setTenantId(user?.tenantId || null);

          const response = await authApi.getMe();

          if (response.success && response.data) {
            // If on login page with valid session, redirect to dashboard
            if (pathname === '/login') {
              router.replace(ROLE_DASHBOARD_PATH[response.data.role]);
            }
          } else {
            // Backend rejected token — clear everything and redirect if on protected route
            clearAuth();
            clearCookies();
            if (pathname.startsWith('/dashboard')) {
              window.location.replace('/login');
            }
          }
        } catch {
          // Network error or 401 — clear auth state and redirect if on protected route
          clearAuth();
          clearCookies();
          if (pathname.startsWith('/dashboard')) {
            window.location.replace('/login');
          }
        }
      } else if (!isAuthenticated) {
        // No auth state — clear stale cookies & redirect if accessing protected dashboard routes
        clearCookies();
        if (pathname.startsWith('/dashboard')) {
          window.location.replace('/login');
        }
      }
    };

    validateSession();
  }, [pathname, router]);

  // Always render children — don't block the UI during auth validation
  return <>{children}</>;
}
