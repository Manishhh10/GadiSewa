'use client';

import { useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authApi } from '@/api/auth.api';
import type { NormalizedError } from '@/lib/axios';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = String(params.token);
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError((err as NormalizedError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-margin-mobile py-stack-lg bg-background">
      <div className="max-w-md w-full">
        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-xl text-headline-xl font-extrabold text-primary tracking-tight">
            GadiSewa
          </h1>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/20 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
          {done ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary-container/15 mb-4">
                <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Password reset!</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <div className="mb-stack-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface">Set a new password</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Choose a new password for your account.
                </p>
              </div>
              <form onSubmit={onSubmit} className="space-y-stack-md">
                {error && (
                  <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm">
                    {error}
                  </div>
                )}
                <Input
                  label="New Password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  icon="lock"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  icon="lock"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading}>Reset Password</Button>
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
