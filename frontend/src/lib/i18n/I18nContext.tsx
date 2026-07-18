'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en, { type Dictionary } from './en';
import ne from './ne';

export type Locale = 'en' | 'ne';

const DICTIONARIES: Record<Locale, Dictionary> = { en, ne };
const LOCALE_KEY = 'gadisewa_locale';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(LOCALE_KEY) : null;
    if (stored === 'en' || stored === 'ne') setLocaleState(stored);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') localStorage.setItem(LOCALE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'en' ? 'ne' : 'en');
  }, [locale, setLocale]);

  const value = useMemo(() => ({ locale, setLocale, toggleLocale }), [locale, setLocale, toggleLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Reads a nested key path (e.g. "nav.login") out of the active dictionary. */
function getByPath(dict: Dictionary, path: string): string {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) return (acc as Record<string, unknown>)[key];
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : path;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');

  const dict = DICTIONARIES[ctx.locale];

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = getByPath(dict, key);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [dict]
  );

  return { t, locale: ctx.locale, setLocale: ctx.setLocale, toggleLocale: ctx.toggleLocale };
}
