import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import * as studentService from '../services/studentService';
import { sendSuccess } from '../utils/apiResponse';

export const getStudents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await studentService.listStudents({
      search: req.query.search as string,
      department: req.query.department as string,
      status: req.query.status as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
    });
    sendSuccess(res, 'Students fetched successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    sendSuccess(res, 'Student fetched successfully', student);
  } catch (err) {
    next(err);
  }
};

export const createStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = await studentService.createStudent(req.body);
    sendSuccess(res, 'Student created successfully', student, 201);
  } catch (err) {
    next(err);
  }
};

export const updateStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    sendSuccess(res, 'Student updated successfully', student);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await studentService.deleteStudent(req.params.id);
    sendSuccess(res, 'Student deleted successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getStats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await studentService.getDashboardStats();
    sendSuccess(res, 'Dashboard stats fetched', stats);
  } catch (err) {
    next(err);
  }
};

export const createStudentRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year').isInt({ min: 1, max: 5 }).withMessage('Year must be 1–5'),
  body('semester').isInt({ min: 1, max: 10 }).withMessage('Semester must be 1–10'),
];
