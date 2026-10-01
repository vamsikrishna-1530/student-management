import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// Central error middleware: controllers throw AppError (or let Mongoose
// errors bubble up) and this layer converts them into a consistent JSON
// response. Keeps controllers free of repetitive try/catch response logic.
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errorCode,
    });
    return;
  }

  // Mongoose validation errors (e.g. missing required field)
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: err.message,
      error: 'VALIDATION_ERROR',
    });
    return;
  }

  // Duplicate key (e.g. unique email already exists)
  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate value — a record with this unique field already exists',
      error: 'DUPLICATE_KEY',
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: 'INTERNAL_SERVER_ERROR',
  });
};
