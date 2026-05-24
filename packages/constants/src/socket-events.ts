export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Realtime Events
  ATTENDANCE: {
    CHECKED_IN: 'attendance.checked_in',
    CHECKED_OUT: 'attendance.checked_out',
  },
  PAYMENT: {
    SUCCESS: 'payment.success',
    FAILED: 'payment.failed',
  },
  NOTIFICATION: {
    CREATED: 'notification.created',
    BROADCAST: 'notification.broadcast',
  },
  ASSIGNMENT: {
    CREATED: 'assignment.created',
    SUBMITTED: 'assignment.submitted',
    GRADED: 'assignment.graded',
  },
};
