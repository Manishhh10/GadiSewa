import { Router } from 'express';
import {
  createVehicle,
  getVehicleById,
  getVehicles,
} from '../controllers/vehicle.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getVehicles); //               GET  /api/vehicles
router.post('/', protect, createVehicle); //   POST /api/vehicles  (protected)
router.get('/:id', getVehicleById); //         GET  /api/vehicles/:id

export default router;
