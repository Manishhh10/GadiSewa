'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

const CATEGORIES = [
  { key: 'front_bumper', label: 'Front Bumper', icon: 'directions_car', hint: 'Scratches, dents, or misaligned grill.' },
  { key: 'rear_bumper', label: 'Rear Bumper', icon: 'directions_car', hint: 'Dents, cracks, or paint damage.' },
  { key: 'left_side', label: 'Left Side', icon: 'side_navigation', hint: 'Doors, mirrors and panels.' },
  { key: 'right_side', label: 'Right Side', icon: 'side_navigation', hint: 'Doors, mirrors and panels.' },
  { key: 'interior', label: 'Interior', icon: 'airline_seat_recline_normal', hint: 'Seats, dashboard and upholstery.' },
  { key: 'windshield', label: 'Windshield & Glass', icon: 'window', hint: 'Cracks or chips on any glass.' },
  { key: 'tyres', label: 'Tyres', icon: 'tire_repair', hint: 'Tread, pressure and rims.' },
];
const OPTIONS = [
  { v: 'none', label: 'No Damage' },
  { v: 'minor', label: 'Minor' },
  { v: 'major', label: 'Major' },
];

export default function DamageChecklistPage() {
  const [state, setState] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const completed = Object.keys(state).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="mb-stack-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Damage Checklist</h1>
          <p className="font-body-md text-on-surface-variant">Pre-rental condition assessment — protects both you and the vendor.</p>
        </div>

        <div className="bg-secondary-container border-l-4 border-primary p-stack-md rounded-lg flex items-start gap-3 mb-stack-lg">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="font-body-sm text-body-sm text-on-secondary-container">
            Both renter and vendor should submit this checklist before the trip begins to ensure insurance coverage and clear liability.
          </p>
        </div>

        {done ? (
          <div className="bg-surface-container-lowest rounded-xl p-10 border border-outline-variant text-center shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
            <h2 className="font-headline-md text-headline-md mt-2 mb-1">Checklist submitted</h2>
            <p className="font-body-md text-on-surface-variant mb-6">Your vehicle condition report has been saved for this trip.</p>
            <Link href="/active-trip" className="text-primary font-semibold hover:underline">← Back to Trip</Link>
          </div>
        ) : (
          <>
            <div className="space-y-stack-md">
              {CATEGORIES.map((c) => (
                <section key={c.key} className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant flex flex-col md:flex-row gap-stack-lg">
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-headline-sm mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">{c.icon}</span> {c.label}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-stack-md">{c.hint}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {OPTIONS.map((o) => {
                        const active = state[c.key] === o.v;
                        return (
                          <button
                            key={o.v}
                            type="button"
                            onClick={() => setState((s) => ({ ...s, [c.key]: o.v }))}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-label-md text-label-md transition-colors ${
                              active ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant text-on-surface hover:bg-surface-container'
                            }`}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="w-full md:w-32 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-xl p-stack-sm bg-surface-container-low text-on-surface-variant">
                    <span className="material-symbols-outlined">add_a_photo</span>
                    <span className="text-[10px] uppercase font-bold mt-2">Photo</span>
                  </div>
                </section>
              ))}
            </div>
            <div className="flex items-center justify-between mt-stack-lg">
              <p className="font-body-sm text-body-sm text-on-surface-variant">{completed}/{CATEGORIES.length} sections checked</p>
              <Button type="button" onClick={() => setDone(true)} className="md:w-auto md:px-12">
                Submit Checklist
              </Button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
