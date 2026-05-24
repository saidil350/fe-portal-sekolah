'use client';

import * as React from 'react';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';
import { SocketProvider } from './socket-provider';
import { ToastProvider } from './toast-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <QueryProvider>
          <AuthProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </AuthProvider>
        </QueryProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
