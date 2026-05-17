import { axiosInstance } from '../lib/axios';
import type { GetTasksParams, PaginatedTasksResponse, Task, TaskFormData } from '../types';

// GET all taks, search, filter & pagination
export const getAllTasks = async (params?: GetTasksParams): Promise<PaginatedTasksResponse> => {
  const { q, status, page = 1, limit = 5 } = params || {};

  if (q && q.trim()) {
    const response = await axiosInstance.get('/tasks/search', { params: { q } });
    const data: Task[] = response.data.data;
    return { data, total: data.length, page: 1, totalPages: 1 };
  }

  const response = await axiosInstance.get('/tasks', {
    params: {
      ...(status && status !== 'all' ? { status } : {}),
      page,
      limit,
    },
  });

  return {
    data: response.data.data,
    total: response.data.total,
    page: response.data.page,
    totalPages: response.data.totalPages,
  };
};

// Create task
export const createTask = async (data: TaskFormData): Promise<Task> => {
  const response = await axiosInstance.post('/tasks', data);
  return response.data.data;
};

// Update task
export const updateTask = async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
  const response = await axiosInstance.put(`/tasks/${id}`, data);
  return response.data.data;
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};