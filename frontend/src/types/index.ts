export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearError: () => void;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
}

export interface ValidationErrors {
  title?: string;
  description?: string;
  deadline?: string;
  status?: string;
}

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'done';
  deadline: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};


export type GetTasksParams = {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
};

export type PaginatedTasksResponse = {
  data: Task[];
  total: number;
  page: number;
  totalPages: number;
};