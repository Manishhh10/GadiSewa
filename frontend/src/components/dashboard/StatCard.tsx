export default function StatCard({
  icon,
  label,
  value,
  accent = 'text-primary',
}: {
  icon: string;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="bg-surface-container-low p-4 rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant/30">
      <span className={`material-symbols-outlined ${accent} text-[28px] mb-2 block`}>{icon}</span>
      <div className="font-body-sm text-body-sm text-on-surface-variant mb-1">{label}</div>
      <div className="font-headline-md text-headline-md font-bold text-on-surface">{value}</div>
    </div>
  );
}
