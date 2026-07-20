'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingPanel from '@/components/vehicle/BookingPanel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVehicleById } from '@/store/actions/vehicleActions';
import { clearSelected } from '@/store/slices/vehicleSlice';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { reviewApi } from '@/api/review.api';
import type { Vehicle } from '@/types/vehicle';
import type { Review } from '@/types/review';

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

function ReviewStars({ n }: { n: number }) {
  return (
    <span className="flex items-center text-primary">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: i < n ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </span>
  );
}

export default function VehicleDetailsPage() {
  const params = useParams();
  const id = String(params.id);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {
    selected: v,
    selectedLoading: loading,
    selectedError: error,
  } = useAppSelector((s) => s.vehicles);
  const [reviews, setReviews] = useState<Review[]>([]);
  const owner = v && typeof v.owner === 'object' ? v.owner : null;

  useEffect(() => {
    dispatch(fetchVehicleById(id));
    reviewApi.forVehicle(id).then(setReviews).catch(() => {});
    return () => {
      dispatch(clearSelected());
    };
  }, [dispatch, id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-8">
        {loading && <DetailSkeleton />}

        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">
            {error} — is the backend running on :5001?
            <div className="mt-2">
              <Link href="/" className="text-primary font-semibold hover:underline">
                ← {t('common.backToHome')}
              </Link>
            </div>
          </div>
        )}

        {v && !loading && (
          <>
            {/* Breadcrumb + verified */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <nav className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                <Link href="/" className="hover:text-primary">
                  {t('vehicleDetail.breadcrumbVehicles')}
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span>{v.type}</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-primary font-semibold">{v.name}</span>
              </nav>
              {v.verified && (
                <div className="bg-tertiary-container/15 text-tertiary px-3 py-1 rounded-full flex items-center gap-1 font-label-md text-label-md border border-tertiary/20">
                  <span className="material-symbols-outlined" style={FILLED}>verified</span>
                  {t('vehicleDetail.verifiedPhotos')}
                </div>
              )}
            </div>

            <Gallery vehicle={v} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
              {/* Left column */}
              <div className="lg:col-span-8">
                <h1 className="font-headline-lg text-headline-lg mb-2">{v.name}</h1>
                <div className="flex flex-wrap gap-3 items-center mb-6">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">
                    {v.type}
                  </span>
                  <div className="flex items-center gap-1 text-primary font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[18px]" style={FILLED}>star</span>
                    <span>
                      {v.rating.toFixed(1)} ({v.reviewsCount} {t('vehicleDetail.reviews')})
                    </span>
                  </div>
                  {v.conditionScore > 0 && (
                    <>
                      <div className="h-4 w-px bg-outline-variant" />
                      <span className="text-on-surface-variant font-body-sm text-body-sm">
                        {t('vehicleDetail.conditionScore')}{' '}
                        <span className="text-primary font-bold">{v.conditionScore}/10</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Feature badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {v.specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center gap-1 bg-surface-container text-on-surface-variant px-3 py-2 rounded-lg font-label-md text-label-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                      {s.label}
                    </div>
                  ))}
                  {v.location && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-2 rounded-lg font-label-md text-label-md border border-primary/20">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {v.location}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="border-t border-outline-variant pt-8 mb-8">
                  <h2 className="font-headline-sm text-headline-sm mb-3">{t('vehicleDetail.description')}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {v.description || t('vehicleDetail.noDescription')}
                  </p>
                </div>

                {/* Pickup location */}
                <div className="border-t border-outline-variant pt-8 mb-8">
                  <h2 className="font-headline-sm text-headline-sm mb-3">
                    {t('vehicleDetail.pickupLocationTitle')}
                  </h2>
                  <div className="rounded-xl overflow-hidden border border-outline-variant">
                    <div className="w-full h-56 bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[48px]" style={FILLED}>
                        location_on
                      </span>
                    </div>
                    <div className="p-6 bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant">map</span>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">
                            {v.location || 'Kathmandu'}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {t('vehicleDetail.exactLocationShared')}
                          </p>
                        </div>
                      </div>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-label-md text-label-md flex items-center gap-1 text-primary hover:underline"
                      >
                        {t('vehicleDetail.getDirections')}
                        <span className="material-symbols-outlined text-[18px]">directions</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Host */}
                {v.host && (
                  <div className="border-t border-outline-variant pt-8">
                    <h2 className="font-headline-sm text-headline-sm mb-3">{t('vehicleDetail.hostedBy')}</h2>
                    <div className="bg-surface-container-low p-6 rounded-xl flex flex-col md:flex-row items-center gap-6">
                      <div className="relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.host.avatarUrl}
                          alt={v.host.name}
                          className="w-20 h-20 rounded-full object-cover bg-surface-container"
                        />
                        {v.host.verified && (
                          <div className="absolute bottom-0 right-0 bg-primary-container text-white p-1 rounded-full border-2 border-surface-container-low">
                            <span className="material-symbols-outlined text-[16px]" style={FILLED}>
                              verified
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                          <h3 className="font-headline-sm text-headline-sm">{v.host.name}</h3>
                          {v.host.verified && (
                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                              {t('vehicleDetail.verifiedHost')}
                            </span>
                          )}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                          {t('vehicleDetail.memberSince')} {v.host.memberSince}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1">
                          <Stat icon="stars" text={`${v.rating.toFixed(1)} Rating`} />
                          <Stat icon="bolt" text={`${v.host.responseRate}% Response`} />
                          <Stat icon="history" text={`${v.host.bookings}+ Bookings`} />
                        </div>
                      </div>
                      {owner?.email || owner?.phone ? (
                        <a
                          href={owner.email ? `mailto:${owner.email}` : `tel:${owner.phone}`}
                          className="font-label-md text-label-md border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                        >
                          {t('vehicleDetail.contactHost')}
                        </a>
                      ) : (
                        <button
                          disabled
                          title="No contact info on file for this host"
                          className="font-label-md text-label-md border border-outline-variant text-on-surface-variant px-6 py-2 rounded-lg cursor-not-allowed"
                        >
                          {t('vehicleDetail.contactHost')}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                <div className="border-t border-outline-variant pt-8 mt-8">
                  <h2 className="font-headline-sm text-headline-sm mb-3">
                    {t('vehicleDetail.reviewsHeading')} {reviews.length > 0 && `(${reviews.length})`}
                  </h2>
                  {reviews.length === 0 ? (
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {t('vehicleDetail.noReviews')}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((r) => {
                        const author = typeof r.user === 'object' ? r.user.fullName || r.user.username : 'Renter';
                        return (
                          <div key={r._id} className="bg-surface-container-low p-5 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-label-md text-label-md text-on-surface">{author}</span>
                              <ReviewStars n={r.rating} />
                            </div>
                            {r.comment && (
                              <p className="font-body-sm text-body-sm text-on-surface-variant">{r.comment}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="lg:col-span-4">
                <BookingPanel vehicle={v} />
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-1 font-label-md text-label-md">
      <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
      {text}
    </div>
  );
}

function Gallery({ vehicle }: { vehicle: Vehicle }) {
  const imgs =
    vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.imageUrl];
  return (
    <div className="rounded-xl overflow-hidden bg-surface-container-low h-[320px] md:h-[460px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgs[0]}
        alt={vehicle.name}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-64 bg-surface-container rounded mb-6" />
      <div className="h-[320px] md:h-[460px] bg-surface-container rounded-xl mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-8 w-1/2 bg-surface-container rounded" />
          <div className="h-4 w-1/3 bg-surface-container rounded" />
          <div className="h-24 bg-surface-container rounded" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-96 bg-surface-container rounded-xl" />
        </div>
      </div>
    </div>
  );
}
