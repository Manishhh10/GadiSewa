import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { sendMail } from '../utils/mailer';
import { env } from '../config/env';

const hashToken = (raw: string) => crypto.createHash('sha256').update(raw).digest('hex');

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
    const token = signToken({ id: user.id, email: user.email, role: user.role });

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
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
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

    const token = signToken({ id: user.id, email: user.email, role: user.role });

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
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
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
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/auth/me  (protected)
 * Body: { fullName?, phone?, avatarUrl? } — the fields a user may edit about themselves.
 */
export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, phone, avatarUrl } = req.body;
    const user = await User.findById(req.userId);
    if (!user) throw new AppError('User not found', 404);

    if (fullName !== undefined) user.fullName = String(fullName).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (avatarUrl !== undefined) user.avatarUrl = String(avatarUrl);
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/auth/change-password  (protected)
 * Body: { currentPassword, newPassword }
 */
export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError('Current and new password are required', 400);
    }
    if (String(newPassword).length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    const user = await User.findById(req.userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    if (!(await user.comparePassword(currentPassword))) {
      throw new AppError('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Always responds success (doesn't reveal whether the email exists).
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) throw new AppError('Email is required', 400);

    const user = await User.findOne({ email });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = hashToken(rawToken);
      user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;
      await sendMail(
        user.email,
        'Reset your GadiSewa password',
        `<p>Hi ${user.fullName || user.username},</p>
         <p>Click the link below to reset your GadiSewa password. This link expires in 15 minutes.</p>
         <p><a href="${resetUrl}">${resetUrl}</a></p>
         <p>If you didn't request this, you can safely ignore this email.</p>`
      );
    }

    res.json({
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/reset-password
 * Body: { token, password }
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    if (!token || !password) throw new AppError('Token and new password are required', 400);
    if (String(password).length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) throw new AppError('This reset link is invalid or has expired', 400);

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset — you can now log in.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/send-otp  (protected) — email a 6-digit verification code
 */
export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw new AppError('User not found', 404);
    if (user.emailVerified) {
      res.json({ success: true, message: 'Email is already verified.' });
      return;
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.otpCode = hashToken(code);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendMail(
      user.email,
      'Your GadiSewa verification code',
      `<p>Hi ${user.fullName || user.username},</p>
       <p>Your GadiSewa verification code is:</p>
       <p style="font-size:28px;font-weight:bold;letter-spacing:4px;">${code}</p>
       <p>This code expires in 10 minutes.</p>`
    );

    res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/verify-otp  (protected)
 * Body: { code }
 */
export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.body;
    if (!code) throw new AppError('Code is required', 400);

    const user = await User.findById(req.userId).select('+otpCode +otpExpires');
    if (!user) throw new AppError('User not found', 404);

    if (
      !user.otpCode ||
      !user.otpExpires ||
      user.otpExpires < new Date() ||
      user.otpCode !== hashToken(String(code))
    ) {
      throw new AppError('That code is invalid or has expired', 400);
    }

    user.emailVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified!' });
  } catch (err) {
    next(err);
  }
}
