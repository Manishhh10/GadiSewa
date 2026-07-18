'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cancelBooking, fetchMyBookings } from '@/store/actions/bookingActions';
import { fmtDate, rs } from '@/lib/format';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { reviewApi } from '@/api/review.api';
import type { NormalizedError } from '@/lib/axios';
import type { Booking, BookingStatus } from '@/types/booking';

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

const statusStyle: Record<BookingStatus, string> = {
  pending: 'bg-primary-container/15 text-primary',
  confirmed: 'bg-tertiary-container/20 text-tertiary',
  active: 'bg-tertiary-container/20 text-tertiary',
  completed: 'bg-surface-container-high text-on-surface-variant',
  cancelled: 'bg-error-container text-on-error-container',
};

export default function MyBookingsPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { items, loading, error } = useAppSelector((s) => s.bookings);
  const user = useAppSelector((s) => s.auth.user);
  const [tab, setTab] = useState<'all' | BookingStatus>('all');

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const TABS: { key: 'all' | BookingStatus; label: string }[] = [
    { key: 'all', label: t('bookings.all') },
    { key: 'pending', label: t('bookings.pending') },
    { key: 'confirmed', label: t('bookings.confirmed') },
    { key: 'completed', label: t('bookings.completed') },
    { key: 'cancelled', label: t('bookings.cancelled') },
  ];

  const filtered = tab === 'all' ? items : items.filter((b) => b.status === tab);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="mb-stack-lg">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">{t('bookings.title')}</h1>
          <p className="font-body-md text-on-surface-variant">
            {t('bookings.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-variant mb-stack-lg overflow-x-auto whitespace-nowrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-4 font-label-md text-label-md transition-all ${
                tab === t.key
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <p className="font-body-md text-on-surface-variant">{t('bookings.loadingBookings')}</p>}

        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">
            {error}
            {!user && (
              <Link href="/login" className="text-primary font-semibold underline ml-2">Login</Link>
            )}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-stack-lg text-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">add</span>
            </div>
            <p className="font-headline-md text-headline-md text-on-surface">{t('bookings.noBookingsYet')}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              {t('bookings.findBestDeals')}
            </p>
            <Link
              href="/"
              className="mt-4 bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all"
            >
              {t('bookings.bookARide')}
            </Link>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
            {filtered.map((b) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function BookingCard({ booking: b }: { booking: Booking }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [cancelling, setCancelling] = useState(false);
  const canCancel = b.status === 'pending' || b.status === 'confirmed';

  const onCancel = async () => {
    if (!window.confirm(t('bookings.cancelConfirm'))) return;
    setCancelling(true);
    await dispatch(cancelBooking(b._id));
    setCancelling(false);
  };

  return (
    <div className="bg-surface-container-low rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] overflow-hidden border border-transparent hover:border-primary/20 transition-all flex flex-col">
      <div className="relative h-48 w-full bg-surface-dim">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.vehicle.imageUrl} alt={b.vehicle.name} className="w-full h-full object-cover" />
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-md font-label-md text-xs capitalize ${statusStyle[b.status]}`}
        >
          <span className="material-symbols-outlined text-[16px]" style={FILLED}>
            {b.status === 'cancelled' ? 'cancel' : 'check_circle'}
          </span>
          {t(`bookings.${b.status}`)}
        </div>
      </div>
      <div className="p-stack-md flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline-md text-headline-md">{b.vehicle.name}</h3>
          <span className="font-headline-sm text-headline-sm text-primary">{rs(b.totalAmount)}</span>
        </div>
        <p className="text-xs text-on-surface-variant mb-3">{t('bookings.ref')} {b.bookingRef}</p>
        <div className="space-y-2 mb-4 text-on-surface-variant text-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>{fmtDate(b.pickupDate)} – {fmtDate(b.returnDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">pin_drop</span>
            <span>{b.pickupLocation}</span>
          </div>
        </div>
        <div className="mt-auto space-y-2">
          <Link
            href={`/booking/${b._id}`}
            className="block w-full text-center bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
          >
            {t('bookings.viewDetails')}
          </Link>
          {canCancel && (
            <button
              onClick={onCancel}
              disabled={cancelling}
              className="block w-full text-center border border-error text-error py-3 rounded-lg font-label-md text-label-md hover:bg-error/5 transition-all disabled:opacity-50"
            >
              {t('bookings.cancelBooking')}
            </button>
          )}
          {b.status === 'completed' && <ReviewPrompt bookingId={b._id} />}
        </div>
      </div>
    </div>
  );
}

function ReviewPrompt({ bookingId }: { bookingId: string }) {
  const [mode, setMode] = useState<'idle' | 'form' | 'done' | 'already'>('idle');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await reviewApi.create({ bookingId, rating, comment: comment || undefined });
      setMode('done');
    } catch (err) {
      const status = (err as NormalizedError).status;
      if (status === 409) {
        setMode('already');
      } else {
        setError((err as NormalizedError).message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'done') {
    return <p className="text-center font-body-sm text-body-sm text-tertiary py-2">Thanks for your review!</p>;
  }
  if (mode === 'already') {
    return <p className="text-center font-body-sm text-body-sm text-on-surface-variant py-2">You&apos;ve already reviewed this trip.</p>;
  }
  if (mode === 'idle') {
    return (
      <button
        onClick={() => setMode('form')}
        className="block w-full text-center border border-primary text-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary/5 transition-all"
      >
        Leave a Review
      </button>
    );
  }

  return (
    <div className="border border-outline-variant rounded-lg p-3 space-y-2">
      {error && <p className="text-error font-body-sm text-body-sm">{error}</p>}
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className="text-primary"
            aria-label={`${n} star`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: n <= rating ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
      />
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={saving}
          className="flex-1 bg-primary-container text-white py-2 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all disabled:opacity-50"
        >
          {saving ? '…' : 'Submit'}
        </button>
        <button
          onClick={() => setMode('idle')}
          className="px-4 border border-outline-variant text-on-surface py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
