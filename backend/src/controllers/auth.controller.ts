import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

/**
 * POST /api/auth/register
 * Body: { email, username, password, confirmPassword? }
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, phone, password, confirmPassword, username } = req.body;

    if (!fullName || !email || !password) {
      throw new AppError('Full name, email and password are required', 400);
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw new AppError('A user with this email already exists', 409);
    }

    // Derive a unique username (the new sign-up form collects full name + phone instead).
    const base =
      (username || String(email).split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) ||
      'user';
    const finalUsername = `${base}_${Math.random().toString(36).slice(2, 6)}`;

    const user = await User.create({
      fullName,
      email,
      phone: phone || '',
      password,
      username: finalUsername,
    });
    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({ id: user.id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me  (protected)
 * Returns the current user — used by the frontend to rehydrate auth state.
 */
export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError('User not found', 404);

    res.json({
      success: true,
      message: 'Current user',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
