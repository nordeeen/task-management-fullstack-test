import Task from '../models/Task';

// Get all tasks (with pagination)
export const getTasksService = async (
  userId: string,
  status?: string,
  page: number = 1,
  limit: number = 5,
) => {
  const filter: any = { userId };

  if (status && status !== 'all') {
    filter.status = status;
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(filter),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Search tasks
export const searchTasksService = async (userId: string, q: string) => {
  return await Task.find({
    userId,
    title: { $regex: q, $options: 'i' },
  }).sort({ createdAt: -1 });
};

// Get single task
export const getTaskByIdService = async (id: string) => {
  return await Task.findById(id);
};

// Create task
export const createTaskService = async (data: any) => {
  return await Task.create(data);
};

// Update task
export const updateTaskService = async (id: string, data: any) => {
  return await Task.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
};

// Delete task
export const deleteTaskService = async (task: any) => {
  return await task.deleteOne();
};
