import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/tasks';
import type { GetTasksParams, PaginatedTasksResponse, TaskFormData } from '../types';

// Hook for get tasks (filter status, search & pagination )
export const useTasks = (params?: GetTasksParams) => {
  return useQuery<PaginatedTasksResponse>({
    queryKey: ['tasks', params],
    queryFn: () => getAllTasks(params),
    staleTime: 0,
    placeholderData: { data: [], total: 0, page: 1, totalPages: 1 },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskFormData) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskFormData> }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};