import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
} from '../controllers/taskController';
import { protect } from '../middleware/auth';
import { validateTask, handleValidationErrors } from '../utils/validation';

const router = Router();

// All task routes require authentication
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(validateTask, handleValidationErrors, createTask);

router.get('/search', searchTasks);
router
  .route('/:id')
  .get(getTask)
  .put(validateTask, handleValidationErrors, updateTask)
  .delete(deleteTask);

export default router;
