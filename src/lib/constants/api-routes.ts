export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  TENANTS: {
    DETAIL: (domain: string) => `/tenants/domain/${domain}`,
    CONFIG: '/tenants/config',
  },
  USERS: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
  },
  CLASSES: {
    BASE: '/classes',
    DETAIL: (id: string) => `/classes/${id}`,
    STUDENTS: (id: string) => `/classes/${id}/students`,
  },
  ATTENDANCE: {
    CHECK_IN: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    HISTORY: '/attendance/history',
    REPORTS: '/attendance/reports',
  },
  ASSIGNMENTS: {
    BASE: '/assignments',
    DETAIL: (id: string) => `/assignments/${id}`,
    SUBMISSIONS: (id: string) => `/assignments/${id}/submissions`,
    GRADE: (assignmentId: string, submissionId: string) => `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
  },
  PAYMENTS: {
    INVOICES: '/payments/invoices',
    INVOICE_DETAIL: (id: string) => `/payments/invoices/${id}`,
    PAY: (id: string) => `/payments/invoices/${id}/pay`,
    QRIS: (id: string) => `/payments/invoices/${id}/qris`,
    STATUS: (orderId: string) => `/payments/status/${orderId}`,
    HISTORY: '/payments/history',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    BROADCAST: '/notifications/broadcast',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    SUMMARY: '/dashboard/summary',
  },
};
