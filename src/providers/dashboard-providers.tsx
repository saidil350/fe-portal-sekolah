'use client';

import * as React from 'react';
import { QueryProvider } from './query-provider';
import { SocketProvider } from './socket-provider';

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <SocketProvider>{children}</SocketProvider>
    </QueryProvider>
  );
}
