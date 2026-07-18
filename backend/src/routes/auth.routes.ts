import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register); // POST /api/auth/register
router.post('/login', login); //       POST /api/auth/login
router.get('/me', protect, me); //     GET  /api/auth/me  (protected)

export default router;
