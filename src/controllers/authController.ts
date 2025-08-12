import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { signup, login } from '../services/authService';

export const authController = {
  // User signup
  signup: asyncHandler(async (req: Request, res: Response) => {
    const result = await signup(req.body);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result
    });
  }),

  // User login
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await login(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  })
}; 