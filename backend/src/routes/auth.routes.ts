import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  login,
  me,
  register,
  resetPassword,
  sendOtp,
  updateMe,
  verifyOtp,
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register); //               POST /api/auth/register
router.post('/login', login); //                      POST /api/auth/login
router.get('/me', protect, me); //                    GET  /api/auth/me  (protected)
router.patch('/me', protect, updateMe); //             PATCH /api/auth/me  (protected)
router.patch('/change-password', protect, changePassword); // PATCH /api/auth/change-password (protected)
router.post('/forgot-password', forgotPassword); //   POST /api/auth/forgot-password
router.post('/reset-password', resetPassword); //     POST /api/auth/reset-password
router.post('/send-otp', protect, sendOtp); //         POST /api/auth/send-otp  (protected)
router.post('/verify-otp', protect, verifyOtp); //     POST /api/auth/verify-otp  (protected)

export default router;
