'use client';

import * as React from 'react';
import { useToast } from '@/components/ui';
import { useAuthStore } from '../stores/auth-store';
import { useNotificationStore } from '../stores/notification-store';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, session, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isAuthenticated || !session || !user) {
      return;
    }

    let isMounted = true;
    let unsubscribeNotif: (() => void) | undefined;
    let unsubscribeBroadcast: (() => void) | undefined;
    let disconnectSocket: ((tenantId: string, userId: string) => void) | undefined;

    import('@/lib/socket-client').then(({ connectSocket, disconnectSocket: closeSocket, registerSocketListener }) => {
      if (!isMounted) return;

      disconnectSocket = closeSocket;
      connectSocket({
        token: session.token,
        tenantId: user.tenantId || 'global',
        userId: user.id,
        role: user.role,
      });

      unsubscribeNotif = registerSocketListener('notification.created', (notif) => {
        addNotification(notif);
        toast({
          title: notif.title,
          description: notif.message,
        });
      });

      unsubscribeBroadcast = registerSocketListener('notification.broadcast', (notif) => {
        addNotification(notif);
        toast({
          title: `📢 ${notif.title}`,
          description: notif.message,
        });
      });
    });

    return () => {
      isMounted = false;
      unsubscribeNotif?.();
      unsubscribeBroadcast?.();
      disconnectSocket?.(user.tenantId || 'global', user.id);
    };
  }, [isAuthenticated, session, user, addNotification, toast]);

  return <>{children}</>;
}
