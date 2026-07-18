'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBookingById } from '@/store/actions/bookingActions';
import { fmtDate, rs } from '@/lib/format';
import { useTranslation } from '@/lib/i18n/I18nContext';

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

export default function BookingReviewPage() {
  const params = useParams();
  const id = String(params.id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { current: b, loading, error } = useAppSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-8">
        {loading && <p className="font-body-md text-on-surface-variant">Loading booking…</p>}
        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">
            {error} <Link href="/" className="text-primary font-semibold underline ml-2">Home</Link>
          </div>
        )}

        {b && !loading && (
          <>
            <div className="mb-8">
              <Link
                href={`/vehicles/${b.vehicle._id}`}
                className="flex items-center gap-1 text-primary mb-2 font-label-md text-label-md hover:underline w-fit"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t('bookingReview.cancelGoBack')}
              </Link>
              <h1 className="font-headline-lg text-headline-lg">{t('bookingReview.title')}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t('bookingReview.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left */}
              <div className="lg:col-span-2 space-y-8">
                {/* Vehicle summary */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm">
                  <div className="w-full md:w-2/5 h-48 md:h-auto bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.vehicle.imageUrl} alt={b.vehicle.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex-grow space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md uppercase inline-block mb-1">
                          {b.vehicle.type}
                        </span>
                        <h2 className="font-headline-md text-headline-md">{b.vehicle.name}</h2>
                      </div>
                      {b.vehicle.verified && (
                        <div className="flex items-center text-tertiary gap-1">
                          <span className="material-symbols-outlined" style={FILLED}>verified</span>
                          <span className="font-label-md text-label-md">{t('vehicleCard.verified')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {b.vehicle.specs.map((s) => (
                        <div key={s.label} className="flex items-center gap-1 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                          <span className="font-body-sm text-body-sm">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Trip details */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-6 shadow-sm">
                  <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
                    <span className="material-symbols-outlined">event_note</span> {t('bookingReview.tripDetails')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="text-on-surface-variant font-label-md text-label-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">location_on</span> {t('bookingReview.pickupDropoff')}
                      </div>
                      <p className="font-body-md text-body-md font-semibold">{b.pickupLocation}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="text-on-surface-variant font-label-md text-label-md">{t('bookingReview.pickup')}</div>
                        <p className="font-body-md text-body-md font-semibold">{fmtDate(b.pickupDate)}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline self-center">arrow_forward</span>
                      <div className="flex-1 text-right">
                        <div className="text-on-surface-variant font-label-md text-label-md">{t('bookingReview.dropoff')}</div>
                        <p className="font-body-md text-body-md font-semibold">{fmtDate(b.returnDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary-container/10 p-4 rounded-lg flex items-center justify-between">
                    <span className="flex items-center gap-2 text-primary font-label-md text-label-md">
                      <span className="material-symbols-outlined">schedule</span> {t('bookingReview.totalDuration')}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary">{b.days} {t('bookingReview.daysSuffix')}</span>
                  </div>
                </section>

                {/* Payment method */}
                <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                  <h3 className="font-headline-sm text-headline-sm mb-4">{t('bookingReview.paymentMethod')}</h3>
                  <div className="w-full p-5 border-2 border-primary bg-primary/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-white rounded flex items-center justify-center shadow-sm border border-outline-variant">
                        <span className="text-[#41a124] font-extrabold italic text-xl">eSewa</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md">{t('bookingReview.payWithEsewa')}</p>
                        <p className="text-on-surface-variant font-body-sm text-body-sm">{t('bookingReview.secureWallet')}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary" style={FILLED}>radio_button_checked</span>
                  </div>
                </section>
              </div>

              {/* Right: cost breakdown */}
              <aside className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-md sticky top-24 h-fit">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline-sm text-headline-sm">{t('bookingReview.costBreakdown')}</h3>
                  <div className="bg-tertiary-container/20 text-tertiary px-2 py-1 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]" style={FILLED}>lock</span>
                    <span className="font-body-sm text-body-sm font-bold uppercase">{t('bookingReview.priceLock')}</span>
                  </div>
                </div>
                <div className="space-y-3 border-b border-outline-variant pb-4">
                  <Row label={`${t('bookingReview.dailyRate')} (${rs(b.vehicle.dailyRate)} × ${b.days})`} value={rs(b.baseAmount)} />
                  <Row label={t('bookingReview.serviceFee')} value={rs(b.serviceFee)} />
                  <Row label={t('bookingReview.cleaning')} value={rs(b.cleaningFee)} />
                  <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
                    <span>{t('bookingReview.insurance')}</span>
                    <span className="text-tertiary font-semibold">{t('common.free')}</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline py-4">
                  <span className="font-headline-sm text-headline-sm">{t('bookingReview.total')}</span>
                  <span className="font-headline-md text-headline-md text-primary">{rs(b.totalAmount)}</span>
                </div>

                {b.paymentStatus === 'paid' ? (
                  <div className="space-y-3">
                    <div className="bg-tertiary-container/10 border border-tertiary/30 text-tertiary rounded-lg p-3 text-center font-label-md text-label-md flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined" style={FILLED}>verified</span> {t('bookingReview.confirmedPaid')}
                    </div>
                    <Link
                      href={`/booking/${b._id}/success`}
                      className="block w-full text-center bg-primary-container text-white py-4 rounded-xl font-headline-sm text-headline-sm hover:brightness-110 transition-all"
                    >
                      {t('bookingReview.viewReceipt')}
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/booking/${b._id}/payment`}
                    className="block w-full text-center bg-primary-container text-white py-4 rounded-xl font-headline-sm text-headline-sm shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    {t('bookingReview.proceedToPayment')}
                  </Link>
                )}
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
      <span>{label}</span>
      <span className="text-on-surface">{value}</span>
    </div>
  );
}
