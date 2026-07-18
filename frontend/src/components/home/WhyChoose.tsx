const items = [
  { icon: 'verified_user', label: 'Verified Vendors', color: 'text-tertiary' },
  { icon: 'photo_camera', label: 'Real Photos', color: 'text-primary' },
  { icon: 'payments', label: 'Transparent Pricing', color: 'text-primary' },
  { icon: 'account_balance_wallet', label: 'eSewa Payments', color: 'text-tertiary' },
  { icon: 'visibility_off', label: 'No Hidden Fees', color: 'text-primary' },
];

export default function WhyChoose() {
  return (
    <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-headline-lg text-headline-lg">Why Choose GadiSewa?</h2>
        <p className="text-on-surface-variant font-body-md mt-2">
          Nepal&apos;s most trusted vehicle rental network.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-stack-md">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center p-6 text-center">
            <span className={`material-symbols-outlined ${it.color} text-4xl mb-3`}>
              {it.icon}
            </span>
            <span className="font-label-md text-label-md">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
