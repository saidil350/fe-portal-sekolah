import { useAuthStore } from '../stores/auth-store';
import { authApi } from '@/lib/api-client';
import { LoginPayload } from '@/types';

export function useAuth() {
  const { user, session, tenantId, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    if (response.success && response.data) {
      const sess = response.data;

      // Setel cookie agar middleware Next.js dapat melacak otentikasi di Server Side
      const expiry = new Date(sess.expiresAt).toUTCString();
      document.cookie = `portal_session=${sess.token}; path=/; expires=${expiry}; SameSite=Lax`;
      document.cookie = `portal_user_role=${sess.user.role}; path=/; expires=${expiry}; SameSite=Lax`;
      if (sess.user.tenantId) {
        document.cookie = `portal_user_tenant=${sess.user.tenantId}; path=/; expires=${expiry}; SameSite=Lax`;
      }

      setAuth(sess.user, sess);
      return sess;
    }
    throw new Error(response.message || 'Login gagal');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Abaikan error jaringan saat logout
    } finally {
      // clearAuth() sekarang juga menghapus cookies secara otomatis
      clearAuth();
      window.location.href = '/login';
    }
  };

  return {
    user,
    session,
    tenantId,
    isAuthenticated,
    login,
    logout,
  };
}
