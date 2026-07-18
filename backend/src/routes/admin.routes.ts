import { Router } from 'express';
import {
  getApplications,
  getVehiclesForReview,
  updateApplication,
  verifyVehicle,
} from '../controllers/admin.controller';
import { getAllReviews, setReviewHidden } from '../controllers/review.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect, requireRole('admin'));

router.get('/applications', getApplications);
router.patch('/applications/:id', updateApplication);
router.get('/vehicles', getVehiclesForReview);
router.patch('/vehicles/:id/verify', verifyVehicle);
router.get('/reviews', getAllReviews);
router.patch('/reviews/:id', setReviewHidden);

export default router;
