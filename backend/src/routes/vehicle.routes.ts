import { Router } from 'express';
import {
  createVehicle,
  deleteVehicle,
  getMyVehicles,
  getVehicleById,
  getVehicles,
  updateVehicle,
} from '../controllers/vehicle.controller';
import { getVehicleReviews } from '../controllers/review.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getVehicles); //               GET  /api/vehicles
router.get('/mine', protect, getMyVehicles); // GET  /api/vehicles/mine (must precede /:id)
router.post('/', protect, requireRole('vendor', 'admin'), createVehicle); // POST /api/vehicles (vendor/admin)
router.get('/:id', getVehicleById); //         GET  /api/vehicles/:id
router.get('/:id/reviews', getVehicleReviews); // GET /api/vehicles/:id/reviews
router.patch('/:id', protect, requireRole('vendor', 'admin'), updateVehicle); // PATCH /api/vehicles/:id
router.delete('/:id', protect, requireRole('vendor', 'admin'), deleteVehicle); // DELETE /api/vehicles/:id

export default router;
