'use client';

import * as React from 'react';
import { AuthProvider } from './auth-provider';
import { QueryProvider } from './query-provider';

export function LoginProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
