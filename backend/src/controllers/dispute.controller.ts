import { NextFunction, Request, Response } from 'express';
import { Dispute, DisputeResolution } from '../models/Dispute';
import { AppError } from '../utils/AppError';

/** GET /api/admin/disputes */
export async function getAllDisputes(req: Request, res: Response, next: NextFunction) {
  try {
    const disputes = await Dispute.find()
      .populate('booking', 'bookingRef totalAmount')
      .populate('renter', 'fullName username')
      .populate('vendor', 'fullName username')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Disputes fetched', data: { disputes } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/admin/disputes/:id  { resolution: 'refund_renter' | 'side_with_vendor' } */
export async function resolveDispute(req: Request, res: Response, next: NextFunction) {
  try {
    const { resolution } = req.body as { resolution: DisputeResolution };
    if (!['refund_renter', 'side_with_vendor'].includes(resolution)) {
      throw new AppError('resolution must be refund_renter or side_with_vendor', 400);
    }

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) throw new AppError('Dispute not found', 404);
    if (dispute.status === 'resolved') {
      throw new AppError('This dispute has already been resolved', 400);
    }

    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolvedAt = new Date();
    await dispute.save();

    res.json({ success: true, message: 'Dispute resolved', data: { dispute } });
  } catch (err) {
    next(err);
  }
}
