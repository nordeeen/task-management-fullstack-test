import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../utils/validation';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/me', protect, getMe);

export default router;
