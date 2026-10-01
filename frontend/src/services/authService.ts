import api from './api';
import type { AuthResponse, ApiResponse, User } from '../types';

export const authService = {
  register: async (payload: {
    name: string;
    email: string;
    password: string;
  }) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      payload
    );
    return data.data;
  },

  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      payload
    );
    return data.data;
  },

  me: async () => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },
};
