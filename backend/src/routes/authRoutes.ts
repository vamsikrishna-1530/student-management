import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/config', authController.getPublicConfig);

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

// Admin refreshes the official org showcase DB used in classroom demos.
router.post(
  '/sync-org-db',
  protect,
  authorize('admin'),
  authController.syncOrgDatabase
);

export default router;
