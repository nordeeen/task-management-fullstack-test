import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('password').notEmpty().withMessage('Password is required'),
];

export const validateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'done'])
    .withMessage('Invalid status value'),

  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Deadline cannot be in the past');
      }
      return true;
    }),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages: Record<string, string[]> = {};
    errors.array().forEach((error: any) => {
      if (!errorMessages[error.path]) {
        errorMessages[error.path] = [];
      }
      errorMessages[error.path].push(error.msg);
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  next();
};
