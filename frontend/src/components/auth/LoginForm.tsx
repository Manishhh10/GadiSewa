'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/actions/authActions';
import { clearError } from '@/store/slices/authSlice';
import type { LoginPayload } from '@/types/auth';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      router.push('/');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-stack-md">
      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm">
          {error}
        </div>
      )}

      <Input
        label="Email Address"
        id="email"
        name="email"
        type="email"
        placeholder="name@example.com"
        icon="mail"
        value={form.email}
        onChange={onChange}
        required
      />
      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="••••••••"
        icon="lock"
        value={form.password}
        onChange={onChange}
        required
      />

      <div className="flex justify-end -mt-1">
        <Link
          href="/forgot-password"
          className="font-label-md text-label-md text-primary hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" loading={loading}>
        Sign In
      </Button>

      <div className="text-center pt-stack-sm">
        <p className="font-body-md text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}
