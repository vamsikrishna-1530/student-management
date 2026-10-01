export type UserRole = 'admin' | 'teacher' | 'student';

export interface ApiSuccess<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
