'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import { PageSkeleton } from '../components/shared/loading-skeleton';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted/20">
      <div className="w-full max-w-lg">
        <PageSkeleton />
      </div>
    </div>
  );
}
