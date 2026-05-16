import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: number;
  keyValue?: any;
  errors?: any;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;
  error.status = err.status || 500;

  // Log error for debugging
  console.error(err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue!)[0];
    const message = `${field} already exists`;
    error = new Error(message) as ErrorWithStatus;
    error.status = 400;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors,
    });
  }

  // Mongoose Cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    const message = `Invalid ${err.path}`;
    error = new Error(message) as ErrorWithStatus;
    error.status = 400;
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};
