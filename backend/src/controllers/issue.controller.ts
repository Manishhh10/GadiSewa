import { NextFunction, Request, Response } from 'express';
import { Issue } from '../models/Issue';
import { Dispute } from '../models/Dispute';
import { Booking } from '../models/Booking';
import { AppError } from '../utils/AppError';

/**
 * POST /api/issues  (protected)
 * Body: { category, description, bookingRef? }
 * If the bookingRef matches a real booking of the reporter's, also opens a
 * Dispute so admins can mediate between the renter and vendor.
 */
export async function createIssue(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, description, bookingRef } = req.body;
    if (!category || !description) {
      throw new AppError('category and description are required', 400);
    }

    const issue = await Issue.create({
      user: req.userId,
      category,
      description,
      bookingRef: bookingRef || '',
    });

    if (bookingRef) {
      const booking = await Booking.findOne({ bookingRef, user: req.userId }).populate('vehicle');
      if (booking) {
        const vehicle = booking.vehicle as unknown as { owner?: unknown };
        await Dispute.create({
          booking: booking.id,
          renter: req.userId,
          vendor: vehicle?.owner,
          issue: description,
          amount: booking.totalAmount,
        });
      }
    }

    res.status(201).json({ success: true, message: 'Issue reported', data: { issue } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/admin/issues */
export async function getAllIssues(req: Request, res: Response, next: NextFunction) {
  try {
    const issues = await Issue.find()
      .populate('user', 'fullName username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Issues fetched', data: { issues } });
  } catch (err) {
    next(err);
  }
}
