'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createBooking } from '@/store/actions/bookingActions';
import { rs } from '@/lib/format';
import type { Vehicle } from '@/types/vehicle';

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDaysISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const SERVICE_FEE_RATE = 0.04;
const CLEANING_FEE = 500;

export default function BookingPanel({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const saving = useAppSelector((s) => s.bookings.saving);
  const error = useAppSelector((s) => s.bookings.error);

  const [pickup, setPickup] = useState(todayISO());
  const [ret, setRet] = useState(addDaysISO(3));

  const { days, base, serviceFee, total } = useMemo(() => {
    const diff = Math.ceil(
      (new Date(ret).getTime() - new Date(pickup).getTime()) / 86_400_000
    );
    const d = Number.isFinite(diff) && diff > 0 ? diff : 1;
    const b = d * vehicle.dailyRate;
    const fee = Math.round(b * SERVICE_FEE_RATE);
    return { days: d, base: b, serviceFee: fee, total: b + fee + CLEANING_FEE };
  }, [pickup, ret, vehicle.dailyRate]);

  const onBook = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const res = await dispatch(
      createBooking({
        vehicleId: vehicle._id,
        pickupDate: pickup,
        returnDate: ret,
        pickupLocation: vehicle.location,
      })
    );
    if (createBooking.fulfilled.match(res)) {
      router.push(`/booking/${res.payload._id}`);
    }
  };

  return (
    <div className="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-headline-lg text-headline-lg text-on-surface">
            {rs(vehicle.dailyRate)}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant"> / day</span>
        </div>
        <div className="bg-tertiary-container/20 text-tertiary px-3 py-1 rounded font-label-md text-label-md flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">shield</span> Best Price
        </div>
      </div>

      <div className="bg-tertiary-container/10 border border-tertiary/20 text-tertiary px-4 py-2 rounded-lg mb-6 flex items-center gap-2 font-label-md text-label-md">
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
        What You See Is What You Pay
      </div>

      <div className="mb-6">
        <label className="font-body-sm text-body-sm text-outline block mb-1">Trip Dates</label>
        <div className="flex border border-outline-variant rounded-lg overflow-hidden">
          <div className="flex-1 p-2 border-r border-outline-variant">
            <p className="font-body-sm text-body-sm text-outline">Pickup</p>
            <input
              type="date"
              value={pickup}
              min={todayISO()}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-transparent font-label-md text-label-md text-on-surface outline-none"
            />
          </div>
          <div className="flex-1 p-2">
            <p className="font-body-sm text-body-sm text-outline">Return</p>
            <input
              type="date"
              value={ret}
              min={pickup}
              onChange={(e) => setRet(e.target.value)}
              className="w-full bg-transparent font-label-md text-label-md text-on-surface outline-none"
            />
          </div>
        </div>
        <p className="text-right font-body-sm text-body-sm text-primary font-semibold mt-1">
          Total Duration: {days} {days === 1 ? 'Day' : 'Days'}
        </p>
      </div>

      <div className="space-y-2 mb-6">
        <Row label={`Base Rate (${rs(vehicle.dailyRate)} × ${days})`} value={rs(base)} />
        <Row label="Service Fee" value={rs(serviceFee)} />
        <Row label="Cleaning & Sanitize Fee" value={rs(CLEANING_FEE)} />
        <div className="flex justify-between font-body-sm text-body-sm">
          <span className="text-on-surface-variant">Insurance (Standard)</span>
          <span className="text-tertiary font-semibold">FREE</span>
        </div>
        <div className="border-t border-outline-variant pt-2 mt-2 flex justify-between items-baseline">
          <span className="font-headline-sm text-headline-sm">Total Estimate</span>
          <span className="font-headline-sm text-headline-sm text-primary">{rs(total)}</span>
        </div>
      </div>

      {error && (
        <p className="bg-error-container text-on-error-container px-3 py-2 rounded-lg font-body-sm text-body-sm mb-3">
          {error}
        </p>
      )}

      <button
        onClick={onBook}
        disabled={saving}
        className="w-full bg-primary-container text-white font-headline-sm text-headline-sm py-4 rounded-xl shadow-md hover:brightness-110 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {saving ? (
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        ) : user ? (
          'Book Now'
        ) : (
          'Login to Book'
        )}
      </button>

      <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-3">
        No hidden charges. 24h grace period.
      </p>
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
