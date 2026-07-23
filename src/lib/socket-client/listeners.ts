import { getSocket } from './client';
import { ServerToClientEvents } from './events';

export function registerSocketListener<E extends keyof ServerToClientEvents>(
  event: E,
  listener: ServerToClientEvents[E]
) {
  const socket = getSocket();
  if (socket) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (socket as any).on(event, listener);
  }

  return () => {
    const activeSocket = getSocket();
    if (activeSocket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (activeSocket as any).off(event, listener);
    }
  };
}
