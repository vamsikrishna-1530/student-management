import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as courseService from '../services/courseService';
import { sendSuccess } from '../utils/apiResponse';

export const getCourses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await courseService.listCourses(req.query.search as string);
    sendSuccess(res, 'Courses fetched successfully', courses);
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    sendSuccess(res, 'Course fetched successfully', course);
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const course = await courseService.createCourse(req.body);
    sendSuccess(res, 'Course created successfully', course, 201);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    sendSuccess(res, 'Course updated successfully', course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const course = await courseService.deleteCourse(req.params.id);
    sendSuccess(res, 'Course deleted successfully', course);
  } catch (err) {
    next(err);
  }
};

export const createCourseRules = [
  body('name').trim().notEmpty().withMessage('Course name is required'),
  body('code').trim().notEmpty().withMessage('Course code is required'),
  body('credits').isInt({ min: 1, max: 10 }).withMessage('Credits must be 1–10'),
];
