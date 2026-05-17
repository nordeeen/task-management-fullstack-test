import { Request, Response } from 'express';
import {
  getTasksService,
  searchTasksService,
  getTaskByIdService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from '../services/taskService';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const result = await getTasksService(
      req.user._id,
      req.query.status as string,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      count: result.data.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.data,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const searchTasks = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const tasks = await searchTasksService(req.user._id, q as string);
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await getTaskByIdService(req.params.id as string);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, deadline } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const validStatus = ['pending', 'in-progress', 'done'];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    if (deadline && isNaN(new Date(deadline).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deadline format',
      });
    }
  
    const task = await createTaskService({
      title: title.trim(),
      description,
      status: status || 'pending',
      deadline: deadline ? new Date(deadline) : undefined,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await getTaskByIdService(req.params.id as string);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const { title, description, status, deadline } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const validStatus = ['pending', 'in-progress', 'done'];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status invalid',
      });
    }

    if (deadline && isNaN(new Date(deadline).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deadline format',
      });
    }

  const updatedTask = await updateTaskService(req.params.id as string, {
      ...req.body,
      title: title ? title.trim() : undefined,
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await getTaskByIdService(req.params.id as string);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await deleteTaskService(task);
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
