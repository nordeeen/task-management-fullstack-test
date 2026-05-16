import { Request, Response } from 'express';
import {
  getTasksService,
  searchTasksService,
  getTaskByIdService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from '../services/taskService';

// GET all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getTasksService(
      req.user._id,
      req.query.status as string,
    );

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// SEARCH tasks
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

// GET single task
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

// CREATE task
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await createTaskService({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending',
      deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
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

// UPDATE task
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

    const updatedTask = await updateTaskService(
      req.params.id as string,
      req.body,
    );

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

// DELETE task
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
