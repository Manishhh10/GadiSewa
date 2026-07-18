'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const LEN = 6;

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(LEN).fill(''));
  const [done, setDone] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

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
          {done ? (
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
              <Link href="/login" className="inline-block bg-primary-container text-white px-8 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
                Continue to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-stack-lg text-center">
                <h2 className="font-headline-md text-headline-md text-on-surface">Verify your account</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Enter the 6-digit code sent to your phone / email.
                </p>
              </div>

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

              <Button type="button" onClick={() => filled && setDone(true)} disabled={!filled}>
                Verify
              </Button>

              <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-stack-md">
                Didn&apos;t get a code?{' '}
                <button type="button" className="text-primary font-semibold hover:underline">
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
