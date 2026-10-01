export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  teacher?: User;
  isActive: boolean;
}

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';

export interface Student {
  _id: string;
  user: User;
  rollNumber: string;
  department: string;
  year: number;
  semester: number;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  courses: Course[];
  status: StudentStatus;
  gpa?: number;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  byDepartment: { _id: string; count: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
