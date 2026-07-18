'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/dashboard/StatCard';
import { statsApi } from '@/api/stats.api';
import { rs } from '@/lib/format';
import type { Overview } from '@/types/stats';

// Sample requests — per-vendor data needs vendor roles (later batch).
const SAMPLE_REQUESTS = [
  { id: 1, name: 'Toyota Hiace', plate: 'BA 2 PA 4567', route: 'Kathmandu → Pokhara', date: '12 Oct', icon: 'airport_shuttle' },
  { id: 2, name: 'Mahindra Scorpio', plate: 'BA 15 CHA 9901', route: 'Local Sightseeing', date: '14 Oct', icon: 'directions_car' },
  { id: 3, name: 'Tata Ace', plate: 'BA 4 CHA 1122', route: 'Chabahil → Kalanki', date: '15 Oct', icon: 'local_shipping' },
];

const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export default function VendorDashboardPage() {
  const [o, setO] = useState<Overview | null>(null);

  useEffect(() => {
    statsApi.overview().then(setO).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg space-y-stack-lg">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Vendor Dashboard</h1>
            <p className="font-body-md text-on-surface-variant">
              Welcome back. Here&apos;s what&apos;s happening with your fleet today.
            </p>
          </div>
          <Link
            href="/vendor/add-vehicle"
            className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span> Add Vehicle
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-stack-md">
          <StatCard icon="directions_car" label="Total Vehicles" value={o?.vehicles ?? '—'} />
          <StatCard icon="calendar_month" label="Active Bookings" value={o?.bookings.confirmed ?? '—'} accent="text-tertiary" />
          <StatCard icon="check_circle" label="Completed Trips" value={o?.bookings.completed ?? '—'} accent="text-on-primary-fixed-variant" />
          <StatCard icon="payments" label="Revenue (NPR)" value={o ? fmtK(o.revenue) : '—'} />
          <StatCard icon="star" label="Avg Rating" value={o?.avgRating ?? '—'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          {/* Recent requests */}
          <section className="lg:col-span-2 space-y-stack-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">Recent Booking Requests</h2>
              <span className="font-body-sm text-body-sm text-outline">sample data</span>
            </div>
            <div className="space-y-stack-sm">
              {SAMPLE_REQUESTS.map((r) => (
                <div
                  key={r.id}
                  className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">{r.icon}</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface">{r.name} <span className="text-on-surface-variant">({r.plate})</span></div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{r.route} • {r.date}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors">Accept</button>
                    <button className="bg-error text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quality report */}
          <section className="space-y-stack-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Monthly Quality Report</h2>
            <div className="bg-primary text-white p-stack-lg rounded-xl shadow-lg space-y-4">
              <span className="material-symbols-outlined text-[40px]">workspace_premium</span>
              <p className="font-headline-sm text-headline-sm">You&apos;re a Top-Rated Vendor!</p>
              <p className="font-body-sm text-body-sm opacity-90">
                Maintain a {o?.avgRating ?? '4.8'}+ rating and 95% response rate to keep your premium badge and ranking.
              </p>
              <div className="bg-white/15 rounded-lg p-3 flex items-center justify-between">
                <span className="font-body-sm text-body-sm">Response Rate</span>
                <span className="font-headline-sm text-headline-sm">98%</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
