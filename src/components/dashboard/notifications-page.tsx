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
   * Data notifikasi awal. Jika tidak diberikan, digunakan data default.
   */
  initialNotifications?: NotificationItem[];
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Pengumuman Libur Nasional',
    message:
      'Diberitahukan bahwa kegiatan belajar mengajar diliburkan dalam rangka Hari Libur Nasional pada Kamis mendatang.',
    type: 'ANNOUNCEMENT',
    createdAt: '1 jam yang lalu',
    isRead: false,
  },
  {
    id: '2',
    title: 'Pembaruan Data Berhasil',
    message:
      'Data profil Anda telah berhasil diperbarui dan diverifikasi oleh sistem.',
    type: 'INFO',
    createdAt: 'Kemarin',
    isRead: true,
  },
  {
    id: '3',
    title: 'Peringatan Keamanan Akun',
    message:
      'Demi keamanan akun Anda, disarankan untuk memperbarui kata sandi secara berkala.',
    type: 'WARNING',
    createdAt: '3 hari yang lalu',
    isRead: true,
  },
];

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
  initialNotifications = DEFAULT_NOTIFICATIONS,
}: NotificationsPageProps) {
  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
            onClick={markAllAsRead}
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
              onClick={() => toggleRead(item.id)}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                !item.isRead ? 'bg-muted/30' : 'opacity-80'
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-start gap-4 text-left">
                <div className="p-2 rounded-md bg-muted">
                  {getIcon(item.type)}
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
                      {item.createdAt}
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
