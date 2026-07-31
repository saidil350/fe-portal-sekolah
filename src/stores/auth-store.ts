import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User, Session } from '@/types';
import { setAuthToken, setTenantId } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, session: Session) => void;
  updateUser: (partialUser: Partial<User>) => void;
  setTenant: (tenantId: string | null) => void;
  clearAuth: () => void;
}

export function clearAuthCookies() {
  document.cookie = 'portal_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
  document.cookie = 'portal_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
  document.cookie = 'portal_user_tenant=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      tenantId: null,
      isAuthenticated: false,

      setAuth: (user, session) => {
        setAuthToken(session.token);
        setTenantId(user.tenantId || null);
        set({
          user,
          session,
          isAuthenticated: true,
          tenantId: user.tenantId || null,
        });
      },

      updateUser: (partialUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        }));
      },

      setTenant: (tenantId) => {
        setTenantId(tenantId);
        set({ tenantId });
      },

      clearAuth: () => {
        setAuthToken(null);
        setTenantId(null);
        clearAuthCookies();
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          tenantId: null,
        });
      },
    }),
    {
      name: 'portal-sekolah-auth-store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : ({} as Storage))),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        tenantId: state.tenantId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
