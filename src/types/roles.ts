export type Role = 'ADMIN_IT' | 'KEPALA_SEKOLAH' | 'BENDAHARA' | 'GURU' | 'STAFF' | 'SISWA';


export type Permission =
  // User Management
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  
  // Class Management
  | 'classes.create'
  | 'classes.read'
  | 'classes.update'
  | 'classes.delete'
  | 'classes.assign'

  // Attendance Management
  | 'attendance.check_in'
  | 'attendance.check_out'
  | 'attendance.read'
  | 'attendance.read.all'
  | 'attendance.report'

  // Assignment Management
  | 'assignments.create'
  | 'assignments.read'
  | 'assignments.update'
  | 'assignments.delete'
  | 'assignments.submit'
  | 'assignments.grade'

  // Payment Management
  | 'payments.create'
  | 'payments.read'
  | 'payments.read.all'
  | 'payments.verify'

  // Notification Management
  | 'notifications.broadcast'
  | 'notifications.read'

  // Dashboard
  | 'dashboard.view';
