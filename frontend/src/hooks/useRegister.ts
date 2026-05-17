import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { register, type RegisterPayload } from '../services/auth';

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: async () => {
      queryClient.clear();
      navigate('/login');
    },
    onError: (error: any) => {
      console.error(
        'Register error:',
        error?.response?.data?.message || error.message,
      );
    },
  });
};