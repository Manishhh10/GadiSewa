import { NextFunction, Request, Response } from 'express';
import { Booking, BookingStatus } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { AppError } from '../utils/AppError';

const SERVICE_FEE_RATE = 0.04;
const CLEANING_FEE = 500;
const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed', 'active'];

const makeRef = () =>
  `GS-${Math.floor(100 + Math.random() * 900)}-${new Date().getFullYear()}`;

/** POST /api/bookings  (protected) */
export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { vehicleId, pickupDate, returnDate, pickupLocation } = req.body;
    if (!vehicleId || !pickupDate || !returnDate) {
      throw new AppError('vehicleId, pickupDate and returnDate are required', 400);
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new AppError('Vehicle not found', 404);

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));

    // Reject overlapping bookings for the same vehicle (no double-booking).
    const overlap = await Booking.findOne({
      vehicle: vehicle.id,
      status: { $in: ACTIVE_BOOKING_STATUSES },
      pickupDate: { $lt: end },
      returnDate: { $gt: start },
    });
    if (overlap) {
      throw new AppError('This vehicle is already booked for the selected dates', 409);
    }

    const baseAmount = days * vehicle.dailyRate;
    const serviceFee = Math.round(baseAmount * SERVICE_FEE_RATE);
    const totalAmount = baseAmount + serviceFee + CLEANING_FEE;

    const booking = await Booking.create({
      user: req.userId,
      vehicle: vehicle.id,
      pickupDate: start,
      returnDate: end,
      days,
      pickupLocation: pickupLocation || vehicle.location,
      baseAmount,
      serviceFee,
      cleaningFee: CLEANING_FEE,
      totalAmount,
      bookingRef: makeRef(),
    });

    await booking.populate('vehicle');
    res.status(201).json({ success: true, message: 'Booking created', data: { booking } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/bookings  (protected) — current user's bookings (as a renter) */
export async function getMyBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate({ path: 'vehicle', populate: { path: 'owner', select: 'fullName phone email' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Bookings fetched', data: { bookings } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/bookings/vendor  (protected, vendor/admin) — bookings for vehicles the vendor owns */
export async function getVendorBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const myVehicleIds = await Vehicle.find({ owner: req.userId }).distinct('_id');
    const bookings = await Booking.find({ vehicle: { $in: myVehicleIds } })
      .populate('vehicle')
      .populate('user', 'fullName username email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Vendor bookings fetched', data: { bookings } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/bookings/:id  (protected — renter who booked it, the vehicle's owner, or an admin) */
export async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'vehicle',
      populate: { path: 'owner', select: 'fullName phone email' },
    });
    if (!booking) throw new AppError('Booking not found', 404);

    const vehicle = booking.vehicle as unknown as { owner?: { _id?: unknown } | string };
    const ownerId =
      vehicle?.owner && typeof vehicle.owner === 'object' ? vehicle.owner._id : vehicle?.owner;
    const isRenter = booking.user.toString() === req.userId;
    const isOwner = ownerId && String(ownerId) === req.userId;
    const isAdmin = req.userRole === 'admin';
    if (!isRenter && !isOwner && !isAdmin) {
      throw new AppError('Booking not found', 404);
    }

    res.json({ success: true, message: 'Booking fetched', data: { booking } });
  } catch (err) {
    next(err);
  }
}

/** POST /api/bookings/:id/pay  (protected) — simulate eSewa payment */
export async function payBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
    if (!booking) throw new AppError('Booking not found', 404);

    if (booking.paymentStatus === 'paid') {
      throw new AppError('Booking is already paid', 400);
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    booking.transactionId = String(Math.floor(1_000_000 + Math.random() * 9_000_000));
    await booking.save();
    await booking.populate('vehicle');

    res.json({ success: true, message: 'Payment successful', data: { booking } });
  } catch (err) {
    next(err);
  }
}

const VENDOR_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active: ['completed'],
  completed: [],
  cancelled: [],
};

/** PATCH /api/bookings/:id/status  { status }  (protected, vehicle owner or admin) */
export async function updateBookingStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body as { status: BookingStatus };
    if (!status || !(status in VENDOR_TRANSITIONS)) {
      throw new AppError('A valid status is required', 400);
    }

    const booking = await Booking.findById(req.params.id).populate('vehicle');
    if (!booking) throw new AppError('Booking not found', 404);

    const vehicle = booking.vehicle as unknown as { owner?: { toString(): string } };
    const isOwner = vehicle?.owner && vehicle.owner.toString() === req.userId;
    if (!isOwner && req.userRole !== 'admin') {
      throw new AppError('You do not have permission to update this booking', 403);
    }

    const allowed = VENDOR_TRANSITIONS[booking.status];
    if (!allowed.includes(status)) {
      throw new AppError(`Cannot move a ${booking.status} booking to ${status}`, 400);
    }

    booking.status = status;
    await booking.save();
    res.json({ success: true, message: `Booking ${status}`, data: { booking } });
  } catch (err) {
    next(err);
  }
}

/** PATCH /api/bookings/:id/cancel  (protected, the renter who made the booking) */
export async function cancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
    if (!booking) throw new AppError('Booking not found', 404);

    if (!['pending', 'confirmed'].includes(booking.status)) {
      throw new AppError(`A ${booking.status} booking cannot be cancelled`, 400);
    }

    booking.status = 'cancelled';
    await booking.save();
    await booking.populate('vehicle');
    res.json({ success: true, message: 'Booking cancelled', data: { booking } });
  } catch (err) {
    next(err);
  }
}
