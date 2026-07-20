'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { adminApi } from '@/api/admin.api';
import { fmtDate } from '@/lib/format';
import type { AdminApplication } from '@/types/admin';
import type { NormalizedError } from '@/lib/axios';

const badge: Record<AdminApplication['status'], string> = {
  pending: 'bg-primary-container/15 text-primary',
  approved: 'bg-tertiary-container/20 text-tertiary',
  rejected: 'bg-error-container text-on-error-container',
};

export default function ReviewApplicationsPage() {
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    adminApi
      .getApplications()
      .then((d) => setApps(d))
      .catch((e) => setError((e as NormalizedError).message))
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id: string) => {
    setBusy(id);
    try {
      const updated = await adminApi.updateApplication(id, 'approved');
      setApps((prev) => prev.map((a) => (a._id === id ? updated : a)));
    } catch (e) {
      setError((e as NormalizedError).message);
    } finally {
      setBusy(null);
    }
  };

  const startReject = (id: string) => {
    setRejectingId(id);
    setReason('');
    setError(null);
  };

  const confirmReject = async (id: string) => {
    if (!reason.trim()) {
      setError('Please explain why this application is being rejected.');
      return;
    }
    setBusy(id);
    try {
      const updated = await adminApi.updateApplication(id, 'rejected', reason.trim());
      setApps((prev) => prev.map((a) => (a._id === id ? updated : a)));
      setRejectingId(null);
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
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Review Vendor Applications</h1>
        <p className="font-body-md text-on-surface-variant mb-stack-lg">Approve a vendor to grant them listing access.</p>

        {loading && <p className="font-body-md text-on-surface-variant">Loading applications…</p>}
        {error && (
          <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md mb-stack-md">{error}</div>
        )}
        {!loading && !error && apps.length === 0 && (
          <p className="font-body-md text-on-surface-variant">No applications yet.</p>
        )}

        <div className="space-y-stack-sm">
          {apps.map((a) => (
            <div key={a._id} className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">storefront</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-headline-sm text-headline-sm">{a.businessName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${badge[a.status]}`}>{a.status}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {a.fullName} · {a.phone} · {a.vehicleCount} vehicle(s)
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {a.user ? `@${a.user.username} (${a.user.email})` : 'unknown user'} · applied {fmtDate(a.createdAt)}
                    </p>
                    {a.message && <p className="font-body-sm text-body-sm text-on-surface mt-1">“{a.message}”</p>}
                    {a.documentUrl ? (
                      <a
                        href={a.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline mt-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        View ID Document
                      </a>
                    ) : (
                      <p className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant mt-2 italic">
                        No ID document on file (submitted before this was required)
                      </p>
                    )}
                    {a.status === 'rejected' && a.rejectionReason && (
                      <p className="font-body-sm text-body-sm text-error mt-2">
                        <strong>Rejection reason:</strong> {a.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
                {a.status === 'pending' && rejectingId !== a._id && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approve(a._id)}
                      disabled={busy === a._id}
                      className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 disabled:opacity-60 transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => startReject(a._id)}
                      disabled={busy === a._id}
                      className="border border-error text-error px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-error/5 disabled:opacity-60 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {rejectingId === a._id && (
                <div className="border-t border-outline-variant pt-4 space-y-2">
                  <label className="block font-label-md text-label-md text-on-surface">
                    Reason for rejection (the applicant will see this)
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. ID document is unreadable, please re-submit a clearer copy."
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-md text-body-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmReject(a._id)}
                      disabled={busy === a._id}
                      className="bg-error text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 disabled:opacity-60 transition-all"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
