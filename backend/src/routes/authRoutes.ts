import { Router } from 'express';
import { register, login, getMe, logoutUser } from '../controllers/authController';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../utils/validation';

const router = Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', logoutUser);
router.get('/me', getMe);

export default router;
