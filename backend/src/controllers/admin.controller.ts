import { NextFunction, Request, Response } from 'express';
import { VendorApplication } from '../models/VendorApplication';
import { Vehicle } from '../models/Vehicle';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';

/** GET /api/admin/applications?status=pending */
export async function getApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await VendorApplication.find(filter)
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Applications', data: { applications } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/admin/applications/:id  { status } — approve/reject (approve promotes user to vendor) */
export async function updateApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new AppError('status must be approved, rejected or pending', 400);
    }
    const application = await VendorApplication.findById(req.params.id);
    if (!application) throw new AppError('Application not found', 404);

    application.status = status;
    await application.save();

    if (status === 'approved') {
      await User.findByIdAndUpdate(application.user, { role: 'vendor' });
    }

    res.json({ success: true, message: `Application ${status}`, data: { application } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/admin/vehicles — all vehicles for moderation (with owner) */
export async function getVehiclesForReview(_req: Request, res: Response, next: NextFunction) {
  try {
    const vehicles = await Vehicle.find()
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Vehicles', data: { vehicles } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/admin/vehicles/:id/verify  { verified } */
export async function verifyVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const verified = Boolean(req.body.verified);
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { verified },
      { new: true }
    );
    if (!vehicle) throw new AppError('Vehicle not found', 404);
    res.json({
      success: true,
      message: verified ? 'Vehicle approved' : 'Vehicle unverified',
      data: { vehicle },
    });
  } catch (err) {
    next(err);
  }
}
