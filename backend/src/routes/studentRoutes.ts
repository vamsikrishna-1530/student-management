import { Router } from 'express';
import * as studentController from '../controllers/studentController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router.get('/stats/dashboard', authorize('admin', 'teacher'), studentController.getStats);

router
  .route('/')
  .get(authorize('admin', 'teacher'), studentController.getStudents)
  .post(
    authorize('admin', 'teacher'),
    studentController.createStudentRules,
    validate,
    studentController.createStudent
  );

router
  .route('/:id')
  .get(authorize('admin', 'teacher', 'student'), studentController.getStudent)
  .put(authorize('admin', 'teacher'), studentController.updateStudent)
  .delete(authorize('admin'), studentController.deleteStudent);

export default router;
