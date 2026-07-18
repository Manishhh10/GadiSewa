import Link from 'next/link';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-outline-variant/40 font-body-md text-body-md">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-semibold text-on-surface">{value}</span>
    </div>
  );
}

export default function BookingConfirmationEmailPage() {
  return (
    <div className="min-h-screen bg-surface-container py-12 px-4 flex flex-col items-center">
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">📧 Email preview · Booking Confirmation</p>
      <div className="w-full max-w-[600px] bg-white rounded-2xl overflow-hidden shadow-lg border border-outline-variant">
        <div className="bg-primary text-white p-10 text-center">
          <p className="font-headline-md text-headline-md font-extrabold">GadiSewa</p>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 my-4">
            <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg">Booking Confirmed!</h1>
          <p className="font-body-md text-body-md opacity-90 mt-1">Your vehicle is reserved and ready.</p>
        </div>
        <div className="p-8">
          <p className="font-body-md text-body-md text-on-surface mb-6">Hi there, your payment was successful and your booking is confirmed. Here are the details:</p>
          <div className="bg-surface-container-low rounded-xl p-5 mb-6">
            <Row label="Vehicle" value="Mahindra Scorpio S11" />
            <Row label="Booking Ref" value="GS-789-2026" />
            <Row label="Trip Dates" value="Jul 1 – Jul 4, 2026" />
            <div className="flex justify-between pt-3 font-headline-sm text-headline-sm">
              <span>Total Paid</span>
              <span className="text-primary">Rs. 8,300</span>
            </div>
          </div>
          <Link href="/bookings" className="block w-full text-center bg-primary-container text-white py-4 rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
            View My Booking
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-6">
            Need help? Reply to this email or call +977-1-4XXXXXX
          </p>
        </div>
        <div className="bg-surface-container-low px-8 py-5 text-center font-body-sm text-body-sm text-on-surface-variant">
          © 2024 GadiSewa Nepal · Kathmandu
        </div>
      </div>
      <Link href="/" className="text-primary font-semibold hover:underline mt-6">← Back to app</Link>
    </div>
  );
}
