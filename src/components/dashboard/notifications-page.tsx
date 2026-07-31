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
  Trash2,
  CheckSquare,
  Square,
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

  if (diffInMs < 60000 || diffInMins < 1) return 'Baru saja';
  if (diffInMins < 60) return `${diffInMins} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays === 1) return 'Kemarin';
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
    deleteNotification,
    deleteSelectedNotifications,
    deleteAllNotifications,
  } = useNotificationStore();

  const [localNotifications, setLocalNotifications] = React.useState<NotificationItem[] | null>(
    initialNotifications || null
  );

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!initialNotifications) {
      fetchNotifications();
    }
  }, [fetchNotifications, initialNotifications]);

  const notifications = (localNotifications || storeNotifications) as NotificationItem[];
  const unreadCount = localNotifications
    ? localNotifications.filter((n) => !n.isRead).length
    : storeUnreadCount;

  const isAllSelected =
    notifications.length > 0 && selectedIds.length === notifications.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((n) => n.id));
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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

  const handleDeleteSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (localNotifications) {
      setLocalNotifications((prev) => prev?.filter((n) => n.id !== id) || null);
    }
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    deleteNotification(id);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} notifikasi terpilih?`)) {
      if (localNotifications) {
        setLocalNotifications(
          (prev) => prev?.filter((n) => !selectedIds.includes(n.id)) || null
        );
      }
      deleteSelectedNotifications(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    if (confirm('Apakah Anda yakin ingin menghapus SELURUH notifikasi?')) {
      if (localNotifications) {
        setLocalNotifications([]);
      }
      deleteAllNotifications();
      setSelectedIds([]);
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

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2">
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

          {notifications.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteAll}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </Button>
          )}
        </div>
      </div>

      {/* Multi-Select Action Toolbar */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between px-3 py-2 bg-muted/40 rounded-lg border text-sm">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-primary" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground" />
            )}
            <span>Pilih Semua ({notifications.length})</span>
          </button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                {selectedIds.length} Terpilih
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="h-8 gap-1.5 text-xs px-3"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Terpilih
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 text-muted" />
            <p>Tidak ada notifikasi saat ini.</p>
          </Card>
        ) : (
          notifications.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <Card
                key={item.id}
                onClick={() => handleToggleRead(item.id, item.isRead)}
                className={`cursor-pointer transition-colors hover:bg-accent/50 group relative ${
                  isSelected ? 'border-primary bg-primary/5' : !item.isRead ? 'bg-muted/30' : 'opacity-80'
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4 text-left">
                  {/* Checkbox */}
                  <button
                    onClick={(e) => handleToggleSelect(item.id, e)}
                    className="mt-0.5 p-1 rounded hover:bg-accent shrink-0 transition-colors"
                    title="Pilih Notifikasi"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground" />
                    )}
                  </button>

                  {/* Icon */}
                  <div className="p-2 rounded-md bg-muted shrink-0">
                    {getIcon(item.type as NotificationType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm font-semibold truncate ${
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

                  {/* Indicators & Delete Action */}
                  <div className="flex items-center gap-2 shrink-0 self-center">
                    {!item.isRead && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                    <button
                      onClick={(e) => handleDeleteSingle(item.id, e)}
                      className="p-1.5 rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground/60 opacity-0 group-hover:opacity-100 sm:opacity-70 transition-all"
                      title="Hapus Notifikasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
