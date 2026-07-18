import { Router } from 'express';
import { handleEsewaFailure, handleEsewaSuccess } from '../controllers/payment.controller';

const router = Router();

// Public — these are eSewa's own redirect targets, hit by the user's browser.
router.get('/esewa/success', handleEsewaSuccess);
router.get('/esewa/failure', handleEsewaFailure);

export default router;
