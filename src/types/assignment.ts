import { BaseEntity } from './entities';

export interface Assignment extends BaseEntity {
  title: string;
  description: string;
  classId: string;
  teacherId: string;
  dueDate: string;
  maxScore: number;
  attachments?: string[];
}

export interface Submission extends BaseEntity {
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  attachments: string[];
  notes?: string;
  score?: number;
  gradedBy?: string;
  gradedAt?: string;
  feedback?: string;
}
