'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VehicleCard from '@/components/home/VehicleCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVehicles } from '@/store/actions/vehicleActions';
import { useTranslation } from '@/lib/i18n/I18nContext';

const TYPES = ['All', 'Bike', 'Car', 'SUV', 'Van', 'Truck'];

export default function RenterDashboardPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { items, loading, error } = useAppSelector((s) => s.vehicles);
  const [type, setType] = useState('All');
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(
      fetchVehicles({
        type: type === 'All' ? undefined : type,
        q: q || undefined,
      })
    );
    // refetch when the type filter changes (search box refetches on submit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, type]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    dispatch(
      fetchVehicles({ type: type === 'All' ? undefined : type, q: q || undefined })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <header className="bg-surface-container-low py-8">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <form
            onSubmit={onSearch}
            className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant flex flex-col md:flex-row gap-3 items-center"
          >
            <div className="flex-1 w-full flex items-center gap-2 px-4 py-2 bg-surface rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-outline">search</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('dashboard.searchPlaceholder')}
                className="bg-transparent w-full outline-none font-body-md text-body-md"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-primary-container text-white px-8 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all"
            >
              {t('dashboard.search')}
            </button>
          </form>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant space-y-5 md:sticky md:top-24">
            <h2 className="font-headline-sm text-headline-sm">{t('dashboard.filters')}</h2>
            <div>
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
                {t('dashboard.vehicleTypeLabel')}
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1 rounded-full font-label-md text-label-md border transition-all ${
                      type === t
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
                {t('dashboard.priceRange')}
              </span>
              <input type="range" min={500} max={15000} defaultValue={8000} className="w-full accent-primary mt-2" />
              <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span>500</span>
                <span>15,000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Listing */}
        <section className="flex-1">
          <div className="mb-6">
            <h1 className="font-headline-lg text-headline-lg">{t('dashboard.availableVehicles')}</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {loading ? t('dashboard.searching') : `${items.length} ${t('dashboard.vehiclesFound')}`}
            </p>
          </div>

          {error && !loading && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-md">
              {error}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-80 bg-surface rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="text-on-surface-variant font-body-md">{t('dashboard.noMatch')}</p>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {items.map((v) => (
                <VehicleCard key={v._id} vehicle={v} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
