import api from './api';
import type { ApiResponse, Student, DashboardStats } from '../types';

export const studentService = {
  list: async (params?: {
    search?: string;
    department?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await api.get<
      ApiResponse<{
        students: Student[];
        pagination: { page: number; limit: number; total: number; pages: number };
      }>
    >('/students', { params });
    return data.data;
  },

  get: async (id: string) => {
    const { data } = await api.get<ApiResponse<Student>>(`/students/${id}`);
    return data.data;
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await api.post<ApiResponse<Student>>('/students', payload);
    return data.data;
  },

  update: async (id: string, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResponse<Student>>(
      `/students/${id}`,
      payload
    );
    return data.data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete<ApiResponse<{ id: string }>>(
      `/students/${id}`
    );
    return data.data;
  },

  stats: async () => {
    const { data } = await api.get<ApiResponse<DashboardStats>>(
      '/students/stats/dashboard'
    );
    return data.data;
  },
};
