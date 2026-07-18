'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Demo: no email backend — simulate a reset link being sent.
    setSent(true);
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
          {sent ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary-container/15 mb-4">
                <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  mark_email_read
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Check your email</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                If an account exists for <span className="font-semibold text-on-surface">{email || 'that address'}</span>, we&apos;ve sent a password reset link.
              </p>
              <Link href="/login" className="text-primary font-semibold hover:underline">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-stack-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface">Forgot Password?</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>
              <form onSubmit={onSubmit} className="space-y-stack-md">
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  icon="mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit">Send Reset Link</Button>
                <div className="text-center pt-stack-sm">
                  <Link href="/login" className="font-body-md text-on-surface-variant hover:text-primary">
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
