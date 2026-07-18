import { Router } from 'express';
import { getOverview } from '../controllers/stats.controller';

const router = Router();

router.get('/overview', getOverview); // GET /api/stats/overview

export default router;
