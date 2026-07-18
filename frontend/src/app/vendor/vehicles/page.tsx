'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RequireRole from '@/components/auth/RequireRole';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteVehicle, fetchMyVehicles, updateVehicle } from '@/store/actions/vehicleActions';
import { rs } from '@/lib/format';
import type { Vehicle, VehicleType } from '@/types/vehicle';

const TYPES: VehicleType[] = ['Bike', 'Car', 'SUV', 'Van', 'Truck'];

export default function MyVehiclesPage() {
  const dispatch = useAppDispatch();
  const { mine, mineLoading, mineError } = useAppSelector((s) => s.vehicles);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyVehicles());
  }, [dispatch]);

  const onDelete = async (v: Vehicle) => {
    if (!window.confirm(`Delete "${v.name}"? This cannot be undone.`)) return;
    await dispatch(deleteVehicle(v._id));
  };

  return (
    <RequireRole roles={['vendor', 'admin']}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg space-y-stack-lg">
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">My Vehicles</h1>
              <p className="font-body-md text-on-surface-variant">
                Manage the listings you own — edit details or remove a listing.
              </p>
            </div>
            <Link
              href="/vendor/add-vehicle"
              className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add</span> Add Vehicle
            </Link>
          </div>

          {mineLoading && <p className="font-body-md text-on-surface-variant">Loading your vehicles…</p>}
          {mineError && !mineLoading && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">
              {mineError}
            </div>
          )}

          {!mineLoading && !mineError && mine.length === 0 && (
            <div className="border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-stack-lg text-center">
              <p className="font-headline-md text-headline-md text-on-surface">No vehicles listed yet</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Add your first vehicle to start receiving bookings.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
            {mine.map((v) =>
              editingId === v._id ? (
                <EditVehicleCard key={v._id} vehicle={v} onDone={() => setEditingId(null)} />
              ) : (
                <div
                  key={v._id}
                  className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden flex flex-col"
                >
                  <div className="h-40 bg-surface-container">
                    {v.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-4xl">directions_car</span>
                      </div>
                    )}
                  </div>
                  <div className="p-stack-md flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline-md text-headline-md">{v.name}</h3>
                      {v.verified ? (
                        <span className="text-tertiary text-xs font-bold uppercase">Verified</span>
                      ) : (
                        <span className="text-outline text-xs font-bold uppercase">Pending review</span>
                      )}
                    </div>
                    <p className="text-on-surface-variant font-body-sm text-body-sm">{v.type} · {v.location}</p>
                    <p className="font-headline-sm text-headline-sm text-primary">{rs(v.dailyRate)}<span className="text-body-sm text-on-surface-variant font-body-sm"> / day</span></p>
                    <div className="mt-auto flex gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(v._id)}
                        className="flex-1 border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(v)}
                        className="flex-1 border border-error text-error px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-error/5 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
        <Footer />
      </div>
    </RequireRole>
  );
}

function EditVehicleCard({ vehicle, onDone }: { vehicle: Vehicle; onDone: () => void }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    name: vehicle.name,
    type: vehicle.type,
    dailyRate: String(vehicle.dailyRate),
    location: vehicle.location || '',
    imageUrl: vehicle.imageUrl,
    description: vehicle.description,
  });
  const [saving, setSaving] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const onSave = async () => {
    setSaving(true);
    await dispatch(
      updateVehicle({
        id: vehicle._id,
        payload: {
          name: form.name,
          type: form.type as VehicleType,
          dailyRate: Number(form.dailyRate),
          location: form.location,
          imageUrl: form.imageUrl,
          description: form.description,
        },
      })
    );
    setSaving(false);
    onDone();
  };

  return (
    <div className="bg-surface-container-low rounded-xl border border-primary p-stack-md space-y-3">
      <Input label="Name" value={form.name} onChange={set('name')} />
      <div className="space-y-unit">
        <label className="block font-label-md text-label-md text-on-surface mb-1">Type</label>
        <select
          value={form.type}
          onChange={set('type')}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-md text-body-md"
        >
          {TYPES.map((ty) => (
            <option key={ty} value={ty}>{ty}</option>
          ))}
        </select>
      </div>
      <Input label="Daily Rate (NPR)" type="number" value={form.dailyRate} onChange={set('dailyRate')} />
      <Input label="Location" value={form.location} onChange={set('location')} />
      <Input label="Cover Image URL" value={form.imageUrl} onChange={set('imageUrl')} />
      <div className="flex gap-2 pt-2">
        <Button onClick={onSave} loading={saving} className="flex-1">Save</Button>
        <Button variant="ghost" onClick={onDone} className="flex-1" type="button">Cancel</Button>
      </div>
    </div>
  );
}
