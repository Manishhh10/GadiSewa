'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cancelBooking, fetchBookingById, initiateEsewaPayment } from '@/store/actions/bookingActions';
import { fmtDate, rs } from '@/lib/format';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { useToast } from '@/lib/toast/ToastContext';

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

/** Build a hidden form and submit it — a real browser POST to eSewa's gateway, not an API call. */
function redirectToEsewa(url: string, fields: Record<string, string>) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentPageContent />
    </Suspense>
  );
}

function PaymentPageContent() {
  const params = useParams();
  const id = String(params.id);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { t } = useTranslation();
  const { current: b, loading, saving, error } = useAppSelector((s) => s.bookings);
  const failed = searchParams.get('failed') === '1';
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchBookingById(id));
  }, [dispatch, id]);

  const onPay = async () => {
    const res = await dispatch(initiateEsewaPayment(id));
    if (initiateEsewaPayment.fulfilled.match(res)) {
      redirectToEsewa(res.payload.url, res.payload.fields);
    } else {
      toast.error(res.payload ?? 'Could not start payment.');
    }
  };

  const onCancel = async () => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(true);
    const res = await dispatch(cancelBooking(id));
    setCancelling(false);
    if (cancelBooking.fulfilled.match(res)) {
      toast.success('Booking cancelled.');
    } else {
      toast.error(res.payload ?? 'Could not cancel this booking.');
    }
  };

  const expired = !!b && new Date(b.returnDate).getTime() < Date.now();
  const blocked = !!b && (!b.vehicle || expired);
  const canCancel = !!b && (b.status === 'pending' || b.status === 'confirmed');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-8">
        <div className="flex items-center gap-1 mb-8 text-on-surface-variant font-body-sm text-body-sm">
          <span>{t('payment.detailsStep')}</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span>{t('payment.reviewStep')}</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-semibold">{t('payment.paymentStep')}</span>
        </div>

        {loading && <p className="font-body-md text-on-surface-variant">Loading…</p>}
        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">{error}</div>
        )}
        {failed && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md mb-6">
            The eSewa payment was not completed. You can try again below.
          </div>
        )}

        {b && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment box */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 mb-4 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-outline-variant">
                    <span className="text-[#41a124] font-extrabold italic text-3xl">eSewa</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg mb-1">{t('payment.securePayment')}</h1>
                  <p className="text-on-surface-variant font-body-md text-body-md max-w-md">
                    {t('payment.completeTransaction')}
                  </p>
                </div>

                <div className="bg-surface-container p-6 rounded-lg border border-outline-variant flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 bg-surface-bright px-4 py-1 rounded-full border border-primary-container/20">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={FILLED}>verified_user</span>
                    <span className="text-primary font-label-md text-label-md">{t('payment.verifiedSecureTransaction')}</span>
                  </div>
                  <div className="w-full h-px bg-outline-variant" />
                  <div className="flex flex-col gap-2 w-full">
                    <Row label={t('payment.merchant')} value="GadiSewa Vehicle Rentals" />
                    <Row label={t('payment.bookingRef')} value={b.bookingRef} />
                    <Row label={t('payment.amount')} value={rs(b.totalAmount)} strong />
                  </div>

                  {b.paymentStatus === 'paid' ? (
                    <Link
                      href={`/booking/${id}/success`}
                      className="w-full text-center bg-primary-container text-white py-4 rounded-lg font-headline-sm text-headline-sm hover:brightness-110 transition-all mt-2"
                    >
                      {t('payment.alreadyPaid')}
                    </Link>
                  ) : blocked ? (
                    <div className="w-full space-y-3 mt-2">
                      <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm flex items-start gap-2">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {!b.vehicle
                          ? 'This vehicle listing is no longer available. This booking can no longer be paid.'
                          : 'The rental dates for this booking have passed. This booking can no longer be paid.'}
                      </div>
                      {canCancel && (
                        <button
                          onClick={onCancel}
                          disabled={cancelling}
                          className="w-full border border-error text-error py-3 rounded-lg font-label-md text-label-md hover:bg-error/5 transition-all disabled:opacity-50"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={onPay}
                      disabled={saving}
                      className="w-full bg-primary-container text-white py-4 rounded-lg font-headline-sm text-headline-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                    >
                      {saving ? (
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      ) : (
                        <>
                          <span>{t('payment.payWith', { amount: rs(b.totalAmount) })}</span>
                          <span className="material-symbols-outlined">payments</span>
                        </>
                      )}
                    </button>
                  )}
                  {!blocked && b.paymentStatus !== 'paid' && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[14px] align-middle">info</span>{' '}
                      You&apos;ll be redirected to eSewa&apos;s test payment gateway — use test ID
                      9711111111 / password Nepal@123 / MPIN 1122 to pay.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <aside className="lg:col-span-5 sticky top-24">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
                <div className="relative h-48 w-full bg-surface-container flex items-center justify-center">
                  {b.vehicle ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.vehicle.imageUrl} alt={b.vehicle.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 bg-on-surface/80 backdrop-blur-md text-surface px-3 py-1 rounded-full font-label-md text-label-md">
                        {b.vehicle.type}
                      </div>
                    </>
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-outline">directions_car</span>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <h2 className="font-headline-md text-headline-md">
                    {b.vehicle?.name ?? <span className="text-on-surface-variant italic">Listing removed</span>}
                  </h2>
                  <SummaryRow icon="calendar_today" label={t('payment.rentalDates')} value={`${fmtDate(b.pickupDate)} — ${fmtDate(b.returnDate)}`} />
                  <SummaryRow icon="location_on" label={t('payment.pickupLocation')} value={b.pickupLocation} />
                  <SummaryRow icon="schedule" label={t('payment.duration')} value={`${b.days} ${t('payment.daysSuffix')}`} />
                  <div className="border-t border-outline-variant pt-4 flex justify-between items-baseline">
                    <span className="font-headline-sm text-headline-sm">{t('payment.total')}</span>
                    <span className="font-headline-md text-headline-md text-primary">{rs(b.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
      <span>{label}</span>
      <span className={strong ? 'font-bold text-primary text-body-md' : 'font-semibold text-on-surface'}>{value}</span>
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-surface-container p-2 rounded-lg">
        <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
      </div>
      <div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{label}</p>
        <p className="font-body-md text-body-md font-semibold">{value}</p>
      </div>
    </div>
  );
}
