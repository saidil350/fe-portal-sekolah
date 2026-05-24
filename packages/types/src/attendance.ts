import { BaseEntity } from './entities';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EXCUSED' | 'SICK' | 'ABSENT';

export interface AttendanceRecord extends BaseEntity {
  userId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  notes?: string;
  locationLatitude?: number;
  locationLongitude?: number;
  deviceInfo?: string;
  isRealtimeCheckedIn?: boolean;
}

export interface CheckInPayload {
  latitude?: number;
  longitude?: number;
  notes?: string;
}
