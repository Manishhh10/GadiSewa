'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { adminApi } from '@/api/admin.api';
import { rs } from '@/lib/format';
import type { AdminVehicle } from '@/types/admin';
import type { NormalizedError } from '@/lib/axios';

export default function ReviewListingsPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getVehicles()
      .then((d) => setVehicles(d))
      .catch((e) => setError((e as NormalizedError).message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (id: string, verified: boolean) => {
    setBusy(id);
    try {
      const updated = await adminApi.verifyVehicle(id, verified);
      setVehicles((prev) => prev.map((v) => (v._id === id ? { ...v, verified: updated.verified } : v)));
    } catch (e) {
      setError((e as NormalizedError).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <Link href="/admin" className="flex items-center gap-1 text-primary mb-3 font-label-md text-label-md hover:underline w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Admin Dashboard
        </Link>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Review Vehicle Listings</h1>
        <p className="font-body-md text-on-surface-variant mb-stack-lg">Approve listings to show the Verified badge to renters.</p>

        {loading && <p className="font-body-md text-on-surface-variant">Loading listings…</p>}
        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md mb-stack-md">{error}</div>
        )}

        <div className="space-y-stack-sm">
          {vehicles.map((v) => (
            <div key={v._id} className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {v.imageUrl ? <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline-sm text-headline-sm">{v.name}</span>
                    {v.verified ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-tertiary-container/20 text-tertiary">Verified</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-primary-container/15 text-primary">Pending</span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {v.type} · {rs(v.dailyRate)}/day · {v.location}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Owner: {v.owner ? `@${v.owner.username}` : 'seed/none'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {v.verified ? (
                  <button onClick={() => toggle(v._id, false)} disabled={busy === v._id} className="border border-outline text-on-surface-variant px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container disabled:opacity-60 transition-all">
                    Unverify
                  </button>
                ) : (
                  <button onClick={() => toggle(v._id, true)} disabled={busy === v._id} className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 disabled:opacity-60 transition-all">
                    Approve
                  </button>
                )}
                <Link href={`/vehicles/${v._id}`} className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
