import { Router } from 'express';
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
  getVendorBookings,
  payBooking,
  updateBookingStatus,
} from '../controllers/booking.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// All booking routes require authentication.
router.use(protect);

router.post('/', createBooking); //        POST   /api/bookings
router.get('/', getMyBookings); //         GET    /api/bookings
router.get('/vendor', requireRole('vendor', 'admin'), getVendorBookings); // GET /api/bookings/vendor (must precede /:id)
router.get('/:id', getBookingById); //     GET    /api/bookings/:id
router.post('/:id/pay', payBooking); //    POST   /api/bookings/:id/pay
router.patch('/:id/status', requireRole('vendor', 'admin'), updateBookingStatus); // PATCH /api/bookings/:id/status
router.patch('/:id/cancel', cancelBooking); // PATCH /api/bookings/:id/cancel

export default router;
