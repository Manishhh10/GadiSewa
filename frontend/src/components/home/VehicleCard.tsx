import Link from 'next/link';
import type { Vehicle } from '@/types/vehicle';

const FILLED = { fontVariationSettings: "'FILL' 1" } as const;

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.05)] flex flex-col group">
      <div className="relative h-48 overflow-hidden bg-surface-container">
        {vehicle.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={vehicle.name}
            src={vehicle.imageUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-5xl">directions_car</span>
          </div>
        )}
        {vehicle.verified && (
          <div className="absolute top-3 right-3 bg-tertiary-container/20 text-tertiary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md">
            <span className="material-symbols-outlined text-[14px]" style={FILLED}>
              verified
            </span>
            Verified
          </div>
        )}
      </div>

      <div className="p-stack-md flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link
            href={`/vehicles/${vehicle._id}`}
            className="font-headline-md text-headline-md hover:text-primary transition-colors"
          >
            {vehicle.name}
          </Link>
          <div className="flex items-center text-primary shrink-0 ml-2">
            <span className="material-symbols-outlined text-[18px]" style={FILLED}>
              star
            </span>
            <span className="font-bold ml-1">{vehicle.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-4 text-secondary text-sm">
          {vehicle.specs.map((s) => (
            <span key={s.label} className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
              {s.label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant">
          <div>
            <span className="text-secondary text-xs uppercase tracking-wider block">
              Daily Rate
            </span>
            <span className="font-headline-md text-primary">
              Rs. {vehicle.dailyRate.toLocaleString()}
            </span>
          </div>
          <Link
            href={`/vehicles/${vehicle._id}`}
            className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-md text-label-md active:scale-95 transition-transform inline-block"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
