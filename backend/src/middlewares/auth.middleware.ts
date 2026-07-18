import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

/** Protect routes — requires a valid `Authorization: Bearer <token>` header. */
export function protect(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Not authorized, no token', 401);
    }
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    req.userId = payload.id;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Not authorized, token invalid', 401));
  }
}
