import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login, getMe, type LoginPayload } from '../services/auth';
import { useAuthStore } from '../stores/authStore';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async () => {
      const meData = await getMe();
      if (meData?.data) {
        const u = meData.data;
        setUser({ id: u._id ?? u.id, name: u.name, email: u.email });
        queryClient.setQueryData(['me'], meData);
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