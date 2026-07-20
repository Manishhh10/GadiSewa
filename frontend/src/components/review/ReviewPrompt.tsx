'use client';

import { useState } from 'react';
import { reviewApi } from '@/api/review.api';
import type { NormalizedError } from '@/lib/axios';

/** A "Leave a Review" button that expands into a star-rating + comment form. Used
 * wherever a completed, unreviewed booking makes a review possible. */
export default function ReviewPrompt({ bookingId }: { bookingId: string }) {
  const [mode, setMode] = useState<'idle' | 'form' | 'done' | 'already'>('idle');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await reviewApi.create({ bookingId, rating, comment: comment || undefined });
      setMode('done');
    } catch (err) {
      const status = (err as NormalizedError).status;
      if (status === 409) {
        setMode('already');
      } else {
        setError((err as NormalizedError).message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (mode === 'done') {
    return <p className="text-center font-body-sm text-body-sm text-tertiary py-2">Thanks for your review!</p>;
  }
  if (mode === 'already') {
    return <p className="text-center font-body-sm text-body-sm text-on-surface-variant py-2">You&apos;ve already reviewed this trip.</p>;
  }
  if (mode === 'idle') {
    return (
      <button
        onClick={() => setMode('form')}
        className="block w-full text-center border border-primary text-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary/5 transition-all"
      >
        Leave a Review
      </button>
    );
  }

  return (
    <div className="border border-outline-variant rounded-lg p-3 space-y-2">
      {error && <p className="text-error font-body-sm text-body-sm">{error}</p>}
      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className="text-primary"
            aria-label={`${n} star`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: n <= rating ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
      />
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={saving}
          className="flex-1 bg-primary-container text-white py-2 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all disabled:opacity-50"
        >
          {saving ? '…' : 'Submit'}
        </button>
        <button
          onClick={() => setMode('idle')}
          className="px-4 border border-outline-variant text-on-surface py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
