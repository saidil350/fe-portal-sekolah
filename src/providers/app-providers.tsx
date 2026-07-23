'use client';

import * as React from 'react';
import { ToastProvider } from '@/components/ui';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
