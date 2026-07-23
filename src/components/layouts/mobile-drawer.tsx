'use client';

import * as React from 'react';
import { useSidebar } from '../../hooks/use-sidebar';
import { SidebarNav } from '../navigation/sidebar-nav';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui';
import { GraduationCap } from 'lucide-react';

export function MobileDrawer() {
  const { isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu Navigasi Mobile</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b">
            <GraduationCap className="h-7 w-7 text-primary" />
            <div className="flex flex-col text-left">
              <span className="text-sm font-black leading-tight tracking-wider bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent uppercase">
                Portal Sekolah
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase leading-none">
                SaaS Multi-Tenant
              </span>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
            <SidebarNav />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
