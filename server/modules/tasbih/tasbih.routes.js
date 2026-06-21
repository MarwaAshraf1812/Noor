import express from 'express';
import { submitTasbihSession, fetchTasbihDashboard } from './tasbih.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { checkLevelUp } from '../../middleware/checkLevelUp.middleware.js';

const router = express.Router();

router.use(authenticate, checkLevelUp);

router.get('/dashboard', fetchTasbihDashboard);
router.post('/session', submitTasbihSession);

export default router;
