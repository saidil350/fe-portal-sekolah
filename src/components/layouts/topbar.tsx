'use client';

import * as React from 'react';
import { Menu, Bell, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { useTenant } from '../../hooks/use-tenant';
import { useSidebar } from '../../hooks/use-sidebar';
import { useNotificationStore } from '../../stores/notification-store';
import { useTheme } from 'next-themes';
import { Breadcrumbs } from '../navigation/breadcrumbs';
import { getRoleFromDashboardPath } from '../navigation/role-from-path';
import { Avatar, AvatarImage, AvatarFallback, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, Badge } from '@/components/ui';
import { usePathname } from 'next/navigation';

export function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { tenantName } = useTenant();
  const { toggleCollapse, toggleMobileOpen } = useSidebar();
  const { unreadCount, notifications, markAllAsRead } = useNotificationStore();
  const { theme, setTheme } = useTheme();
  const fallbackRole = getRoleFromDashboardPath(pathname);
  const displayRole = user?.role || fallbackRole;

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileOpen}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="hidden md:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Tenant Info */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Sekolah</span>
          <span className="text-sm font-semibold text-foreground">{tenantName}</span>
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
              <div className="flex items-center justify-between w-full">
                <span>Notifikasi</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-[10px] text-primary hover:underline font-semibold">
                    Tandai semua dibaca
                  </button>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="max-h-[300px] overflow-y-auto p-1">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Tidak ada notifikasi baru
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="p-2.5 rounded-md hover:bg-muted text-left border-b last:border-0">
                    <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                      <span>{n.title}</span>
                      {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0.5 rounded-full hover:bg-muted">
              <Avatar className="h-8 w-8">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user?.name} />}
                <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm text-foreground">{user?.name}</span>
                <span className="text-xs text-muted-foreground mt-0.5">{user?.email}</span>
                <Badge variant="secondary" className="mt-1.5 self-start text-[10px] uppercase font-medium">
                  {displayRole?.replace('_', ' ') || 'SISWA'}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" /> Profil Saya
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4 mr-2" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
