import { Router } from 'express';
import { createIssue } from '../controllers/issue.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createIssue); // POST /api/issues

export default router;
