'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyBookings } from '@/store/actions/bookingActions';
import { fmtDate, rs } from '@/lib/format';

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

export default function ActiveTripPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const trip =
    items.find((b) => b.status === 'active' || b.status === 'confirmed') ?? null;

  const owner = trip && typeof trip.vehicle.owner === 'object' ? trip.vehicle.owner : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        {loading && <p className="font-body-md text-on-surface-variant">Loading your trip…</p>}

        {!loading && !trip && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-outline">no_crash</span>
            <h1 className="font-headline-lg text-headline-lg mt-4">No active trip</h1>
            <p className="font-body-md text-on-surface-variant mt-2">Book and pay for a vehicle to start a trip.</p>
            <Link href="/dashboard" className="inline-block mt-6 bg-primary-container text-white px-8 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
              Browse Vehicles
            </Link>
          </div>
        )}

        {!loading && trip && (
          <>
            <div className="bg-tertiary-container/15 border border-tertiary/20 text-tertiary px-6 py-4 rounded-xl flex items-center gap-3 mb-stack-lg">
              <span className="material-symbols-outlined" style={FILLED}>check_circle</span>
              <span className="font-headline-sm text-headline-sm">Trip Active</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-lg">
              {/* Left */}
              <div className="md:col-span-7 space-y-stack-lg">
                <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-surface-variant shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={trip.vehicle.imageUrl} alt={trip.vehicle.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="font-headline-md text-headline-md mb-1">{trip.vehicle.name}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-on-surface-variant text-sm">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">directions_car</span> {trip.vehicle.type}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">tag</span> {trip.bookingRef}</span>
                    </div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">{trip.status}</span>
                  </div>
                </section>

                <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant">
                  <div className="p-6 border-b border-outline-variant">
                    <h3 className="font-headline-sm text-headline-sm">Trip Details</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <span className="text-sm font-label-md text-on-surface-variant block mb-2 uppercase tracking-wide">Pickup Location</span>
                      <p className="font-body-md font-semibold flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        {trip.pickupLocation}
                      </p>
                      <div className="mt-4 rounded-xl overflow-hidden h-40 bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[44px]" style={FILLED}>location_on</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Field label="Trip Start" value={fmtDate(trip.pickupDate)} />
                      <Field label="Expected Return" value={fmtDate(trip.returnDate)} />
                      <Field label="Duration" value={`${trip.days} Days`} />
                      <Field label="Amount Paid" value={rs(trip.totalAmount)} accent />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right */}
              <div className="md:col-span-5 space-y-stack-lg">
                {(trip.vehicle.host || owner) && (
                  <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center">
                        {trip.vehicle.host?.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={trip.vehicle.host.avatarUrl} alt={trip.vehicle.host.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-on-surface-variant">person</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-on-surface">
                            {trip.vehicle.host?.name || owner?.fullName || 'Vendor'}
                          </h3>
                          {trip.vehicle.host?.verified && (
                            <span className="material-symbols-outlined text-primary text-sm" style={FILLED}>verified</span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant">Verified Vendor</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {owner?.phone ? (
                        <a
                          href={`tel:${owner.phone}`}
                          className="w-full flex items-center justify-center gap-2 bg-primary-container text-white py-3 rounded-xl font-label-md hover:brightness-110 transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">call</span> Call Vendor
                        </a>
                      ) : (
                        <button
                          disabled
                          title="No phone number on file for this vendor"
                          className="w-full flex items-center justify-center gap-2 bg-surface-container text-on-surface-variant py-3 rounded-xl font-label-md cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[20px]">call</span> Call Vendor
                        </button>
                      )}
                      {owner?.email ? (
                        <a
                          href={`mailto:${owner.email}`}
                          className="w-full flex items-center justify-center gap-2 border border-outline text-on-surface py-3 rounded-xl font-label-md hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">mail</span> Email Vendor
                        </a>
                      ) : (
                        <button
                          disabled
                          title="No email on file for this vendor"
                          className="w-full flex items-center justify-center gap-2 border border-outline-variant text-on-surface-variant py-3 rounded-xl font-label-md cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[20px]">mail</span> Email Vendor
                        </button>
                      )}
                    </div>
                  </section>
                )}

                <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant space-y-3">
                  <h3 className="font-headline-sm text-headline-sm mb-1">Trip Actions</h3>
                  <Link href={`/damage-checklist?bookingId=${trip._id}`} className="w-full flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all">
                    <span className="material-symbols-outlined text-primary">fact_check</span>
                    <span className="font-label-md text-label-md">Damage Checklist</span>
                    <span className="material-symbols-outlined text-outline ml-auto">chevron_right</span>
                  </Link>
                  <Link href={`/report-issue?bookingRef=${trip.bookingRef}`} className="w-full flex items-center gap-3 p-3 rounded-xl border border-outline-variant hover:border-error hover:bg-error/5 transition-all">
                    <span className="material-symbols-outlined text-error">report</span>
                    <span className="font-label-md text-label-md">Report an Issue</span>
                    <span className="material-symbols-outlined text-outline ml-auto">chevron_right</span>
                  </Link>
                </section>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <span className="text-sm font-label-md text-on-surface-variant block mb-1 uppercase tracking-wide">{label}</span>
      <p className={`font-body-md font-bold ${accent ? 'text-primary' : 'text-on-surface'}`}>{value}</p>
    </div>
  );
}
