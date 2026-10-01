import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/apiResponse';
import { syncOrgShowcase } from '../utils/ensureSeed';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

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

/** Public app config for the frontend (registration policy, org name). */
export const getPublicConfig = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    sendSuccess(res, 'Config fetched', {
      orgName: env.orgName,
      allowPublicRegister: env.allowPublicRegister,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin-only: refresh official org showcase data.
 * Body { reset: true } wipes DB first — use carefully in workshops.
 */
export const syncOrgDatabase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      throw new AppError('Only admin can sync the org database', 403, 'FORBIDDEN');
    }
    const reset = Boolean(req.body?.reset);
    const result = await syncOrgShowcase({ reset });
    sendSuccess(
      res,
      reset
        ? 'Org database reset to official showcase data'
        : 'Org showcase data synced',
      result
    );
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
