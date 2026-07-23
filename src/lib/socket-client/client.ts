import { io, Socket } from 'socket.io-client';
import { getEnv } from '@/lib/config';
import { ServerToClientEvents, ClientToServerEvents } from './events';

const env = getEnv();

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socketInstance: AppSocket | null = null;

export interface SocketConnectionConfig {
  token: string;
  tenantId: string;
  userId: string;
  role: string;
}

export function connectSocket(config: SocketConnectionConfig): AppSocket {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  socketInstance = io(env.NEXT_PUBLIC_WS_URL, {
    autoConnect: false,
    auth: {
      token: config.token,
    },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.connect();

  socketInstance.on('connect', () => {
    // Gabung ke room tenant dan user secara otomatis
    socketInstance?.emit('room.join', {
      tenantId: config.tenantId,
      userId: config.userId,
      role: config.role,
    });
  });

  return socketInstance;
}

export function disconnectSocket(tenantId: string, userId: string) {
  if (socketInstance) {
    if (socketInstance.connected) {
      socketInstance.emit('room.leave', { tenantId, userId });
    }
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export function getSocket(): AppSocket | null {
  return socketInstance;
}
