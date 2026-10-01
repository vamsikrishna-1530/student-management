import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  authController.registerRules,
  validate,
  authController.register
);

router.post(
  '/login',
  authController.loginRules,
  validate,
  authController.login
);

router.get('/me', protect, authController.me);

export default router;
