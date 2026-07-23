import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@/types';
import { setAuthToken, setTenantId } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  
  setAuth: (user: User, session: Session) => void;
  setTenant: (tenantId: string | null) => void;
  clearAuth: () => void;
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

      setTenant: (tenantId) => {
        setTenantId(tenantId);
        set({ tenantId });
      },

      clearAuth: () => {
        setAuthToken(null);
        setTenantId(null);
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
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        tenantId: state.tenantId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
