import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';

export function useTenant() {
  const { tenantId, user, setTenant } = useAuthStore();
  const [tenantName, setTenantName] = useState('Portal Sekolah');

  useEffect(() => {
    const updateName = () => {
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('portal_school_name');
        if (storedName) {
          setTenantName(storedName);
        }
      }
    };
    
    updateName();

    window.addEventListener('storage', updateName);
    window.addEventListener('schoolNameChanged', updateName);
    
    return () => {
      window.removeEventListener('storage', updateName);
      window.removeEventListener('schoolNameChanged', updateName);
    };
  }, []);

  return {
    tenantId,
    tenantName,
    isSuperAdmin: false,
    setTenant,
  };
}
