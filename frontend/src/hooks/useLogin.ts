import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, type LoginPayload } from '../services/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      if (data?.data) {
        queryClient.setQueryData(['me'], data);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['me'] });
      }
      navigate('/');
    },
    onError: (error: any) => {
      console.error(
        'Login error:',
        error?.response?.data?.message || error.message,
      );
    },
  });
};