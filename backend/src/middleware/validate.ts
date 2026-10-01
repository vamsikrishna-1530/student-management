import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse';

// Frontend validation improves UX, but backend validation is required
// for security — anyone can bypass the browser and call the API directly.
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(
      res,
      errors
        .array()
        .map((e) => e.msg)
        .join(', '),
      'VALIDATION_ERROR',
      400
    );
    return;
  }
  next();
};
