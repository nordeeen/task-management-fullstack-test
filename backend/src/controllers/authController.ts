import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
