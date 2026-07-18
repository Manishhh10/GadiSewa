import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Sample data — a Dispute model can be added later to make this live.
const DISPUTES = [
  { id: 1, ref: 'GS-771-2026', issue: 'Vehicle returned with a scratch', renter: 'ramesh', vendor: 'Himalayan Travels', amount: 'Rs. 4,500', status: 'Open' },
  { id: 2, ref: 'GS-802-2026', issue: 'Late pickup — partial refund requested', renter: 'sita', vendor: 'Everest Rides', amount: 'Rs. 2,000', status: 'Investigating' },
  { id: 3, ref: 'GS-559-2026', issue: 'Fuel charge disagreement', renter: 'bikash', vendor: 'Pokhara Cars', amount: 'Rs. 1,200', status: 'Open' },
];

export default function DisputesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <Link href="/admin" className="flex items-center gap-1 text-primary mb-3 font-label-md text-label-md hover:underline w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Admin Dashboard
        </Link>
        <div className="flex items-center justify-between mb-stack-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Resolve Disputes</h1>
            <p className="font-body-md text-on-surface-variant">Mediate issues between renters and vendors.</p>
          </div>
          <span className="font-body-sm text-body-sm text-outline">sample data</span>
        </div>

        <div className="space-y-stack-sm">
          {DISPUTES.map((d) => (
            <div key={d.id} className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-error-container/40 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-error">gavel</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-headline-sm text-headline-sm">{d.issue}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-primary-container/15 text-primary">{d.status}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {d.ref} · @{d.renter} vs {d.vendor} · {d.amount}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="bg-tertiary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">Refund Renter</button>
                <button className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">Side with Vendor</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
