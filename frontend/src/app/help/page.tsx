'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface FaqItem {
  id: string;
  q: string;
  a: React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    id: 'booking',
    q: 'How do I book a vehicle?',
    a: (
      <>
        Search or browse from the homepage, open a vehicle&apos;s detail page, pick your pickup and
        return dates, and review the price breakdown. Once you confirm, you&apos;ll be taken to
        payment — the booking is only created after you&apos;ve reviewed the full cost.
      </>
    ),
  },
  {
    id: 'payment',
    q: 'How does payment work?',
    a: (
      <>
        Payments are handled through eSewa. This build uses eSewa&apos;s official UAT sandbox, so no
        real money moves — use test ID <strong>9711111111</strong>, password{' '}
        <strong>Nepal@123</strong>, and MPIN <strong>1122</strong> to complete a payment. A booking
        is only marked paid after our server independently verifies eSewa&apos;s signed response, so
        the amount charged always matches what you saw before paying.
      </>
    ),
  },
  {
    id: 'cancel',
    q: 'Can I cancel a booking?',
    a: (
      <>
        Yes, from <Link href="/bookings" className="text-primary hover:underline">My Bookings</Link>{' '}
        — cancellation is available any time a booking is still <em>pending</em> or{' '}
        <em>confirmed</em>. Once a trip is active or completed it can no longer be cancelled from
        there.
      </>
    ),
  },
  {
    id: 'vendor',
    q: 'How do I become a vendor and list a vehicle?',
    a: (
      <>
        Apply from{' '}
        <Link href="/vendor/apply" className="text-primary hover:underline">Become a Vendor</Link>{' '}
        with your business details and a government ID (citizenship, passport, or National ID). An
        admin reviews every application — if it&apos;s rejected, you&apos;ll see the specific reason
        and can re-apply. Once approved, you can list vehicles, which also go through a one-time
        admin verification before showing the Verified badge.
      </>
    ),
  },
  {
    id: 'issue',
    q: 'Something went wrong during my trip — what do I do?',
    a: (
      <>
        Open your{' '}
        <Link href="/active-trip" className="text-primary hover:underline">Active Trip</Link> page
        for direct call/email buttons to your vendor, or use{' '}
        <Link href="/report-issue" className="text-primary hover:underline">Report an Issue</Link>{' '}
        to escalate to GadiSewa support. If it can&apos;t be resolved directly with the vendor, our
        admin team mediates and resolves the dispute.
      </>
    ),
  },
  {
    id: 'language',
    q: 'How do I switch between English and Nepali?',
    a: (
      <>
        Click the globe icon in the navigation bar on any page — the whole site switches instantly
        and remembers your choice next time you visit.
      </>
    ),
  },
  {
    id: 'profile',
    q: 'Can I change my email, username, or password?',
    a: (
      <>
        Yes — everything is editable from your{' '}
        <Link href="/profile" className="text-primary hover:underline">Profile</Link> page. Changing
        your email will ask you to re-verify it.
      </>
    ),
  },
  {
    id: 'reviews',
    q: 'When can I leave a review?',
    a: (
      <>
        Once a vendor marks your trip as completed, a review prompt appears on that booking in{' '}
        <Link href="/bookings" className="text-primary hover:underline">My Bookings</Link> and on the
        vehicle&apos;s own page — one review per completed booking.
      </>
    ),
  },
];

export default function HelpPage() {
  const [openId, setOpenId] = useState<string | null>('booking');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-[760px] mx-auto w-full px-margin-mobile py-stack-lg">
        <div className="mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Help Center</h1>
          <p className="font-body-md text-on-surface-variant">
            Answers to the most common questions about booking, payment, and vendors on GadiSewa.
          </p>
        </div>

        <div className="space-y-stack-sm">
          {FAQS.map((item) => {
            const open = openId === item.id;
            return (
              <div
                key={item.id}
                id={item.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-container transition-colors"
                >
                  <span className="font-label-md text-label-md text-on-surface">{item.q}</span>
                  <span className="material-symbols-outlined text-on-surface-variant shrink-0">
                    {open ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-stack-lg bg-secondary-container border-l-4 border-primary p-stack-md rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">support_agent</span>
          <div>
            <p className="font-label-md text-label-md text-on-secondary-container mb-1">
              Still need help?
            </p>
            <p className="font-body-sm text-body-sm text-on-secondary-container">
              <Link href="/report-issue" className="text-primary font-semibold hover:underline">
                Report an issue
              </Link>{' '}
              and our support team will follow up.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
