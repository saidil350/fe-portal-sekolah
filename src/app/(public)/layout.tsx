import * as React from 'react';
import { LoginProviders } from '../../providers/login-providers';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginProviders>{children}</LoginProviders>
  );
}
