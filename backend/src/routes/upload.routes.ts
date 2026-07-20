import { Router } from 'express';
import { uploadImages } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, requireRole('vendor', 'admin'), upload.array('images', 5), uploadImages);

export default router;
