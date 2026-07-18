'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { disputeApi } from '@/api/support.api';
import { rs } from '@/lib/format';
import type { Dispute } from '@/types/support';

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    disputeApi
      .adminList()
      .then(setDisputes)
      .catch((e) => setError(e?.message || 'Failed to load disputes'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resolve = async (id: string, resolution: 'refund_renter' | 'side_with_vendor') => {
    setActingOn(id);
    try {
      const updated = await disputeApi.resolve(id, resolution);
      setDisputes((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
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
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Resolve Disputes</h1>
            <p className="font-body-md text-on-surface-variant">Mediate issues between renters and vendors.</p>
          </div>
        </div>

        {loading && <p className="font-body-md text-on-surface-variant">Loading disputes…</p>}
        {error && !loading && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">{error}</div>
        )}
        {!loading && !error && disputes.length === 0 && (
          <p className="font-body-md text-on-surface-variant">
            No disputes yet. Disputes are automatically opened when a renter reports an issue against a real booking.
          </p>
        )}

        <div className="space-y-stack-sm">
          {disputes.map((d) => {
            const ref = typeof d.booking === 'object' ? d.booking.bookingRef : d.booking;
            const renter = typeof d.renter === 'object' ? d.renter.fullName || d.renter.username : d.renter;
            const vendor = typeof d.vendor === 'object' ? d.vendor?.fullName || d.vendor?.username : d.vendor;
            return (
              <div key={d._id} className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-error-container/40 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-error">gavel</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm">{d.issue}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          d.status === 'resolved'
                            ? 'bg-tertiary-container/20 text-tertiary'
                            : 'bg-primary-container/15 text-primary'
                        }`}
                      >
                        {d.status === 'resolved' ? d.resolution?.replace('_', ' ') : 'Open'}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {ref} · {renter} vs {vendor || 'unknown vendor'} · {rs(d.amount)}
                    </p>
                  </div>
                </div>
                {d.status === 'open' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      disabled={actingOn === d._id}
                      onClick={() => resolve(d._id, 'refund_renter')}
                      className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      Refund Renter
                    </button>
                    <button
                      disabled={actingOn === d._id}
                      onClick={() => resolve(d._id, 'side_with_vendor')}
                      className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all disabled:opacity-50"
                    >
                      Side with Vendor
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
