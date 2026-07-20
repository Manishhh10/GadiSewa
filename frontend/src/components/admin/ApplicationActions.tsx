'use client';

import { useState } from 'react';
import { adminApi } from '@/api/admin.api';
import { useToast } from '@/lib/toast/ToastContext';
import type { NormalizedError } from '@/lib/axios';
import type { AdminApplication } from '@/types/admin';

/**
 * The single approve/reject control for a vendor application — used on both
 * the admin dashboard's queue and the dedicated Applications page, so the
 * same action looks and behaves the same everywhere (previously the
 * dashboard used a native window.prompt() while this page used an inline
 * textarea for the identical action).
 */
export default function ApplicationActions({
  application,
  onUpdated,
  compactName,
}: {
  application: AdminApplication;
  onUpdated: (updated: AdminApplication) => void;
  /** Shown in the toast/rejection prompt when there's no room for the full card. */
  compactName?: string;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  const name = compactName ?? application.businessName;

  const approve = async () => {
    setBusy(true);
    setError(null);
    try {
      const updated = await adminApi.updateApplication(application._id, 'approved');
      onUpdated(updated);
      toast.success(`Approved "${name}" — they can now list vehicles.`);
    } catch (err) {
      toast.error((err as NormalizedError).message);
    } finally {
      setBusy(false);
    }
  };

  const confirmReject = async () => {
    if (!reason.trim()) {
      setError('Please explain why this application is being rejected.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const updated = await adminApi.updateApplication(application._id, 'rejected', reason.trim());
      onUpdated(updated);
      setRejecting(false);
      toast.success(`Rejected "${name}" — the applicant has been notified.`);
    } catch (err) {
      toast.error((err as NormalizedError).message);
    } finally {
      setBusy(false);
    }
  };

  if (application.status !== 'pending') return null;

  if (rejecting) {
    return (
      <div className="w-full space-y-2">
        {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
        <textarea
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection (the applicant will see this)…"
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-sm text-body-sm"
        />
        <div className="flex gap-2">
          <button
            onClick={confirmReject}
            disabled={busy}
            className="bg-error text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 disabled:opacity-60 transition-all"
          >
            Confirm Reject
          </button>
          <button
            onClick={() => {
              setRejecting(false);
              setError(null);
            }}
            className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={approve}
        disabled={busy}
        className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 disabled:opacity-60 transition-all"
      >
        Approve
      </button>
      <button
        onClick={() => setRejecting(true)}
        disabled={busy}
        className="border border-error text-error px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-error/5 disabled:opacity-60 transition-all"
      >
        Reject
      </button>
    </div>
  );
}
