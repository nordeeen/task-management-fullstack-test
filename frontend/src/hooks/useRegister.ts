import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import type { RegisterPayload } from '../types';
import toast from 'react-hot-toast';

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: async () => {
      queryClient.clear();
      toast.success('Register success');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
      console.error(
        'Register error:',
        error?.response?.data?.message || error.message,
      );
    },
  });
};
