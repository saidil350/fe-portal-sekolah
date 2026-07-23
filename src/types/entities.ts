export interface BaseEntity {
  id: string;
  tenantId?: string; // Optional hanya untuk entitas global (jika ada)
  createdAt: string;
  updatedAt: string;
}

export interface AcademicClass extends BaseEntity {
  name: string;
  code: string;
  gradeLevel: number;
  homeroomTeacherId: string;
  academicYear: string;
  studentCount?: number;
}

export interface StudentProfile extends BaseEntity {
  userId: string;
  nis: string;
  nisn?: string;
  gender: 'L' | 'P';
  birthPlace?: string;
  birthDate?: string;
  classId?: string;
}

export interface TeacherProfile extends BaseEntity {
  userId: string;
  nip?: string;
  gender: 'L' | 'P';
  subjectArea?: string[];
  isHomeroom?: boolean;
}
