'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { ROLE_DASHBOARD_PATH } from '@/lib/role-dashboard-path';

export default function DashboardRouterPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    router.push(ROLE_DASHBOARD_PATH[user.role]);
  }, [user, isAuthenticated, router]);

  return (
    <div className="w-full py-12 text-center">
      <p className="text-sm font-semibold text-muted-foreground animate-pulse">Mengarahkan ke dashboard anda...</p>
    </div>
  );
}
