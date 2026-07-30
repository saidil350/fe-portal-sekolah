'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  School,
  Settings,
  ShieldAlert,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '../../stores/auth-store';
import { useSidebarStore } from '../../stores/sidebar-store';
import { NAV_CONFIG, NavItem } from './nav-config';
import { getRoleFromDashboardPath } from './role-from-path';

const ICON_MAP = {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  School,
  Settings,
  ShieldAlert,
  User,
  Users,
} satisfies Record<NavItem['iconName'], React.ComponentType<{ className?: string }>>;

export function SidebarNav({ forceExpand = false }: { forceExpand?: boolean }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isCollapsed, setMobileOpen } = useSidebarStore();

  const effectiveCollapsed = forceExpand ? false : isCollapsed;
  const role = user?.role || getRoleFromDashboardPath(pathname) || 'SISWA';
  const menuItems = NAV_CONFIG[role] || [];

  return (
    <nav
      className={cn('flex flex-col gap-1.5 py-4 transition-all duration-300', {
        'px-3': !effectiveCollapsed,
        'px-2 items-center': effectiveCollapsed,
      })}
    >
      {menuItems.map((item: NavItem) => {
        const IconComponent = ICON_MAP[item.iconName];
        const isRoleRoot = item.href.split('/').filter(Boolean).length === 2;
        const isActive = pathname === item.href || (!isRoleRoot && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)} // Auto tutup di mobile
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative',
              {
                'bg-accent text-accent-foreground font-semibold': isActive,
                'text-muted-foreground hover:bg-muted hover:text-foreground': !isActive,
                'justify-center w-10 h-10 p-0': effectiveCollapsed,
              }
            )}
          >
            {IconComponent && (
              <IconComponent
                className={cn('h-4 w-4 shrink-0', {
                  'text-accent-foreground': isActive,
                  'text-muted-foreground group-hover:text-foreground': !isActive,
                })}
              />
            )}
            
            {/* Teks label menu (disembunyikan saat collapse) */}
            {!effectiveCollapsed && (
              <span className="truncate">
                {item.title}
              </span>
            )}

            {/* Hover Tooltip saat collapse */}
            {effectiveCollapsed && (
              <div className="absolute left-full ml-3 z-50 rounded-md border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.title}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
