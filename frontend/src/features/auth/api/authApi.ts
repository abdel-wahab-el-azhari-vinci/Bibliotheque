import httpClient from '../../../shared/api/httpClient';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginResponse>('/auth/register', data);
    return response.data;
  },
};
