import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Sample data — a Review model can be added later to make this live.
const REVIEWS = [
  { id: 1, vehicle: 'Royal Enfield Classic 350', rating: 2, user: 'anish', comment: 'Bike had engine issues, not as described.', flagged: true },
  { id: 2, vehicle: 'Mahindra Scorpio S11', rating: 5, user: 'maya', comment: 'Excellent — very clean and right on time!', flagged: false },
  { id: 3, vehicle: 'Toyota Hiace', rating: 1, user: 'spam_user', comment: 'Visit my site for cheap rentals!!! www…', flagged: true },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center text-primary">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < n ? "'FILL' 1" : "'FILL' 0" }}>
          star
        </span>
      ))}
    </span>
  );
}

export default function MonitorReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-lg">
        <Link href="/admin" className="flex items-center gap-1 text-primary mb-3 font-label-md text-label-md hover:underline w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Admin Dashboard
        </Link>
        <div className="flex items-center justify-between mb-stack-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Monitor Reviews</h1>
            <p className="font-body-md text-on-surface-variant">Keep the marketplace trustworthy — hide spam or abusive reviews.</p>
          </div>
          <span className="font-body-sm text-body-sm text-outline">sample data</span>
        </div>

        <div className="space-y-stack-sm">
          {REVIEWS.map((r) => (
            <div key={r.id} className={`bg-surface-container-lowest p-stack-md rounded-xl border ${r.flagged ? 'border-error/40' : 'border-outline-variant'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-headline-sm text-headline-sm">{r.vehicle}</span>
                  <Stars n={r.rating} />
                  {r.flagged && <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-error-container text-on-error-container">Flagged</span>}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">“{r.comment}”</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">— @{r.user}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="border border-error text-error px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-error/5 transition-all">Hide</button>
                <button className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">Keep</button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
