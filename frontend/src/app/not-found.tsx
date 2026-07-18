import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-margin-mobile bg-background">
      <p className="font-headline-xl text-[120px] leading-none font-extrabold text-primary/20 select-none">
        404
      </p>
      <h1 className="font-headline-lg text-headline-lg text-on-surface mt-2">
        Page not found
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get
        you back on the road.
      </p>
      <div className="flex gap-3 mt-8">
        <Link
          href="/"
          className="bg-primary-container text-white px-8 py-3 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-95 transition-all"
        >
          Back to Home
        </Link>
        <Link
          href="/dashboard"
          className="border border-outline-variant text-on-surface px-8 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all"
        >
          Browse Vehicles
        </Link>
      </div>
    </main>
  );
}
