import { axiosInstance } from '../lib/axios';
import type { LoginPayload, RegisterPayload } from '../types';

export const register = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post('/auth/register', payload);
  return response.data;
};

export const login = async (payload: LoginPayload) => {
  const response = await axiosInstance.post('/auth/login', payload);
  console.log('response login:', response.data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
