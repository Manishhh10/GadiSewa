import { Router } from 'express';
import authRoutes from './auth.routes';
import vehicleRoutes from './vehicle.routes';
import bookingRoutes from './booking.routes';
import statsRoutes from './stats.routes';
import vendorRoutes from './vendor.routes';
import adminRoutes from './admin.routes';
import reviewRoutes from './review.routes';
import paymentRoutes from './payment.routes';
import issueRoutes from './issue.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'GadiSewa API is running 🚗' });
});

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/stats', statsRoutes);
router.use('/vendor', vendorRoutes);
router.use('/admin', adminRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payments', paymentRoutes);
router.use('/issues', issueRoutes);

export default router;
