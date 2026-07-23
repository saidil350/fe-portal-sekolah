import { useSidebarStore } from '../stores/sidebar-store';

export function useSidebar() {
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    setCollapsed,
    toggleMobileOpen,
    setMobileOpen,
  } = useSidebarStore();

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    setCollapsed,
    toggleMobileOpen,
    setMobileOpen,
  };
}
