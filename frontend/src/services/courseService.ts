import api from './api';
import type { ApiResponse, Course } from '../types';

export const courseService = {
  list: async (search?: string) => {
    const { data } = await api.get<ApiResponse<Course[]>>('/courses', {
      params: { search },
    });
    return data.data;
  },

  get: async (id: string) => {
    const { data } = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    return data.data;
  },

  create: async (payload: {
    name: string;
    code: string;
    description?: string;
    credits: number;
  }) => {
    const { data } = await api.post<ApiResponse<Course>>('/courses', payload);
    return data.data;
  },

  update: async (id: string, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResponse<Course>>(`/courses/${id}`, payload);
    return data.data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete<ApiResponse<Course>>(`/courses/${id}`);
    return data.data;
  },
};
