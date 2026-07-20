import { Router } from 'express';
import { geocodeReverse, geocodeSearch } from '../controllers/geocode.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Protected (not public) mainly to keep this free third-party geocoder from
// being hammered anonymously — any logged-in user can use it.
router.get('/search', protect, geocodeSearch);
router.get('/reverse', protect, geocodeReverse);

export default router;
