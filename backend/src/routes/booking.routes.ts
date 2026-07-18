import { Router } from 'express';
import {
  createBooking,
  getBookingById,
  getMyBookings,
  payBooking,
} from '../controllers/booking.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// All booking routes require authentication.
router.use(protect);

router.post('/', createBooking); //        POST   /api/bookings
router.get('/', getMyBookings); //         GET    /api/bookings
router.get('/:id', getBookingById); //     GET    /api/bookings/:id
router.post('/:id/pay', payBooking); //    POST   /api/bookings/:id/pay

export default router;
