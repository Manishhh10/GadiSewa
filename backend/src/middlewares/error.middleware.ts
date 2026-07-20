import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';

/** 404 handler — reached when no route matched. */
export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}

/** Global error handler — turns any thrown error into a JSON envelope. */
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose duplicate key (e.g. email/username already taken)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] ?? 'field';
    message = `${field} already exists`;
  }

  // Mongoose schema validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');
  }

  // Multer upload errors (file too large, too many files, bad type from fileFilter)
  if (err.name === 'MulterError' || message === 'Only JPEG, PNG and WEBP images are allowed') {
    statusCode = 400;
  }

  if (env_isDev()) console.error('💥', err);

  res.status(statusCode).json({ success: false, message });
}

function env_isDev() {
  return (process.env.NODE_ENV ?? 'development') !== 'production';
}
