'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatCard from '@/components/dashboard/StatCard';
import ApplicationActions from '@/components/admin/ApplicationActions';
import { statsApi } from '@/api/stats.api';
import { adminApi } from '@/api/admin.api';
import { vehicleApi } from '@/api/vehicle.api';
import { useToast } from '@/lib/toast/ToastContext';
import type { NormalizedError } from '@/lib/axios';
import type { Overview } from '@/types/stats';
import type { AdminApplication, AdminVehicle } from '@/types/admin';

const LINKS = [
  { icon: 'how_to_reg', label: 'Review Vendor Applications', href: '/admin/applications' },
  { icon: 'fact_check', label: 'Review Vehicle Listings', href: '/admin/listings' },
  { icon: 'gavel', label: 'Resolve Disputes', href: '/admin/disputes' },
];

export default function AdminDashboardPage() {
  const toast = useToast();
  const [o, setO] = useState<Overview | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    statsApi.overview().then(setO).catch(() => {});
    Promise.all([adminApi.getApplications('pending'), adminApi.getVehicles()])
      .then(([apps, vehs]) => {
        setApplications(apps);
        setVehicles(vehs.filter((v) => !v.verified));
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onApplicationUpdated = (updated: AdminApplication) => {
    setApplications((prev) => prev.filter((a) => a._id !== updated._id));
  };

  const approveVehicle = async (v: AdminVehicle) => {
    setActingOn(v._id);
    try {
      await adminApi.verifyVehicle(v._id, true);
      setVehicles((prev) => prev.filter((x) => x._id !== v._id));
      toast.success(`Verified "${v.name}" — the Verified badge is now live.`);
    } catch (err) {
      toast.error((err as NormalizedError).message);
    } finally {
      setActingOn(null);
    }
  };

  const removeVehicle = async (v: AdminVehicle) => {
    if (!window.confirm(`Remove the listing "${v.name}"?`)) return;
    setActingOn(v._id);
    try {
      await vehicleApi.remove(v._id);
      setVehicles((prev) => prev.filter((x) => x._id !== v._id));
      toast.success(`Removed "${v.name}".`);
    } catch (err) {
      toast.error((err as NormalizedError).message);
    } finally {
      setActingOn(null);
    }
  };

  const queueCount = applications.length + vehicles.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg space-y-stack-lg">
        <header>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Admin Dashboard</h1>
          <p className="font-body-md text-on-surface-variant">Platform overview & moderation at a glance.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
          <StatCard icon="group" label="Total Users" value={o?.users ?? '—'} />
          <StatCard icon="directions_car" label="Vehicles" value={o?.vehicles ?? '—'} accent="text-tertiary" />
          <StatCard icon="receipt_long" label="Bookings" value={o?.bookings.total ?? '—'} accent="text-on-primary-fixed-variant" />
          <StatCard icon="pending_actions" label="Pending" value={o?.bookings.pending ?? '—'} accent="text-error" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          {/* Moderation queue */}
          <section className="lg:col-span-2 space-y-stack-md">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Pending Approvals {queueCount > 0 && `(${queueCount})`}
              </h2>
            </div>

            {loading && <p className="font-body-sm text-body-sm text-on-surface-variant">Loading…</p>}
            {!loading && queueCount === 0 && (
              <p className="font-body-sm text-body-sm text-on-surface-variant">Nothing pending review right now.</p>
            )}

            <div className="space-y-stack-sm">
              {applications.map((a) => (
                <div
                  key={`application-${a._id}`}
                  className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant/30 flex flex-col gap-3 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">storefront</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface">{a.businessName}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        Vendor Application • {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ApplicationActions application={a} onUpdated={onApplicationUpdated} />
                </div>
              ))}
              {vehicles.map((v) => (
                <div
                  key={`vehicle-${v._id}`}
                  className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">directions_car</span>
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface">{v.name} — new listing</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Vehicle Listing</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={actingOn === v._id}
                      onClick={() => approveVehicle(v)}
                      className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={actingOn === v._id}
                      onClick={() => removeVehicle(v)}
                      className="border border-error text-error px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-error/5 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
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
