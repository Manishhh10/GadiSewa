'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useTranslation } from '@/lib/i18n/I18nContext';
import { vendorApi } from '@/api/vendor.api';

const NAV_LINKS_CLS =
  'text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function Navbar() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t, locale, toggleLocale } = useTranslation();
  const [hasPendingApplication, setHasPendingApplication] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.role !== 'renter') {
      setHasPendingApplication(false);
      return;
    }
    vendorApi
      .myApplications()
      .then((apps) => setHasPendingApplication(apps.some((a) => a.status === 'pending')))
      .catch(() => {});
  }, [user?.role]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const isVendor = user?.role === 'vendor' || user?.role === 'admin';

  const onLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    router.push('/');
  };

  const primaryLinks = (
    <>
      <Link href="/dashboard" className={NAV_LINKS_CLS} onClick={() => setMobileNavOpen(false)}>
        {t('nav.renters')}
      </Link>
      <Link
        href={isVendor ? '/vendor' : '/vendor/apply'}
        className={`relative ${NAV_LINKS_CLS}`}
        onClick={() => setMobileNavOpen(false)}
      >
        {t('nav.vendors')}
        {hasPendingApplication && (
          <span
            title="Your vendor application is under review"
            className="absolute -top-1 -right-2.5 w-2 h-2 rounded-full bg-primary"
          />
        )}
      </Link>
      {user?.role === 'admin' && (
        <Link href="/admin" className={NAV_LINKS_CLS} onClick={() => setMobileNavOpen(false)}>
          {t('nav.admin')}
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto w-full gap-4">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight shrink-0"
        >
          GadiSewa
        </Link>

        <div className="hidden md:flex items-center gap-stack-lg">{primaryLinks}</div>

        <div className="flex items-center gap-4">
          <Link
            href="/help"
            title="Help Center"
            aria-label="Help Center"
            className="hidden sm:flex items-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">help</span>
          </Link>

          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t('nav.changeLanguage')}
            title={t('nav.changeLanguage')}
            className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">language</span>
            <span className="uppercase">{locale === 'en' ? 'ने' : 'EN'}</span>
          </button>

          {user ? (
            <div ref={menuRef} className="relative group">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container text-white font-label-md text-label-md overflow-hidden ring-2 ring-transparent hover:ring-primary/30 transition-all"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials(user.fullName || user.username)
                )}
              </button>

              <div
                role="menu"
                className={`absolute right-0 top-full pt-2 w-64 z-50 ${
                  menuOpen ? 'block' : 'hidden group-hover:block'
                }`}
              >
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-outline-variant/60">
                    <p className="font-label-md text-label-md text-on-surface truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{user.email}</p>
                  </div>
                  <MenuLink href="/bookings" icon="confirmation_number" onNavigate={() => setMenuOpen(false)}>
                    {t('nav.myBookings')}
                  </MenuLink>
                  <MenuLink href="/dashboard" icon="directions_car" onNavigate={() => setMenuOpen(false)}>
                    {t('nav.renterDashboard')}
                  </MenuLink>
                  <MenuLink
                    href={isVendor ? '/vendor' : '/vendor/apply'}
                    icon="storefront"
                    onNavigate={() => setMenuOpen(false)}
                  >
                    {isVendor ? t('nav.vendorDashboard') : t('nav.becomeVendor')}
                  </MenuLink>
                  <MenuLink href="/profile" icon="person" onNavigate={() => setMenuOpen(false)}>
                    {t('nav.profile')}
                  </MenuLink>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 font-label-md text-label-md text-error hover:bg-error/5 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary-container text-white px-4 sm:px-6 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform whitespace-nowrap"
            >
              {t('nav.login')}
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined">{mobileNavOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {mobileNavOpen && (
        <div className="md:hidden border-t border-outline-variant/60 px-margin-mobile py-4 flex flex-col gap-4 bg-surface">
          {primaryLinks}
          <Link
            href="/help"
            className={NAV_LINKS_CLS}
            onClick={() => setMobileNavOpen(false)}
          >
            Help Center
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            className="sm:hidden flex items-center gap-1 text-on-surface-variant font-label-md text-label-md w-fit"
          >
            <span className="material-symbols-outlined">language</span>
            <span className="uppercase">{locale === 'en' ? 'ने' : 'EN'}</span>
          </button>
        </div>
      )}
    </header>
  );
}

function MenuLink({
  href,
  icon,
  children,
  onNavigate,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      role="menuitem"
      className="flex items-center gap-3 px-4 py-3 font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors"
    >
      <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{icon}</span>
      {children}
    </Link>
  );
}
