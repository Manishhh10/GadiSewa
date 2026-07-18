'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { authApi } from '@/api/auth.api';
import { useAppSelector } from '@/store/hooks';
import type { NormalizedError } from '@/lib/axios';

const LEN = 6;

export default function VerifyOtpPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [otp, setOtp] = useState<string[]>(Array(LEN).fill(''));
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentOnce, setSentOnce] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!user || user.emailVerified || sentOnce) return;
    setSentOnce(true);
    setSending(true);
    authApi
      .sendOtp()
      .catch((err) => setError((err as NormalizedError).message))
      .finally(() => setSending(false));
  }, [user, sentOnce]);

  const onChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < LEN - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const filled = otp.every((d) => d !== '');

  const onVerify = async () => {
    if (!filled) return;
    setVerifying(true);
    setError(null);
    try {
      await authApi.verifyOtp(otp.join(''));
      setDone(true);
    } catch (err) {
      setError((err as NormalizedError).message);
    } finally {
      setVerifying(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setSending(true);
    try {
      await authApi.sendOtp();
    } catch (err) {
      setError((err as NormalizedError).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-margin-mobile py-stack-lg bg-background">
      <div className="max-w-md w-full">
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-xl text-headline-xl font-extrabold text-primary tracking-tight">
            GadiSewa
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-unit">
            Secure Logistics &amp; Vehicle Booking
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
          {!user ? (
            <div className="text-center">
              <p className="font-body-md text-on-surface-variant mb-4">Please log in to verify your account.</p>
              <Link href="/login" className="text-primary font-semibold hover:underline">Go to Login</Link>
            </div>
          ) : done || user.emailVerified ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary-container/15 mb-4">
                <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Verified!</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                Your account has been verified successfully.
              </p>
              <Link href="/" className="inline-block bg-primary-container text-white px-8 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
                Continue
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-stack-lg text-center">
                <h2 className="font-headline-md text-headline-md text-on-surface">Verify your account</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {sending ? 'Sending a code to your email…' : `Enter the 6-digit code sent to ${user.email}.`}
                </p>
              </div>

              {error && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm mb-stack-md">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-2 md:gap-3 mb-stack-lg">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    value={d}
                    onChange={(e) => onChange(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-14 text-center font-headline-md text-headline-md rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                ))}
              </div>

              <Button type="button" onClick={onVerify} disabled={!filled} loading={verifying}>
                Verify
              </Button>

              <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-stack-md">
                Didn&apos;t get a code?{' '}
                <button type="button" onClick={onResend} disabled={sending} className="text-primary font-semibold hover:underline disabled:opacity-50">
                  Resend
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
