import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../types';
import { sendError } from '../utils/apiResponse';

export interface AuthPayload {
  id: string;
  role: UserRole;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// JWT lets the server identify the user on later requests without
// storing session state in memory (stateless authentication).
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    sendError(res, 'Not authenticated — login required', 'UNAUTHORIZED', 401);
    return;
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 'INVALID_TOKEN', 401);
  }
};

// Authorization answers "what are you allowed to do?" after
// authentication has already answered "who are you?"
export const authorize =
  (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(
        res,
        'You do not have permission for this action',
        'FORBIDDEN',
        403
      );
      return;
    }
    next();
  };
