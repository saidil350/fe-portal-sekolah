'use client';

import * as React from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { MobileDrawer } from './mobile-drawer';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Drawer Mobile */}
      <MobileDrawer />

      {/* Main Container */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Topbar Navigation */}
        <Topbar />

        {/* Dynamic Content Pane */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-muted/40">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
