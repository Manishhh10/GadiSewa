'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useTranslation } from '@/lib/i18n/I18nContext';

export default function Navbar() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const { t, locale, toggleLocale } = useTranslation();

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto w-full">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight"
        >
          GadiSewa
        </Link>

        <div className="hidden md:flex items-center gap-stack-lg">
          <Link
            href="/dashboard"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md"
          >
            {t('nav.renters')}
          </Link>
          <Link
            href={user?.role === 'vendor' || user?.role === 'admin' ? '/vendor' : '/vendor/apply'}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md"
          >
            {t('nav.vendors')}
          </Link>
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md"
            >
              {t('nav.admin')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-stack-md">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t('nav.changeLanguage')}
            title={t('nav.changeLanguage')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">language</span>
            <span className="uppercase">{locale === 'en' ? 'ने' : 'EN'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/bookings"
                className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                {t('nav.myBookings')}
              </Link>
              <span className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-on-surface">
                <span className="material-symbols-outlined">account_circle</span>
                {user.fullName || user.username}
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="bg-surface-container text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary-container text-white px-6 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform"
            >
              {t('nav.login')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
