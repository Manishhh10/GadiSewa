import { Router } from 'express';
import {
  getApplications,
  getVehiclesForReview,
  updateApplication,
  verifyVehicle,
} from '../controllers/admin.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect, requireRole('admin'));

router.get('/applications', getApplications);
router.patch('/applications/:id', updateApplication);
router.get('/vehicles', getVehiclesForReview);
router.patch('/vehicles/:id/verify', verifyVehicle);

export default router;
