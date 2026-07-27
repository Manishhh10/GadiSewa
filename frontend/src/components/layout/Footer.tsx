'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/I18nContext';

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-label-md text-label-md text-on-surface mb-2">{title}</span>
      {links.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className="font-body-sm text-body-sm text-on-secondary-container hover:text-primary transition-colors"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-secondary-container border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg grid grid-cols-1 md:grid-cols-4 gap-stack-md">
        <div className="flex flex-col gap-4">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
            GadiSewa
          </span>
          <p className="font-body-sm text-body-sm text-on-secondary-container">
            {t('footer.tagline')}
          </p>
        </div>
        <FooterCol
          title={t('footer.company')}
          links={[
            { label: t('footer.aboutUs'), href: '#' },
            { label: t('footer.terms'), href: '#' },
            { label: t('footer.privacy'), href: '#' },
          ]}
        />
        <FooterCol
          title={t('footer.services')}
          links={[
            { label: t('footer.listVehicle'), href: '/vendor/add-vehicle' },
            { label: t('footer.partner'), href: '/vendor/apply' },
            { label: t('footer.contactSupport'), href: '/help' },
          ]}
        />
        <div className="flex flex-col gap-4">
          <span className="font-label-md text-label-md text-on-surface mb-2">{t('footer.followUs')}</span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-secondary-container cursor-pointer hover:text-primary">
              share
            </span>
            <span className="material-symbols-outlined text-on-secondary-container cursor-pointer hover:text-primary">
              public
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-secondary-container mt-auto">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
