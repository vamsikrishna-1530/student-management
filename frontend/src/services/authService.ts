import api from './api';
import type { AuthResponse, ApiResponse, User } from '../types';

export type PublicConfig = {
  orgName: string;
  allowPublicRegister: boolean;
};

export const authService = {
  getConfig: async () => {
    const { data } = await api.get<ApiResponse<PublicConfig>>('/auth/config');
    return data.data;
  },

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

  /** Admin: refresh official org showcase records (optional full reset). */
  syncOrgDb: async (reset = false) => {
    const { data } = await api.post<
      ApiResponse<{ org: string; users: number; courses: number; students: number }>
    >('/auth/sync-org-db', { reset });
    return data.data;
  },
};
