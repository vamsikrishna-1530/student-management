import { Router } from 'express';
import * as courseController from '../controllers/courseController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(courseController.getCourses)
  .post(
    authorize('admin', 'teacher'),
    courseController.createCourseRules,
    validate,
    courseController.createCourse
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(authorize('admin', 'teacher'), courseController.updateCourse)
  .delete(authorize('admin'), courseController.deleteCourse);

export default router;
