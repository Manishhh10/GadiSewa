import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

/** POST /api/uploads  (protected, vendor/admin) — multipart field "images", up to 5 */
export function uploadImages(req: Request, res: Response, next: NextFunction) {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) throw new AppError('No files uploaded', 400);

    const urls = files.map((f) => `${env.API_BASE_URL}/uploads/${f.filename}`);
    res.status(201).json({ success: true, message: 'Images uploaded', data: { urls } });
  } catch (err) {
    next(err);
  }
}
