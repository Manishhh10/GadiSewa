import { Router } from 'express';
import { uploadImages } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Any authenticated user can upload — renters need this to attach a vendor
// application's government ID before they hold the vendor role.
router.post('/', protect, upload.array('images', 5), uploadImages);

export default router;
