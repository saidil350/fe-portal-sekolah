import { BaseEntity } from './entities';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT' | 'ATTENDANCE' | 'PAYMENT' | 'ASSIGNMENT';

export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: NotificationType;
  userId?: string; // Nullable jika ini broadcast global atau tenant
  targetRole?: string;
  isRead: boolean;
  readAt?: string;
  link?: string;
}
