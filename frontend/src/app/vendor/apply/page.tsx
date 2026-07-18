'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';
import { vendorApi } from '@/api/vendor.api';
import type { NormalizedError } from '@/lib/axios';

export default function VendorApplyPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [form, setForm] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    vehicleCount: '1',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await vendorApi.apply({
        fullName: form.fullName,
        businessName: form.businessName,
        phone: form.phone,
        vehicleCount: Number(form.vehicleCount) || 1,
        message: form.message,
      });
      setDone(true);
    } catch (err) {
      setError((err as NormalizedError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        <div className="w-full max-w-[560px]">
          {done ? (
            <div className="bg-surface-container-lowest rounded-xl p-10 border border-outline-variant text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tertiary-container/15 mb-4">
                <span className="material-symbols-outlined text-[48px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg mb-2">Application submitted!</h1>
              <p className="font-body-md text-on-surface-variant mb-6">
                Thanks {form.fullName || 'there'} — our team will review your application and get back within 1–2 days.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/vendor/add-vehicle" className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
                  List a Vehicle
                </Link>
                <Link href="/" className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
                  Back Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Vendor Application</h1>
                <p className="font-body-md text-on-surface-variant">
                  Tell us about you and your fleet. It only takes a minute.
                </p>
              </div>
              <form onSubmit={onSubmit} className="space-y-stack-md">
                {error && (
                  <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm">
                    {error}
                  </div>
                )}
                <Input label="Full Name" id="fullName" name="fullName" placeholder="Sagar Shrestha" icon="person" value={form.fullName} onChange={set('fullName')} required />
                <Input label="Business / Brand Name" id="businessName" name="businessName" placeholder="Himalayan Travels" icon="storefront" value={form.businessName} onChange={set('businessName')} required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Phone" id="phone" name="phone" type="tel" placeholder="98XXXXXXXX" icon="call" value={form.phone} onChange={set('phone')} required />
                  <Input label="Number of Vehicles" id="vehicleCount" name="vehicleCount" type="number" placeholder="1" icon="directions_car" value={form.vehicleCount} onChange={set('vehicleCount')} />
                </div>
                <div className="space-y-unit">
                  <label htmlFor="message" className="block font-label-md text-label-md text-on-surface mb-2">Anything else? (optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Tell us about your vehicles…"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all"
                  />
                </div>
                <Button type="submit" loading={loading}>
                  {user ? 'Submit Application' : 'Login to Apply'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
