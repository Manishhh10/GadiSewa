import { Router } from 'express';
import {
  getApplications,
  getVehiclesForReview,
  updateApplication,
  verifyVehicle,
} from '../controllers/admin.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// NOTE: protected (logged-in). Role-gating to 'admin' can be added here once an
// admin account exists — kept open for the demo so the panel is usable.
router.use(protect);

router.get('/applications', getApplications);
router.patch('/applications/:id', updateApplication);
router.get('/vehicles', getVehiclesForReview);
router.patch('/vehicles/:id/verify', verifyVehicle);

export default router;
