'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import RequireRole from '@/components/auth/RequireRole';
import { useAppSelector } from '@/store/hooks';
import { vehicleApi } from '@/api/vehicle.api';
import type { NormalizedError } from '@/lib/axios';
import type { VehicleType } from '@/types/vehicle';

const TYPES: VehicleType[] = ['Bike', 'Car', 'SUV', 'Van', 'Truck'];
const STEPS = ['Photos', 'Documents', 'Details', 'Location', 'Review'];
const PHOTO_SLOTS = ['Front', 'Back', 'Interior', 'Dashboard', 'Odometer'];

export default function AddVehiclePage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [form, setForm] = useState({
    name: '',
    type: 'Car' as VehicleType,
    dailyRate: '',
    seats: '',
    transmission: '',
    fuelType: '',
    location: '',
    imageUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!form.name || !form.dailyRate) {
      setError('Vehicle name and daily rate are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const v = await vehicleApi.create({
        name: form.name,
        type: form.type,
        dailyRate: Number(form.dailyRate),
        seats: form.seats || undefined,
        transmission: form.transmission || undefined,
        fuelType: form.fuelType || undefined,
        location: form.location || undefined,
        imageUrl: form.imageUrl || undefined,
        description: form.description || undefined,
      });
      router.push(`/vehicles/${v._id}`);
    } catch (err) {
      setError((err as NormalizedError).message);
      setLoading(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all';

  return (
    <RequireRole roles={['vendor', 'admin']}>
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="mb-stack-lg">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">List Your Vehicle</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Add your vehicle details to make it available for rent across Nepal.
          </p>
        </div>

        {/* Stepper (visual) */}
        <div className="flex items-center justify-between mb-stack-lg overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md ${
                  i === 2 ? 'bg-primary text-white' : 'border-2 border-outline-variant text-on-surface-variant'
                }`}
              >
                {i + 1}
              </div>
              <span className={`font-label-md text-label-md whitespace-nowrap ${i === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-8 md:w-16 h-px bg-outline-variant mx-2" />}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-stack-lg">
          {/* Photos (placeholder) */}
          <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-sm border border-outline-variant">
            <div className="flex items-center justify-between mb-stack-md">
              <h2 className="font-headline-md text-headline-md">Photos</h2>
              <span className="font-body-sm text-body-sm text-outline">upload UI — use Image URL below for the cover</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-stack-md">
              {PHOTO_SLOTS.map((slot) => (
                <div key={slot} className="flex flex-col items-center gap-2">
                  <div className="w-full aspect-square bg-surface-container border-2 border-dashed border-outline rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant text-3xl">image</span>
                    <span className="text-[10px] text-on-surface-variant font-medium mt-1">{slot}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Details (real) */}
          <section className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-sm border border-outline-variant">
            <h2 className="font-headline-md text-headline-md mb-stack-md">Vehicle Details</h2>
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm mb-stack-md">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <Input label="Vehicle Name" id="name" placeholder="e.g. Hyundai Creta 2023" value={form.name} onChange={set('name')} required />
              <div className="space-y-unit">
                <label htmlFor="type" className="block font-label-md text-label-md text-on-surface mb-2">Vehicle Type</label>
                <select id="type" value={form.type} onChange={set('type')} className={inputCls}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <Input label="Daily Rate (NPR)" id="dailyRate" type="number" placeholder="8500" value={form.dailyRate} onChange={set('dailyRate')} required />
              <Input label="Seats" id="seats" placeholder="5" value={form.seats} onChange={set('seats')} />
              <Input label="Transmission" id="transmission" placeholder="Automatic / Manual" value={form.transmission} onChange={set('transmission')} />
              <Input label="Fuel Type" id="fuelType" placeholder="Petrol / Diesel" value={form.fuelType} onChange={set('fuelType')} />
              <Input label="Location" id="location" placeholder="Kathmandu" icon="location_on" value={form.location} onChange={set('location')} />
              <Input label="Cover Image URL" id="imageUrl" placeholder="https://…" icon="image" value={form.imageUrl} onChange={set('imageUrl')} />
            </div>
            <div className="space-y-unit mt-stack-md">
              <label htmlFor="description" className="block font-label-md text-label-md text-on-surface mb-2">Description</label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={set('description')}
                placeholder="Describe your vehicle, its condition and what makes it great…"
                className={inputCls}
              />
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Button type="submit" loading={loading} className="md:w-auto md:px-12">
              {user ? 'List Vehicle' : 'Login to List'}
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
    </RequireRole>
  );
}
