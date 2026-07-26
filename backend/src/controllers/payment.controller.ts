import { NextFunction, Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { buildEsewaPaymentForm, decodeEsewaCallback, verifyEsewaCallback } from '../utils/esewa';
import { sendMail } from '../utils/mailer';
import { bookingConfirmationEmail } from '../utils/emailTemplates';

/** POST /api/bookings/:id/esewa/initiate  (protected) — start a real eSewa UAT payment */
export async function initiateEsewaPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId }).populate('vehicle');
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.paymentStatus === 'paid') {
      throw new AppError('Booking is already paid', 400);
    }
    if (booking.status === 'cancelled') {
      throw new AppError('This booking was cancelled and can no longer be paid.', 400);
    }
    if (!booking.vehicle) {
      throw new AppError(
        'This vehicle listing is no longer available. Please cancel this booking.',
        400
      );
    }
    if (booking.returnDate.getTime() < Date.now()) {
      throw new AppError(
        'The rental dates for this booking have passed. Please cancel it.',
        400
      );
    }

    // Unique per attempt (not just per booking) so retrying after a failed/abandoned
    // attempt gets a fresh transaction_uuid, while still letting us map the callback
    // back to this exact booking.
    const transactionUuid = `${booking.id}-${Date.now()}`;
    booking.esewaTransactionUuid = transactionUuid;
    await booking.save();

    const { url, fields } = buildEsewaPaymentForm({
      totalAmount: booking.totalAmount,
      transactionUuid,
      successUrl: `${env.API_BASE_URL}/api/payments/esewa/success`,
      failureUrl: `${env.API_BASE_URL}/api/payments/esewa/failure?bookingId=${booking.id}`,
    });

    res.json({ success: true, message: 'eSewa payment initiated', data: { url, fields } });
  } catch (err) {
    next(err);
  }
}

/** GET /api/payments/esewa/success  (public — eSewa redirects the browser here) */
export async function handleEsewaSuccess(req: Request, res: Response) {
  try {
    const data = String(req.query.data ?? '');
    if (!data) throw new Error('Missing data param');

    const payload = decodeEsewaCallback(data);

    // Authoritative check: the payload is HMAC-signed by eSewa with our shared
    // secret, so a valid signature proves it wasn't forged or tampered with.
    if (!verifyEsewaCallback(payload)) {
      throw new Error('Signature verification failed');
    }
    if (payload.status !== 'COMPLETE') {
      throw new Error(`Unexpected status: ${payload.status}`);
    }

    const booking = await Booking.findOne({ esewaTransactionUuid: payload.transaction_uuid })
      .populate('vehicle')
      .populate('user', 'email fullName username');
    if (!booking) throw new Error('No matching booking for this transaction');

    // Defense in depth: the paid amount must match what we asked for.
    if (Number(payload.total_amount) !== booking.totalAmount) {
      throw new Error('Amount mismatch');
    }

    // Idempotent — a page refresh or duplicate callback shouldn't double-process.
    if (booking.paymentStatus !== 'paid') {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.transactionId = payload.transaction_code;
      await booking.save();

      const vehicle = booking.vehicle as unknown as { name: string };
      const renter = booking.user as unknown as { email: string };
      sendMail(
        renter.email,
        'Booking Confirmed — GadiSewa',
        bookingConfirmationEmail({
          vehicleName: vehicle.name,
          bookingRef: booking.bookingRef,
          pickupDate: booking.pickupDate.toDateString(),
          returnDate: booking.returnDate.toDateString(),
          totalAmount: booking.totalAmount,
        })
      ).catch((err) => console.error('Failed to send booking confirmation email:', err));
    }

    res.redirect(302, `${env.CLIENT_URL}/booking/${booking.id}/success`);
  } catch (err) {
    console.error('eSewa success callback failed:', err);
    res.redirect(302, `${env.CLIENT_URL}/?paymentError=1`);
  }
}

/** GET /api/payments/esewa/failure  (public — eSewa redirects here on cancel/failure) */
export async function handleEsewaFailure(req: Request, res: Response) {
  const bookingId = String(req.query.bookingId ?? '');
  const target = bookingId
    ? `${env.CLIENT_URL}/booking/${bookingId}/payment?failed=1`
    : `${env.CLIENT_URL}/?paymentError=1`;
  res.redirect(302, target);
}
