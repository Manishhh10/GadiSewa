import { Router } from 'express';
import { getOverview, getVendorOverview } from '../controllers/stats.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/overview', getOverview); //         GET /api/stats/overview
router.get('/vendor', protect, requireRole('vendor', 'admin'), getVendorOverview); // GET /api/stats/vendor

export default router;
