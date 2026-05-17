import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = () => {
    queryClient.clear();
    clearUser();
    toast.success('Logout success');
    navigate('/login', { replace: true });
  };

  return useMutation({
    mutationFn: logout,
    onSuccess: handleLogout,
    onError: handleLogout,
  });
};
