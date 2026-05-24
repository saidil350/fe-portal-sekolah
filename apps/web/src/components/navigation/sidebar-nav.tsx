'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '../../stores/auth-store';
import { useSidebarStore } from '../../stores/sidebar-store';
import { NAV_CONFIG, NavItem } from './nav-config';
import { getRoleFromDashboardPath } from './role-from-path';

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isCollapsed, setMobileOpen } = useSidebarStore();

  const role = user?.role || getRoleFromDashboardPath(pathname) || 'SISWA';
  const menuItems = NAV_CONFIG[role] || [];

  return (
    <nav className="flex flex-col gap-1.5 p-3">
      {menuItems.map((item: NavItem) => {
        // Dinamis memetakan nama string ke komponen Lucide Icon
        const IconComponent = LucideIcons[item.iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
        const isRoleRoot = item.href.split('/').filter(Boolean).length === 2;
        const isActive = pathname === item.href || (!isRoleRoot && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)} // Auto tutup di mobile
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
              {
                'bg-primary text-primary-foreground shadow-md shadow-primary/20': isActive,
                'text-muted-foreground hover:bg-muted hover:text-foreground': !isActive,
                'justify-center px-2': isCollapsed,
              }
            )}
          >
            {IconComponent && (
              <IconComponent
                className={cn('h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105', {
                  'text-primary-foreground': isActive,
                  'text-muted-foreground group-hover:text-foreground': !isActive,
                })}
              />
            )}
            
            {/* Teks label menu (disembunyikan saat collapse) */}
            {!isCollapsed && (
              <span className="truncate opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            )}

            {/* Hover Tooltip saat collapse */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 z-50 rounded-md bg-zinc-950 px-2 py-1 text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                {item.title}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
