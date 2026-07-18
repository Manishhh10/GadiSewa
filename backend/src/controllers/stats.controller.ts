import { NextFunction, Request, Response } from 'express';
import { Booking, BookingStatus } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { User } from '../models/User';

/** GET /api/stats/overview — real platform aggregates for the dashboards. */
export async function getOverview(_req: Request, res: Response, next: NextFunction) {
  try {
    const [vehicles, users, bookings, agg] = await Promise.all([
      Vehicle.countDocuments(),
      User.countDocuments(),
      Booking.find().select('status totalAmount paymentStatus'),
      Vehicle.aggregate<{ _id: null; avg: number }>([
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
    ]);

    const byStatus: Record<BookingStatus, number> = {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
    };
    let revenue = 0;
    for (const b of bookings) {
      byStatus[b.status] += 1;
      if (b.paymentStatus === 'paid') revenue += b.totalAmount;
    }

    res.json({
      success: true,
      message: 'Overview',
      data: {
        stats: {
          vehicles,
          users,
          bookings: { total: bookings.length, ...byStatus },
          revenue,
          avgRating: agg[0]?.avg ? Math.round(agg[0].avg * 10) / 10 : 0,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
