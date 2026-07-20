import { NextFunction, Request, Response } from 'express';
import { VendorApplication } from '../models/VendorApplication';
import { Vehicle } from '../models/Vehicle';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { sendMail } from '../utils/mailer';
import { vendorApprovedEmail, vendorRejectedEmail } from '../utils/emailTemplates';

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

/** PATCH /api/admin/applications/:id  { status, reason? } — approve/reject (approve promotes user to vendor) */
export async function updateApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, reason } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      throw new AppError('status must be approved, rejected or pending', 400);
    }
    if (status === 'rejected' && !String(reason || '').trim()) {
      throw new AppError('A reason is required when rejecting an application', 400);
    }

    const application = await VendorApplication.findById(req.params.id);
    if (!application) throw new AppError('Application not found', 404);

    application.status = status;
    application.rejectionReason = status === 'rejected' ? String(reason).trim() : undefined;
    await application.save();

    const user = await User.findById(application.user);
    if (status === 'approved' && user) {
      await User.findByIdAndUpdate(application.user, { role: 'vendor' });
      sendMail(user.email, "You're a Verified Vendor! — GadiSewa", vendorApprovedEmail()).catch(
        (err) => console.error('Failed to send vendor-approved email:', err)
      );
    } else if (status === 'rejected' && user) {
      sendMail(
        user.email,
        'Your GadiSewa vendor application',
        vendorRejectedEmail(application.rejectionReason || '')
      ).catch((err) => console.error('Failed to send vendor-rejected email:', err));
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
