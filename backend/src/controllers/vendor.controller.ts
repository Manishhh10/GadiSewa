import { NextFunction, Request, Response } from 'express';
import { VendorApplication } from '../models/VendorApplication';
import { AppError } from '../utils/AppError';

/** POST /api/vendor/applications  (protected) */
export async function createApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, businessName, phone, vehicleCount, message, documentUrl } = req.body;
    if (!fullName || !businessName || !phone) {
      throw new AppError('fullName, businessName and phone are required', 400);
    }
    if (!documentUrl) {
      throw new AppError(
        'A government ID document (citizenship, passport or national ID) is required',
        400
      );
    }

    const application = await VendorApplication.create({
      user: req.userId,
      fullName,
      businessName,
      phone,
      vehicleCount: Number(vehicleCount) || 1,
      message: message || '',
      documentUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted',
      data: { application },
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/vendor/applications  (protected) — current user's applications */
export async function getMyApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const applications = await VendorApplication.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, message: 'Applications', data: { applications } });
  } catch (err) {
    next(err);
  }
}
