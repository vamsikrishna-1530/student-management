import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/apiResponse';

// Controller layer receives HTTP and delegates business logic to services.
// Keeping these separate makes each layer easier to test and maintain.
export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body);
    sendSuccess(res, 'Registered successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    sendSuccess(res, 'Login successful', result);
  } catch (err) {
    next(err);
  }
};

export const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.getProfile(req.user!.id);
    sendSuccess(res, 'Profile fetched', user);
  } catch (err) {
    next(err);
  }
};

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
