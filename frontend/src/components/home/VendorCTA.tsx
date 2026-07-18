import Link from 'next/link';

export default function VendorCTA() {
  return (
    <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-stack-lg">
      <div className="bg-primary text-white rounded-xl overflow-hidden flex flex-col md:flex-row items-center">
        <div className="p-10 md:p-16 flex-1">
          <h2 className="font-headline-lg text-headline-lg mb-3">
            Own a vehicle? Start earning.
          </h2>
          <p className="font-body-lg text-body-lg opacity-90 mb-8 max-w-lg">
            List your bike, car or truck on GadiSewa and reach thousands of verified
            renters across Nepal.
          </p>
          <Link
            href="/become-vendor"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors"
          >
            Become a Vendor
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center p-10">
          <span className="material-symbols-outlined text-[160px] opacity-20">
            local_shipping
          </span>
        </div>
      </div>
    </section>
  );
}
