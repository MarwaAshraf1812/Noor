import express from 'express';
import { submitQuranSession, fetchQuranDashboard, updateQuranTargets } from './quran.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { checkLevelUp } from '../../middleware/checkLevelUp.middleware.js';

const router = express.Router();

router.use(authenticate, checkLevelUp);

router.get('/dashboard', fetchQuranDashboard);

router.post('/session', submitQuranSession);

router.put('/targets', updateQuranTargets);

export default router;