const steps = [
  {
    icon: 'search',
    title: '1. Search',
    desc: 'Enter your location, date, and browse through thousands of verified vehicles in our fleet.',
  },
  {
    icon: 'book_online',
    title: '2. Book',
    desc: 'Choose your vehicle, select insurance options, and confirm with a small token payment.',
  },
  {
    icon: 'local_taxi',
    title: '3. Ride',
    desc: 'Pick up your vehicle or have it delivered to your doorstep. Start your journey with confidence.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <h2 className="font-headline-lg text-headline-lg text-center mb-12">
          How GadiSewa Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div
              key={s.title}
              className="bg-white p-10 rounded-xl shadow-sm text-center border border-outline-variant/30 transition-transform hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-primary-fixed rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">{s.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-3">{s.title}</h3>
              <p className="text-secondary font-body-md">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
