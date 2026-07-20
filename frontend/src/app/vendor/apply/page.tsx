'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';
import { vendorApi } from '@/api/vendor.api';
import { uploadApi } from '@/api/location.api';
import type { NormalizedError } from '@/lib/axios';
import type { VendorApplication } from '@/types/vendor';

const statusStyle: Record<VendorApplication['status'], string> = {
  pending: 'bg-primary-container/15 text-primary',
  approved: 'bg-tertiary-container/20 text-tertiary',
  rejected: 'bg-error-container text-on-error-container',
};

export default function VendorApplyPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [latestApplication, setLatestApplication] = useState<VendorApplication | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    vehicleCount: '1',
    message: '',
  });
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentUploading, setDocumentUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user) {
      setCheckingStatus(false);
      return;
    }
    vendorApi
      .myApplications()
      .then((apps) => setLatestApplication(apps[0] ?? null))
      .catch(() => {})
      .finally(() => setCheckingStatus(false));
  }, [user]);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const onDocumentSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setDocumentUploading(true);
    setError(null);
    try {
      const [url] = await uploadApi.images([file]);
      setDocumentUrl(url);
    } catch (err) {
      setError((err as NormalizedError).message);
    } finally {
      setDocumentUploading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!documentUrl) {
      setError('Please upload a government ID (citizenship, passport, or national ID).');
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
        documentUrl,
      });
      setDone(true);
    } catch (err) {
      setError((err as NormalizedError).message);
    } finally {
      setLoading(false);
    }
  };

  const canReapply = !latestApplication || latestApplication.status === 'rejected';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        <div className="w-full max-w-[560px]">
          {checkingStatus ? (
            <p className="text-center font-body-md text-on-surface-variant">Loading…</p>
          ) : done ? (
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
              <Link href="/" className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
                Back Home
              </Link>
            </div>
          ) : latestApplication && !canReapply ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Application Status</h1>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${statusStyle[latestApplication.status]}`}>
                  {latestApplication.status}
                </span>
              </div>
              {latestApplication.status === 'pending' && (
                <p className="font-body-md text-on-surface-variant">
                  Your application for <strong>{latestApplication.businessName}</strong> is under review. We&apos;ll email you once a decision is made.
                </p>
              )}
              {latestApplication.status === 'approved' && (
                <>
                  <p className="font-body-md text-on-surface-variant mb-4">
                    You&apos;re already an approved vendor! Head over to list your vehicles.
                  </p>
                  <Link href="/vendor/add-vehicle" className="inline-block bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
                    List a Vehicle
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Vendor Application</h1>
                <p className="font-body-md text-on-surface-variant">
                  Tell us about you and your fleet. It only takes a minute.
                </p>
              </div>

              {latestApplication?.status === 'rejected' && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm mb-stack-md">
                  <p className="font-bold mb-1">Your last application wasn&apos;t approved</p>
                  <p>{latestApplication.rejectionReason}</p>
                  <p className="mt-1">You can address this and apply again below.</p>
                </div>
              )}

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
                  <label className="block font-label-md text-label-md text-on-surface mb-2">
                    Government ID (Citizenship / Passport / National ID)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    onChange={onDocumentSelected}
                  />
                  {documentUrl ? (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-tertiary/40 bg-tertiary-container/10">
                      <span className="material-symbols-outlined text-tertiary">task_alt</span>
                      <a href={documentUrl} target="_blank" rel="noreferrer" className="font-body-sm text-body-sm text-primary hover:underline flex-1 truncate">
                        Document uploaded — view
                      </a>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="font-label-md text-label-md text-on-surface-variant hover:text-primary"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={documentUploading}
                      className="w-full flex flex-col items-center gap-1 px-4 py-6 rounded-lg border-2 border-dashed border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant text-3xl">
                        {documentUploading ? 'progress_activity' : 'upload_file'}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {documentUploading ? 'Uploading…' : 'Click to upload a photo or PDF (max 5MB)'}
                      </span>
                    </button>
                  )}
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
