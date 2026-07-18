import { Router } from 'express';
import {
  createVehicle,
  getVehicleById,
  getVehicles,
} from '../controllers/vehicle.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getVehicles); //               GET  /api/vehicles
router.post('/', protect, requireRole('vendor', 'admin'), createVehicle); // POST /api/vehicles (vendor/admin)
router.get('/:id', getVehicleById); //         GET  /api/vehicles/:id

export default router;
