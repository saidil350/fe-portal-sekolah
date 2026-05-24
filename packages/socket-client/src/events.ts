import { AttendanceRecord, Payment, Notification, Assignment, Submission } from '@portal-sekolah/types';

export interface ServerToClientEvents {
  'attendance.checked_in': (record: AttendanceRecord) => void;
  'attendance.checked_out': (record: AttendanceRecord) => void;
  
  'payment.success': (payment: Payment) => void;
  'payment.failed': (error: { invoiceId: string; message: string }) => void;
  
  'notification.created': (notification: Notification) => void;
  'notification.broadcast': (notification: Notification) => void;
  
  'assignment.created': (assignment: Assignment) => void;
  'assignment.submitted': (submission: Submission) => void;
  'assignment.graded': (submission: Submission) => void;
}

export interface ClientToServerEvents {
  'room.join': (payload: { tenantId: string; userId: string; role: string }) => void;
  'room.leave': (payload: { tenantId: string; userId: string }) => void;
}
