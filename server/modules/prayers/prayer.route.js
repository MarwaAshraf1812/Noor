import { Router } from 'express';
import { recordPrayerHandler, getDashboardHandler } from './prayer.controller.js';
import { checkLevelUp } from '../../middleware/checkLevelUp.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, checkLevelUp);

router.post('/record', recordPrayerHandler);
router.get('/dashboard', getDashboardHandler);

export default router;
