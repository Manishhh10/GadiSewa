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

export default function BookingSuccessPage() {
  const params = useParams();
  const id = String(params.id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { current: b, loading, error } = useAppSelector((s) => s.bookings);

  const STEPS = [
    { title: t('success.step1Title'), desc: t('success.step1Desc') },
    { title: t('success.step2Title'), desc: t('success.step2Desc') },
    { title: t('success.step3Title'), desc: t('success.step3Desc') },
    { title: t('success.step4Title'), desc: t('success.step4Desc') },
  ];

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-[820px] mx-auto w-full px-margin-mobile py-stack-lg md:py-16">
        {loading && <p className="font-body-md text-on-surface-variant text-center">Loading…</p>}
        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">{error}</div>
        )}

        {b && !loading && (
          <>
            <div className="text-center space-y-3 mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tertiary-container/15 mb-1">
                <span className="material-symbols-outlined text-[48px] text-tertiary" style={FILLED}>check_circle</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface">{t('success.paymentSuccessful')}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {t('success.amountPaid')} <span className="font-bold text-on-surface">{rs(b.totalAmount)}</span>
              </p>
              <p className="font-body-md text-body-md">
                {t('success.bookingReference')} <span className="font-bold text-primary">{b.bookingRef}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-lg">
              {/* Trip summary */}
              <div className="md:col-span-7 space-y-6">
                <div className="bg-surface-container-low rounded-xl p-stack-lg border border-outline-variant/30 shadow-sm">
                  <h2 className="font-headline-md text-headline-md mb-6 border-b border-outline-variant/20 pb-2">
                    {t('success.tripSummary')}
                  </h2>
                  <div className="flex gap-4 items-start mb-8">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
                      {b.vehicle ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.vehicle.imageUrl} alt={b.vehicle.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-outline">directions_car</span>
                      )}
                    </div>
                    <div>
                      <p className="font-headline-md text-headline-md text-primary mb-1">
                        {b.vehicle?.name ?? <span className="italic text-on-surface-variant">Listing removed</span>}
                      </p>
                      {b.vehicle && (
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {b.vehicle.host ? `${t('success.vendor')} ${b.vehicle.host.name}` : b.vehicle.type}
                        </p>
                      )}
                      {b.vehicle?.verified && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-tertiary-container/15 text-tertiary px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[14px]" style={FILLED}>verified</span>
                          <span className="text-[12px] font-bold uppercase">{t('vehicleCard.verified')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-stack-md">
                    <Field label={t('success.duration')} value={`${b.days} ${t('success.daysBooking')}`} />
                    <Field label={t('success.tripDates')} value={`${fmtDate(b.pickupDate)} – ${fmtDate(b.returnDate)}`} />
                  </div>
                  <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-between items-center font-body-sm text-body-sm text-on-surface-variant">
                    <span>{t('success.transactionId')}</span>
                    <span className="font-mono text-on-surface">{b.transactionId ?? '—'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-stack-md">
                  <Link
                    href="/bookings"
                    className="flex-1 bg-primary-container text-white h-14 rounded-lg font-headline-sm text-headline-sm flex items-center justify-center hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
                  >
                    {t('success.goToMyBookings')}
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 bg-surface-container-high text-on-surface h-14 rounded-lg font-headline-sm text-headline-sm border border-outline-variant hover:bg-surface-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">home</span> {t('success.backToHome')}
                  </Link>
                </div>
              </div>

              {/* Next steps */}
              <div className="md:col-span-5">
                <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant/20 shadow-sm h-full">
                  <h3 className="font-headline-md text-headline-md mb-6">{t('success.whatsNext')}</h3>
                  <div className="space-y-6">
                    {STEPS.map((s, i) => (
                      <div key={s.title} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-body-md text-body-md font-semibold text-on-surface">{s.title}</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">{label}</span>
      <p className="font-body-md text-body-md font-semibold">{value}</p>
    </div>
  );
}
