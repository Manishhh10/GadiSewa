'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { geocodeApi } from '@/api/location.api';
import type { GeocodeResult } from '@/types/location';

const LeafletMapCore = dynamic(() => import('./LeafletMapCore'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-container text-on-surface-variant">
      Loading map…
    </div>
  ),
});

export interface PickedLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export default function LocationPicker({
  value,
  onChange,
}: {
  value: PickedLocation | null;
  onChange: (loc: PickedLocation) => void;
}) {
  const [query, setQuery] = useState(value?.address ?? '');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(value?.address ?? '');
  }, [value?.address]);

  const onQueryChange = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await geocodeApi.search(q);
        setResults(r);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
  };

  const pickResult = (r: GeocodeResult) => {
    onChange({ address: r.address, latitude: r.latitude, longitude: r.longitude });
    setQuery(r.address);
    setShowResults(false);
    setResults([]);
  };

  const pickOnMap = async (lat: number, lng: number) => {
    // Show the pin immediately with coordinates; fill in the readable address once reverse-geocoding resolves.
    onChange({ address: query || `${lat.toFixed(5)}, ${lng.toFixed(5)}`, latitude: lat, longitude: lng });
    try {
      const address = await geocodeApi.reverse(lat, lng);
      onChange({ address, latitude: lat, longitude: lng });
      setQuery(address);
    } catch {
      // keep the coordinate fallback set above
    }
  };

  const position: [number, number] | null = value ? [value.latitude, value.longitude] : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-outline-variant/40 bg-surface-container-low">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search a location in Nepal…"
            className="w-full bg-transparent outline-none font-body-md text-body-md"
          />
          {searching && <span className="material-symbols-outlined animate-spin text-outline text-[18px]">progress_activity</span>}
        </div>
        {showResults && results.length > 0 && (
          <div className="absolute z-[1000] top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickResult(r)}
                className="w-full text-left px-4 py-2 hover:bg-surface-container font-body-sm text-body-sm border-b border-outline-variant/20 last:border-0"
              >
                {r.address}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="h-64 rounded-xl overflow-hidden border border-outline-variant">
        <LeafletMapCore position={position} onPick={pickOnMap} />
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Search above, or click anywhere on the map to drop a pin.
      </p>
    </div>
  );
}
