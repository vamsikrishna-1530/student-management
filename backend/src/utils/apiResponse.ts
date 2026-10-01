import { Response } from 'express';

// Consistent response shape makes the React frontend simpler:
// every API call can check `success` the same way.
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200
): void => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  message: string,
  error: string,
  statusCode = 400
): void => {
  res.status(statusCode).json({ success: false, message, error });
};
