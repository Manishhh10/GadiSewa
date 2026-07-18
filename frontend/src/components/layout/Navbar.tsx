'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

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
            Renters
          </Link>
          <Link
            href="/vendor"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md"
          >
            Vendors
          </Link>
          <Link
            href="/admin"
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-label-md text-label-md"
          >
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-stack-md">
          <button
            aria-label="Change language"
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
          >
            language
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/bookings"
                className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                My Bookings
              </Link>
              <span className="hidden sm:flex items-center gap-1 font-label-md text-label-md text-on-surface">
                <span className="material-symbols-outlined">account_circle</span>
                {user.fullName || user.username}
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="bg-surface-container text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary-container text-white px-6 py-2 rounded-lg font-label-md text-label-md active:scale-95 transition-transform"
            >
              Login/Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
