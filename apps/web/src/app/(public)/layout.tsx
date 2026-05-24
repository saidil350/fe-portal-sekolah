import * as React from 'react';
import { LoginProviders } from '../../providers/login-providers';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/10 font-sans antialiased">
      <LoginProviders>{children}</LoginProviders>
    </div>
  );
}
