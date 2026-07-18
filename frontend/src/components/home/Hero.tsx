'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/I18nContext';

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD9F-Vc1oYLH2SnzPyew7_x0OzwbIJ4EukIHb55tUsLs0cGgAdh2vschO2jK9Z3c9H67ncR9V2s0bbv38JsqW5soHpIfUaw0ubzjbN9ZIZ6MQTP2Zg5oFH6KVtRXwRAUARrZA0rflqYwENR5R3d0uvyTtxwiRtAa9znmLhX0aNK90F7lkgF8d2EgugF18K-he0YYQv0uOnAtd66F1UnHbCl1fA3_NPgyiv4b-yNy7xET5VU-MrD4RyLWQPL8uUNHneXHUtkcInJ4e0';

export default function Hero() {
  const router = useRouter();
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [when, setWhen] = useState('');
  const [type, setType] = useState('');

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    // Forward every filter to the dashboard, which owns full search/filter UI + results.
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (location) params.set('location', location);
    if (when) params.set('pickupDate', when);
    router.push(`/dashboard${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden py-stack-lg bg-inverse-surface">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Scenic highway through the hills of Nepal"
          src={HERO_IMG}
          className="w-full h-full object-cover brightness-[0.4]"
        />
      </div>

      <div className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop text-center text-white">
        <h1 className="font-headline-xl text-headline-xl mb-stack-sm drop-shadow-lg">
          {t('home.heroTitle')}
        </h1>
        <p className="font-body-lg text-body-lg mb-10 opacity-90">
          {t('home.heroSubtitle')}
        </p>

        <form
          onSubmit={onSearch}
          className="bg-white p-4 md:p-2 rounded-xl md:rounded-full shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2"
        >
          <div className="w-full flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-surface-container">
            <span className="material-symbols-outlined text-secondary mr-2">location_on</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full py-3 border-none outline-none focus:ring-0 text-on-surface placeholder:text-secondary font-body-md"
              placeholder={t('home.whereTo')}
              type="text"
            />
          </div>
          <div className="w-full flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-surface-container">
            <span className="material-symbols-outlined text-secondary mr-2">calendar_today</span>
            <input
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="w-full py-3 border-none outline-none focus:ring-0 text-on-surface placeholder:text-secondary font-body-md"
              title={t('home.when')}
              type="date"
            />
          </div>
          <div className="w-full flex-1 flex items-center px-4">
            <span className="material-symbols-outlined text-secondary mr-2">directions_car</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full py-3 border-none outline-none focus:ring-0 text-on-surface bg-transparent font-body-md"
            >
              <option value="">{t('home.vehicleType')}</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-primary-container text-white px-10 py-4 rounded-xl md:rounded-full font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all"
          >
            {t('home.search')}
          </button>
        </form>
      </div>
    </section>
  );
}
