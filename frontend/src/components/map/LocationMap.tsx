'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const LeafletMapCore = dynamic(() => import('./LeafletMapCore'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-surface-container text-on-surface-variant">
      Loading map…
    </div>
  ),
});

export default function LocationMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  return <LeafletMapCore position={[latitude, longitude]} interactive={false} zoom={14} />;
}
