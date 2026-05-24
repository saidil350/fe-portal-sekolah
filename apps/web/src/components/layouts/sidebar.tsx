'use client';

import * as React from 'react';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '../../hooks/use-sidebar';
import { SidebarNav } from '../navigation/sidebar-nav';

export function Sidebar() {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen border-r bg-card text-card-foreground transition-all duration-300 ease-in-out shrink-0 select-none z-20',
        {
          'w-64': !isCollapsed,
          'w-16': isCollapsed,
        }
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b px-4 gap-2.5">
        <GraduationCap className="h-7 w-7 text-primary shrink-0 transition-transform duration-300 hover:rotate-12" />
        
        {!isCollapsed && (
          <div className="flex flex-col text-left animate-in fade-in duration-300">
            <span className="text-sm font-black leading-tight tracking-wider bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent uppercase">
              Portal Sekolah
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase leading-none">
              SaaS Multi-Tenant
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
        <SidebarNav />
      </div>

      {/* Footer / Copyright */}
      {!isCollapsed && (
        <div className="p-4 border-t text-center text-[10px] text-muted-foreground select-none animate-in fade-in duration-300">
          <span>&copy; {new Date().getFullYear()} Antigravity Portal</span>
        </div>
      )}
    </aside>
  );
}
