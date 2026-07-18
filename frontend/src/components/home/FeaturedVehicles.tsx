'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVehicles } from '@/store/actions/vehicleActions';
import VehicleCard from './VehicleCard';

export default function FeaturedVehicles() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.vehicles);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  return (
    <section
      id="featured"
      className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto scroll-mt-24"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline-lg text-headline-lg">Featured Vehicles</h2>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-surface rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">
          {error} — is the backend running on :5001?
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-on-surface-variant font-body-md">
          No vehicles found. Run <code className="font-mono">npm run seed</code> in the backend.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {items.map((v) => (
            <VehicleCard key={v._id} vehicle={v} />
          ))}
        </div>
      )}
    </section>
  );
}
