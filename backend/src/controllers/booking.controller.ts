import { NextFunction, Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Vehicle } from '../models/Vehicle';
import { AppError } from '../utils/AppError';

const SERVICE_FEE_RATE = 0.04;
const CLEANING_FEE = 500;

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

/** GET /api/bookings  (protected) — current user's bookings */
export async function getMyBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('vehicle')
      .sort({ createdAt: -1 });
    res.json({ success: true, message: 'Bookings fetched', data: { bookings } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/bookings/:id  (protected) */
export async function getBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate('vehicle');
    if (!booking) throw new AppError('Booking not found', 404);
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
