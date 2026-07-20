'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
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

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** Recenters the map imperatively when `center` changes from outside (e.g. a search result). */
function Recenter({ center }: { center: [number, number] | null }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) map.setView(center, 14);
  }, [center, map]);
  return null;
}

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
  return (
    <MapContainer
      center={position ?? NEPAL_CENTER}
      zoom={position ? zoom : 7}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && <Marker position={position} icon={markerIcon} />}
      {interactive && onPick && <ClickHandler onPick={onPick} />}
      {interactive && <Recenter center={position} />}
    </MapContainer>
  );
}
