import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { User } from '../models/User';

/**
 * Protect routes — requires a valid `Authorization: Bearer <token>` header.
 * The role is re-read from the database on every request (not trusted from
 * the JWT payload) so a role change — e.g. a vendor application being
 * approved — takes effect immediately, without waiting for the user to log
 * back in for a fresh token.
 */
export async function protect(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Not authorized, no token', 401);
    }
    const token = header.split(' ')[1];
    const payload = verifyToken(token);

    const user = await User.findById(payload.id).select('role email');
    if (!user) throw new AppError('Not authorized, user no longer exists', 401);

    req.userId = payload.id;
    req.userEmail = user.email;
    req.userRole = user.role;
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Not authorized, token invalid', 401));
  }
}

/** Restrict a route to specific roles. Must run after `protect`. */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
}
