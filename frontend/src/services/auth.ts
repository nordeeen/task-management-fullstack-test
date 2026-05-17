import { axiosInstance } from '../lib/axios';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const register = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post('/auth/register', payload);
  console.log('response register:', response.data);
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
