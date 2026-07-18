'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { reviewApi } from '@/api/review.api';
import type { Review } from '@/types/review';

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center text-primary">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < n ? "'FILL' 1" : "'FILL' 0" }}>
          star
        </span>
      ))}
    </span>
  );
}

export default function MonitorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    reviewApi
      .adminList()
      .then(setReviews)
      .catch((e) => setError(e?.message || 'Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleHidden = async (r: Review) => {
    setActingOn(r._id);
    try {
      const updated = await reviewApi.setHidden(r._id, !r.hidden);
      setReviews((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
    } finally {
      setActingOn(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <Link href="/admin" className="flex items-center gap-1 text-primary mb-3 font-label-md text-label-md hover:underline w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Admin Dashboard
        </Link>
        <div className="flex items-center justify-between mb-stack-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Monitor Reviews</h1>
            <p className="font-body-md text-on-surface-variant">Keep the marketplace trustworthy — hide spam or abusive reviews.</p>
          </div>
        </div>

        {loading && <p className="font-body-md text-on-surface-variant">Loading reviews…</p>}
        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">{error}</div>
        )}
        {!loading && !error && reviews.length === 0 && (
          <p className="font-body-md text-on-surface-variant">No reviews have been submitted yet.</p>
        )}

        <div className="space-y-stack-sm">
          {reviews.map((r) => {
            const vehicleName = typeof r.vehicle === 'object' ? r.vehicle.name : r.vehicle;
            const username = typeof r.user === 'object' ? r.user.fullName || r.user.username : r.user;
            return (
              <div key={r._id} className={`bg-surface-container-lowest p-stack-md rounded-xl border ${r.hidden ? 'border-error/40' : 'border-outline-variant'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-headline-sm text-headline-sm">{vehicleName}</span>
                    <Stars n={r.rating} />
                    {r.hidden && <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-error-container text-on-error-container">Hidden</span>}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface">&ldquo;{r.comment || 'No comment left.'}&rdquo;</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">— {username}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={actingOn === r._id}
                    onClick={() => toggleHidden(r)}
                    className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all disabled:opacity-50 ${
                      r.hidden
                        ? 'border border-outline-variant text-on-surface hover:bg-surface-container'
                        : 'border border-error text-error hover:bg-error/5'
                    }`}
                  >
                    {r.hidden ? 'Restore' : 'Hide'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
