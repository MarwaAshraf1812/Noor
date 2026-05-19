import express from 'express';
import { fetchAdhkarByCategory, submitAdhkarSession, fetchAdhkarDashboard } from './adhkar.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { checkLevelUp } from '../../middleware/checkLevelUp.middleware.js';

const router = express.Router();

router.use(authenticate, checkLevelUp);

router.get('/dashboard', fetchAdhkarDashboard);
router.get('/category/:category', fetchAdhkarByCategory);
router.post('/session', submitAdhkarSession);

export default router;
