import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BENEFITS = [
  { icon: 'public', title: 'Reach customers across Nepal', desc: 'Your listing is visible to travelers and locals from Mechi to Mahakali — instant nationwide reach.' },
  { icon: 'dashboard_customize', title: 'Manage everything in one place', desc: 'A simple dashboard to track bookings, earnings, and your fleet — zero hassle.' },
  { icon: 'verified_user', title: 'Verified & secure', desc: 'Every renter is verified and every trip is covered, so your vehicle stays protected.' },
];

export default function BecomeVendorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="px-margin-mobile md:px-margin-desktop py-16 md:py-24 bg-primary-container/5">
          <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-container/15 text-tertiary rounded-full font-label-md text-label-md">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Partner Program 2024
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface">
                Have a vehicle?{' '}
                <span className="text-primary">Earn by listing it</span> on GadiSewa
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                Turn your idle cars, bikes, or trucks into a steady income stream. Join Nepal&apos;s
                most trusted vehicle rental network and reach thousands of customers daily.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/vendor/apply"
                  className="bg-primary-container text-white font-headline-sm text-headline-sm px-10 py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-center"
                >
                  Apply Now
                </Link>
                <Link
                  href="/vendor/add-vehicle"
                  className="bg-surface-container-lowest border border-outline-variant text-on-surface font-headline-sm text-headline-sm px-10 py-4 rounded-xl hover:bg-surface-container-low transition-colors text-center"
                >
                  List a Vehicle
                </Link>
              </div>
            </div>
            <div className="bg-primary text-white rounded-3xl p-10 shadow-2xl">
              <span className="material-symbols-outlined text-[48px] mb-4">trending_up</span>
              <p className="font-headline-xl text-headline-xl">NPR 45,000+</p>
              <p className="font-body-lg text-body-lg opacity-90 mt-2">Average monthly earnings per car listed on GadiSewa.</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/15 rounded-xl p-4">
                  <p className="font-headline-md text-headline-md">10k+</p>
                  <p className="font-body-sm text-body-sm opacity-90">Daily searches</p>
                </div>
                <div className="bg-white/15 rounded-xl p-4">
                  <p className="font-headline-md text-headline-md">0%</p>
                  <p className="font-body-sm text-body-sm opacity-90">Listing fee</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Why Partner with GadiSewa?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                The tools and reach you need to turn your vehicle into a professional business — with zero hassle.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {BENEFITS.map((b) => (
                <div key={b.title} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant">
                  <div className="w-14 h-14 bg-primary-container/10 text-primary rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[32px]">{b.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-3">{b.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{b.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Link
                href="/vendor/apply"
                className="inline-block bg-primary-container text-white font-headline-sm text-headline-sm px-12 py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Become a Vendor
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
