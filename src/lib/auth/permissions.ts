import { Role, Permission } from '@/types';

export const PERMISSION_MATRIX: Record<Role, Permission[]> = {
  ADMIN_IT: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'classes.create', 'classes.read', 'classes.update', 'classes.delete', 'classes.assign',
    'attendance.read', 'attendance.read.all', 'attendance.report',
    'assignments.read',
    'payments.read', 'payments.read.all',
    'notifications.broadcast', 'notifications.read',
    'dashboard.view'
  ],
  KEPALA_SEKOLAH: [
    'users.read',
    'classes.read',
    'attendance.read', 'attendance.read.all', 'attendance.report',
    'assignments.read',
    'payments.read', 'payments.read.all',
    'notifications.broadcast', 'notifications.read',
    'dashboard.view'
  ],
  BENDAHARA: [
    'users.read',
    'classes.read',
    'payments.create', 'payments.read', 'payments.read.all', 'payments.verify',
    'notifications.broadcast', 'notifications.read',
    'dashboard.view'
  ],
  GURU: [
    'users.read',
    'classes.read',
    'attendance.read', 'attendance.report',
    'assignments.create', 'assignments.read', 'assignments.update', 'assignments.delete', 'assignments.grade',
    'notifications.read',
    'dashboard.view'
  ],
  STAFF: [
    'users.read',
    'classes.read',
    'attendance.read', 'attendance.read.all', 'attendance.report',
    'payments.read', 'payments.read.all',
    'notifications.read',
    'dashboard.view'
  ],
  SISWA: [
    'classes.read',
    'attendance.check_in', 'attendance.check_out', 'attendance.read',
    'assignments.read', 'assignments.submit',
    'payments.read',
    'notifications.read',
    'dashboard.view'
  ]
};
