'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Leaflet's default marker icon references relative image paths that break
// under bundlers — point it at the same CDN leaflet's CSS already assumes.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const NEPAL_CENTER: [number, number] = [28.3949, 84.124];

/**
 * A thin, manually-managed wrapper around Leaflet (not react-leaflet's
 * <MapContainer>). react-leaflet's MapContainer doesn't reliably tear down
 * its Leaflet instance across React 18 Strict Mode's dev-time double-mount,
 * which throws "Map container is already initialized" on the second mount.
 * Managing the instance ourselves with an explicit `map.remove()` cleanup
 * sidesteps that entirely.
 */
export default function LeafletMapCore({
  position,
  onPick,
  interactive = true,
  zoom = 12,
}: {
  position: [number, number] | null;
  onPick?: (lat: number, lng: number) => void;
  interactive?: boolean;
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  // Create the map once per mount; always fully tear it down on unmount.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = L.map(el, {
      scrollWheelZoom: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
      zoomControl: interactive,
    }).setView(position ?? NEPAL_CENTER, position ? zoom : 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    if (position) {
      markerRef.current = L.marker(position, { icon: markerIcon }).addTo(map);
    }

    if (interactive) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onPickRef.current?.(e.latlng.lat, e.latlng.lng);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Only re-run if interactivity mode itself changes — position updates are
    // handled by the effect below without tearing down the whole map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  // Move (or create) the marker and recenter when `position` changes, without recreating the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) return;

    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    } else {
      markerRef.current = L.marker(position, { icon: markerIcon }).addTo(map);
    }
    map.setView(position, Math.max(map.getZoom(), zoom));
  }, [position, zoom]);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
