import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { useAuthStore } from '../stores/authStore';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = () => {
    queryClient.clear();
    clearUser();
    navigate('/login', { replace: true });
  };

  return useMutation({
    mutationFn: logout,
    onSuccess: handleLogout,
    onError: handleLogout,
  });
};