import { Router } from 'express';
import {
  createApplication,
  getMyApplications,
} from '../controllers/vendor.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/applications', createApplication); // POST /api/vendor/applications
router.get('/applications', getMyApplications); //  GET  /api/vendor/applications

export default router;
