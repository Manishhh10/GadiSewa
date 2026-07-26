'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RequireRole from '@/components/auth/RequireRole';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookingById, updateBookingStatus } from '@/store/actions/bookingActions';
import { fmtDate, rs } from '@/lib/format';
import { useToast } from '@/lib/toast/ToastContext';
import type { BookingStatus } from '@/types/booking';

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

const statusStyle: Record<BookingStatus, string> = {
  pending: 'bg-primary-container/15 text-primary',
  confirmed: 'bg-tertiary-container/20 text-tertiary',
  active: 'bg-tertiary-container/20 text-tertiary',
  completed: 'bg-surface-container-high text-on-surface-variant',
  cancelled: 'bg-error-container text-on-error-container',
};

const ACTION_LABELS: Record<string, string> = {
  confirmed: 'Booking accepted.',
  cancelled: 'Booking declined.',
  active: 'Trip started.',
  completed: 'Trip marked complete — the renter can now leave a review.',
};

export default function VendorBookingDetailPage() {
  return (
    <RequireRole roles={['vendor', 'admin']}>
      <VendorBookingDetailContent />
    </RequireRole>
  );
}

function VendorBookingDetailContent() {
  const params = useParams();
  const id = String(params.id);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { current: b, loading, error } = useAppSelector((s) => s.bookings);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  const act = async (status: 'confirmed' | 'active' | 'completed' | 'cancelled') => {
    setActing(true);
    const result = await dispatch(updateBookingStatus({ id, status }));
    setActing(false);
    if (updateBookingStatus.fulfilled.match(result)) {
      toast.success(ACTION_LABELS[status] ?? 'Booking updated.');
    } else {
      toast.error(result.payload ?? 'Could not update this booking.');
    }
  };

  const renter = b && typeof b.user === 'object' ? b.user : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-[900px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <Link
          href="/vendor"
          className="flex items-center gap-1 text-primary mb-4 font-label-md text-label-md hover:underline w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Vendor Dashboard
        </Link>

        {loading && <p className="font-body-md text-on-surface-variant">Loading booking…</p>}
        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">{error}</div>
        )}

        {b && !loading && (
          <div className="space-y-stack-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Booking {b.bookingRef}</h1>
                <p className="font-body-md text-on-surface-variant">Placed {fmtDate(b.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full font-label-md text-label-md capitalize ${statusStyle[b.status]}`}>
                {b.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
              {/* Vehicle */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="h-40 bg-surface-container flex items-center justify-center">
                  {b.vehicle ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.vehicle.imageUrl} alt={b.vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-outline">directions_car</span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-headline-sm text-headline-sm mb-1">
                    {b.vehicle?.name ?? <span className="italic text-on-surface-variant">Listing removed</span>}
                  </h2>
                  {b.vehicle && <p className="font-body-sm text-body-sm text-on-surface-variant">{b.vehicle.type}</p>}
                </div>
              </section>

              {/* Renter */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-3">
                <h2 className="font-headline-sm text-headline-sm mb-1">Renter</h2>
                <div className="flex items-center gap-2 font-label-md text-label-md text-on-surface">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
                  {renter?.fullName || renter?.username || 'Renter'}
                </div>
                {renter?.phone ? (
                  <a href={`tel:${renter.phone}`} className="flex items-center gap-2 font-body-sm text-body-sm text-primary hover:underline">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    {renter.phone}
                  </a>
                ) : (
                  <p className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    No phone on file
                  </p>
                )}
                {renter?.email ? (
                  <a href={`mailto:${renter.email}`} className="flex items-center gap-2 font-body-sm text-body-sm text-primary hover:underline">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    {renter.email}
                  </a>
                ) : null}
              </section>
            </div>

            {/* Trip details */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-4">
              <h2 className="font-headline-sm text-headline-sm">Trip Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Pickup" value={fmtDate(b.pickupDate)} />
                <Field label="Return" value={fmtDate(b.returnDate)} />
                <Field label="Duration" value={`${b.days} day${b.days === 1 ? '' : 's'}`} />
              </div>
              <Field label="Pickup Location" value={b.pickupLocation} />
            </section>

            {/* Payment */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-3">
              <h2 className="font-headline-sm text-headline-sm mb-1">Payment</h2>
              <Row label="Base amount" value={rs(b.baseAmount)} />
              <Row label="Service fee" value={rs(b.serviceFee)} />
              <Row label="Cleaning fee" value={rs(b.cleaningFee)} />
              <div className="border-t border-outline-variant pt-3 flex justify-between items-baseline">
                <span className="font-headline-sm text-headline-sm">Total</span>
                <span className="font-headline-sm text-headline-sm text-primary">{rs(b.totalAmount)}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                    b.paymentStatus === 'paid'
                      ? 'bg-tertiary-container/20 text-tertiary'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  {b.paymentStatus}
                </span>
                {b.transactionId && (
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Txn: {b.transactionId}</span>
                )}
              </div>
            </section>

            {/* Actions */}
            {(b.status === 'pending' || b.status === 'confirmed' || b.status === 'active') && (
              <section className="flex flex-wrap gap-3">
                {b.status === 'pending' && (
                  <>
                    <button
                      disabled={acting}
                      onClick={() => act('confirmed')}
                      className="bg-tertiary text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]" style={FILLED}>check_circle</span>
                      Accept Booking
                    </button>
                    <button
                      disabled={acting}
                      onClick={() => act('cancelled')}
                      className="bg-error text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </>
                )}
                {b.status === 'confirmed' && (
                  <button
                    disabled={acting}
                    onClick={() => act('active')}
                    className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    Start Trip
                  </button>
                )}
                {b.status === 'active' && (
                  <button
                    disabled={acting}
                    onClick={() => act('completed')}
                    className="bg-tertiary text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors disabled:opacity-50"
                  >
                    Complete Trip
                  </button>
                )}
              </section>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wide mb-0.5">{label}</p>
      <p className="font-label-md text-label-md text-on-surface">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between font-body-sm text-body-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className="text-on-surface">{value}</span>
    </div>
  );
}
