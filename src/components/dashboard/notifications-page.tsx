'use client';

import * as React from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  CreditCard,
  CheckCheck,
  Calendar,
  Megaphone,
  BookOpen,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/components/card';
import { Button } from '@/components/ui/components/button';
import { Badge } from '@/components/ui/components/badge';
import { useNotificationStore } from '@/stores/notification-store';

export type NotificationType =
  | 'INFO'
  | 'ANNOUNCEMENT'
  | 'WARNING'
  | 'PAYMENT'
  | 'ACADEMIC'
  | 'ATTENDANCE';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
}

interface NotificationsPageProps {
  /**
   * Judul halaman (default: "Notifikasi")
   */
  title?: string;
  /**
   * Deskripsi/subtitle halaman
   */
  description?: string;
  /**
   * Data notifikasi awal. Jika tidak diberikan, digunakan data dari store/API.
   */
  initialNotifications?: NotificationItem[];
}

function formatNotificationDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return 'Baru saja';
  if (diffInMins < 60) return `${diffInMins} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays === 1) return 'Kemarin';
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getIcon(type: NotificationType) {
  switch (type) {
    case 'ANNOUNCEMENT':
      return <Megaphone className="w-4 h-4 text-muted-foreground shrink-0" />;
    case 'WARNING':
      return <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />;
    case 'PAYMENT':
      return <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />;
    case 'ACADEMIC':
      return <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />;
    case 'ATTENDANCE':
      return <Users className="w-4 h-4 text-muted-foreground shrink-0" />;
    case 'INFO':
    default:
      return <Info className="w-4 h-4 text-muted-foreground shrink-0" />;
  }
}

export function NotificationsPage({
  title = 'Notifikasi',
  description = 'Pengumuman sekolah, informasi akun, dan pembaruan sistem.',
  initialNotifications,
}: NotificationsPageProps) {
  const {
    notifications: storeNotifications,
    unreadCount: storeUnreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const [localNotifications, setLocalNotifications] = React.useState<NotificationItem[] | null>(
    initialNotifications || null
  );

  React.useEffect(() => {
    if (!initialNotifications) {
      fetchNotifications();
    }
  }, [fetchNotifications, initialNotifications]);

  const notifications = (localNotifications || storeNotifications) as NotificationItem[];
  const unreadCount = localNotifications
    ? localNotifications.filter((n) => !n.isRead).length
    : storeUnreadCount;

  const handleMarkAllAsRead = () => {
    if (localNotifications) {
      setLocalNotifications((prev) => prev?.map((n) => ({ ...n, isRead: true })) || null);
    }
    markAllAsRead();
  };

  const handleToggleRead = (id: string, isRead: boolean) => {
    if (localNotifications) {
      setLocalNotifications(
        (prev) => prev?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) || null
      );
    }
    if (!isRead) {
      markAsRead(id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b text-left">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {unreadCount > 0 && (
              <Badge variant="default">{unreadCount} Baru</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 text-muted" />
            <p>Tidak ada notifikasi saat ini.</p>
          </Card>
        ) : (
          notifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleToggleRead(item.id, item.isRead)}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                !item.isRead ? 'bg-muted/30' : 'opacity-80'
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-start gap-4 text-left">
                <div className="p-2 rounded-md bg-muted">
                  {getIcon(item.type as NotificationType)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-semibold ${
                        !item.isRead
                          ? 'text-foreground font-bold'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {formatNotificationDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


