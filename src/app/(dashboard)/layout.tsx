import * as React from 'react';
import { DashboardLayout } from '../../components/layouts/dashboard-layout';
import { DashboardProviders } from '../../providers/dashboard-providers';
import { Toaster } from '@/components/ui/components/toaster';

export default function DashboardRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProviders>
      <DashboardLayout>{children}</DashboardLayout>
      <Toaster />
    </DashboardProviders>
  );
}
