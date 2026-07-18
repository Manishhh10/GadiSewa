'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/dashboard/StatCard';
import { statsApi } from '@/api/stats.api';
import { rs } from '@/lib/format';
import type { Overview } from '@/types/stats';

// Sample moderation queue — wired to real data once roles/applications exist.
const SAMPLE_QUEUE = [
  { id: 1, name: 'Himalayan Travels', kind: 'Vendor Application', date: 'Today', icon: 'storefront' },
  { id: 2, name: 'Everest Rides', kind: 'Vendor Application', date: 'Yesterday', icon: 'storefront' },
  { id: 3, name: 'Tata Winger — new listing', kind: 'Vehicle Listing', date: '2 days ago', icon: 'directions_car' },
];

const LINKS = [
  { icon: 'how_to_reg', label: 'Review Vendor Applications', href: '/admin/applications' },
  { icon: 'fact_check', label: 'Review Vehicle Listings', href: '/admin/listings' },
  { icon: 'gavel', label: 'Resolve Disputes', href: '/admin/disputes' },
  { icon: 'reviews', label: 'Monitor Reviews', href: '/admin/reviews' },
];

export default function AdminDashboardPage() {
  const [o, setO] = useState<Overview | null>(null);

  useEffect(() => {
    statsApi.overview().then(setO).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg space-y-stack-lg">
        <header>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Admin Dashboard</h1>
          <p className="font-body-md text-on-surface-variant">Platform overview & moderation at a glance.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-stack-md">
          <StatCard icon="group" label="Total Users" value={o?.users ?? '—'} />
          <StatCard icon="directions_car" label="Vehicles" value={o?.vehicles ?? '—'} accent="text-tertiary" />
          <StatCard icon="receipt_long" label="Bookings" value={o?.bookings.total ?? '—'} accent="text-on-primary-fixed-variant" />
          <StatCard icon="payments" label="Revenue (NPR)" value={o ? rs(o.revenue).replace('Rs. ', '') : '—'} />
          <StatCard icon="pending_actions" label="Pending" value={o?.bookings.pending ?? '—'} accent="text-error" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          {/* Moderation queue */}
          <section className="lg:col-span-2 space-y-stack-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">Pending Approvals</h2>
              <span className="font-body-sm text-body-sm text-outline">sample data</span>
            </div>
            <div className="space-y-stack-sm">
              {SAMPLE_QUEUE.map((q) => (
                <div
                  key={q.id}
                  className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">{q.icon}</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface">{q.name}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{q.kind} • {q.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors">Approve</button>
                    <button className="border border-error text-error px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-error/5 transition-colors">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <section className="space-y-stack-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Moderation Tools</h2>
            <div className="grid grid-cols-1 gap-stack-sm">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-3 hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <span className="material-symbols-outlined text-primary">{l.icon}</span>
                  <span className="font-label-md text-label-md text-on-surface">{l.label}</span>
                  <span className="material-symbols-outlined text-outline ml-auto">chevron_right</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
