'use client';

import { useTranslation } from '@/lib/i18n/I18nContext';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { icon: 'search', title: t('home.step1Title'), desc: t('home.step1Desc') },
    { icon: 'book_online', title: t('home.step2Title'), desc: t('home.step2Desc') },
    { icon: 'local_taxi', title: t('home.step3Title'), desc: t('home.step3Desc') },
  ];

  return (
    <section className="py-20 bg-surface-container-low">
      <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <h2 className="font-headline-lg text-headline-lg text-center mb-12">
          {t('home.howItWorksTitle')}
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
