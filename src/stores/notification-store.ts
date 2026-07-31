import { create } from 'zustand';
import { Notification } from '@/types';
import { notificationsApi } from '@/lib/api-client';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteSelectedNotifications: (ids: string[]) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await notificationsApi.getNotifications({ limit: 50 });
      if (res.success && res.data) {
        const items = res.data.items || [];
        set({
          notifications: items,
          unreadCount: items.filter((n) => !n.isRead).length,
        });
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      set({ isLoading: false });
    }
  },
  
  addNotification: (notification) =>
    set((state) => {
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) return state;
      return {
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
      };
    }),
    
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
    
  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await notificationsApi.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  },
    
  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    try {
      await notificationsApi.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  },

  deleteNotification: async (id: string) => {
    set((state) => {
      const target = state.notifications.find((n) => n.id === id);
      const isUnread = target && !target.isRead;
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
    try {
      await notificationsApi.deleteNotification(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  },

  deleteSelectedNotifications: async (ids: string[]) => {
    set((state) => {
      const remaining = state.notifications.filter((n) => !ids.includes(n.id));
      return {
        notifications: remaining,
        unreadCount: remaining.filter((n) => !n.isRead).length,
      };
    });
    try {
      await notificationsApi.clearNotifications(ids);
    } catch (err) {
      console.error('Failed to delete selected notifications:', err);
    }
  },

  deleteAllNotifications: async () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
    try {
      await notificationsApi.clearNotifications();
    } catch (err) {
      console.error('Failed to delete all notifications:', err);
    }
  },
}));

