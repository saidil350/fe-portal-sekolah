'use client';

import * as React from 'react';
import { QueryProvider } from './query-provider';

export function LoginProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>{children}</QueryProvider>
  );
}
