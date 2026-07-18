import Link from 'next/link';

export default function VendorApprovedEmailPage() {
  return (
    <div className="min-h-screen bg-surface-container py-12 px-4 flex flex-col items-center">
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">📧 Email preview · Vendor Approved</p>
      <div className="w-full max-w-[600px] bg-white rounded-2xl overflow-hidden shadow-lg border border-outline-variant">
        <div className="bg-tertiary text-white p-10 text-center">
          <p className="font-headline-md text-headline-md font-extrabold">GadiSewa</p>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 my-4">
            <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg">You&apos;re a Verified Vendor!</h1>
          <p className="font-body-md text-body-md opacity-90 mt-1">Welcome to the GadiSewa partner network.</p>
        </div>
        <div className="p-8">
          <p className="font-body-md text-body-md text-on-surface mb-4">
            Congratulations! Your vendor application has been approved. You can now list your
            vehicles and start earning.
          </p>
          <ul className="space-y-3 mb-6">
            {['List unlimited vehicles', 'Manage bookings from your dashboard', 'Get paid securely via eSewa'].map((t) => (
              <li key={t} className="flex items-center gap-2 font-body-md text-body-md text-on-surface">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/vendor/add-vehicle" className="block w-full text-center bg-primary-container text-white py-4 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
            List Your First Vehicle
          </Link>
        </div>
        <div className="bg-surface-container-low px-8 py-5 text-center font-body-sm text-body-sm text-on-surface-variant">
          © 2024 GadiSewa Nepal · Kathmandu
        </div>
      </div>
      <Link href="/" className="text-primary font-semibold hover:underline mt-6">← Back to app</Link>
    </div>
  );
}
