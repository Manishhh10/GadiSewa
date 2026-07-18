'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const CATEGORIES = ['Vehicle damage', 'Late return', 'Payment problem', 'Vendor behaviour', 'Safety / Emergency', 'Other'];

export default function ReportIssuePage() {
  const [form, setForm] = useState({ category: CATEGORIES[0], bookingRef: '', description: '' });
  const [sent, setSent] = useState(false);

  const inputCls =
    'w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true); // demo — no support backend
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-stack-lg">
        <div className="w-full max-w-[600px]">
          {sent ? (
            <div className="bg-surface-container-lowest rounded-xl p-10 border border-outline-variant text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary-container/15 mb-4">
                <span className="material-symbols-outlined text-[36px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              </div>
              <h1 className="font-headline-md text-headline-md mb-2">Issue reported</h1>
              <p className="font-body-md text-on-surface-variant mb-6">
                Our 24/7 support team will reach out shortly. Thanks for keeping GadiSewa safe.
              </p>
              <Link href="/" className="text-primary font-semibold hover:underline">← Back Home</Link>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant shadow-sm">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Report an Issue</h1>
                <p className="font-body-md text-on-surface-variant">Tell us what went wrong and we&apos;ll help resolve it.</p>
              </div>
              <form onSubmit={onSubmit} className="space-y-stack-md">
                <div className="space-y-unit">
                  <label htmlFor="category" className="block font-label-md text-label-md text-on-surface mb-2">Issue Type</label>
                  <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Booking Reference (optional)" id="bookingRef" placeholder="GS-789-2024" icon="tag" value={form.bookingRef} onChange={(e) => setForm({ ...form, bookingRef: e.target.value })} />
                <div className="space-y-unit">
                  <label htmlFor="description" className="block font-label-md text-label-md text-on-surface mb-2">Description</label>
                  <textarea id="description" rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the issue in detail…" className={inputCls} />
                </div>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-1">add_a_photo</span>
                  <span className="font-body-sm text-body-sm">Attach photos (optional)</span>
                </div>
                <Button type="submit">Submit Report</Button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
