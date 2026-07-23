import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';

export function useTenant() {
  const { tenantId, user, setTenant } = useAuthStore();
  const [tenantName, setTenantName] = useState('Portal Sekolah');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [semester, setSemester] = useState('Genap');

  useEffect(() => {
    const updateName = () => {
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('portal_school_name');
        if (storedName) {
          setTenantName(storedName);
        }
        const storedYear = localStorage.getItem('portal_academic_year');
        if (storedYear) {
          setAcademicYear(storedYear);
        }
        const storedSemester = localStorage.getItem('portal_semester');
        if (storedSemester) {
          setSemester(storedSemester);
        }
      }
    };
    
    updateName();

    window.addEventListener('storage', updateName);
    window.addEventListener('schoolNameChanged', updateName);
    window.addEventListener('configChanged', updateName);
    
    return () => {
      window.removeEventListener('storage', updateName);
      window.removeEventListener('schoolNameChanged', updateName);
      window.removeEventListener('configChanged', updateName);
    };
  }, []);

  return {
    tenantId,
    tenantName,
    academicYear,
    semester,
    isSuperAdmin: false,
    setTenant,
  };
}
