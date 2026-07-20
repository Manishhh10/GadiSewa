import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { Review } from '../models/Review';
import { Booking } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { AppError } from '../utils/AppError';

/** Recompute a vehicle's rating/reviewsCount from its visible reviews. */
async function recomputeVehicleRating(vehicleId: string) {
  const stats = await Review.aggregate([
    { $match: { vehicle: new Types.ObjectId(vehicleId), hidden: false } },
    { $group: { _id: '$vehicle', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Vehicle.findByIdAndUpdate(vehicleId, {
    rating: Math.round(avg * 10) / 10,
    reviewsCount: count,
  });
}

/** POST /api/reviews  (protected) — leave a review for a completed booking */
export async function createReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId, rating, comment } = req.body;
    if (!bookingId || !rating) {
      throw new AppError('bookingId and rating are required', 400);
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      throw new AppError('rating must be between 1 and 5', 400);
    }

    const booking = await Booking.findOne({ _id: bookingId, user: req.userId });
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.status !== 'completed') {
      throw new AppError('You can only review a completed booking', 400);
    }

    const existing = await Review.findOne({ booking: bookingId });
    if (existing) throw new AppError('You have already reviewed this booking', 409);

    const review = await Review.create({
      booking: bookingId,
      vehicle: booking.vehicle,
      user: req.userId,
      rating: Number(rating),
      comment: comment || '',
    });

    await recomputeVehicleRating(String(booking.vehicle));

    res.status(201).json({ success: true, message: 'Review submitted', data: { review } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/vehicles/:id/reviews — visible reviews for a vehicle */
export async function getVehicleReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const reviews = await Review.find({ vehicle: req.params.id, hidden: false })
      .populate('user', 'fullName username')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Reviews fetched', data: { reviews } });
  } catch (err) {
    next(err);
  }
}
