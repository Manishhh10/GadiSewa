'use client';

import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import { useTranslation } from '@/lib/i18n/I18nContext';

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBe6rYtjDt6bhNN24T5odJzDZbYIDxYyT6S3TR6G778WFRQbDpeCmTvwoUtFGDrsX4l7mXwNFEGzfb0EFPzwLEu8qkbnsxcTbrePBO89ZylnVNMKaOAn9BRrMUL8Ad3fkHYRgMgbQ-Zkt3-HkcMlHZtW1-08zxjaWwGpjn6d4Gtn89Z5nfHhlkum7pGfyRcx6ik6f8GOkBkXIZaZGEo_9FBwc3HG-i7G_vEgJjPLR0VnkOV9kD27MIvQBU6bGMQt7PolYTn548di6o';

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCIZEoNPuNVe6j5q_uIz-pfw8IAdQ5UW396GKa8mng4tdSBjxuI5Do9cedG9NtLf9xj3PMFWOEuSdNBpoFbrUFhDfioFhZ0NcVoyB_QY2yZA3pubXTaBbK5Z0pOjXO_ja6HPv8VnSVTK3SzWlw-G6lWFIeYd2FUKG-x_w5HhS0IPgXKhmtBtHvoV8VKWAGUTrtRGdIsZbgks5Q5Aqw0ZO-iix9PzfcjHX8i2RoXNJxmD3mjIYewwol1WwasSkHkKRw4kIzyxFkghfY',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC__oeWJ35e8Ah-pTfRKvlPpozPsG-PxtYrxgJ9m0kHhHRRczN2DktzUcagFHoFWJdT8Ab86b2hAeOhOkkgaEgQjceXxUm_PxTj_-IEQdBFqLwB75ouv5weAHggIgtA-LzuhxnT2npkbGMEk0v3W8Q9RPMmgfZFf6w6vHVAFPrhPqEcLI4jbLdf_M90h6bNrJhvgBjTlTX0TFkAcpAPr7jXZThU8MeAmeBP-n3sZ5ukaOYRzKTXvZwbUExDPAXIcDAshU0ywM3KdUg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCuSlr7UbCBYQXK31HX4lR0HT7QQ6y61UHGOFY35RmrwyWgElHFLKo-Pd_iidxOBLDn-b6EUYDPXAEkzPOJdiQ9nI6Hm3i6iuiVB5VqKcONxv69EuLXIMfZautDrbPPd15riPhNmC1H6lQV_c0Xud8fiwdf1DmZ1_Z1iEX2LSHa7KLTIhp18sZEvq_iEK8xLbI-Pt6wAyhS7O22rKpecUsWf9WLDsj3bA5TN8B7JuAJblEh3sZFPXgmZuk4k-ZlEhInlsDVSO1wddo',
];

export default function RegisterPage() {
  const { t, locale, toggleLocale } = useTranslation();
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left: brand panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMG} alt="Mountain road in Nepal" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white max-w-2xl">
          <Link href="/" className="font-headline-lg text-headline-lg font-extrabold tracking-tight mb-12">GadiSewa</Link>
          <h2 className="font-headline-xl text-headline-xl mb-6 leading-tight">{t('auth.registerHeroTitle')}</h2>
          <p className="font-body-lg text-body-lg opacity-90 mb-8">
            {t('auth.registerHeroDesc')}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              ))}
            </div>
            <span className="font-label-md text-label-md">{t('auth.trustedBy')}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <header className="flex justify-between items-center p-6 lg:p-10 w-full">
          <Link href="/" className="lg:hidden font-headline-md text-headline-md font-extrabold text-primary tracking-tight">GadiSewa</Link>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">language</span>
              <span className="font-label-md text-label-md">{locale === 'en' ? 'नेपाली' : 'English'}</span>
            </button>
            <Link href="/login" className="text-primary font-semibold hover:underline font-label-md text-label-md">{t('auth.login')}</Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-margin-mobile md:p-10">
          <div className="w-full max-w-[520px]">
            <div className="mb-stack-lg">
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{t('auth.createAccountTitle')}</h1>
              <p className="font-body-md text-on-surface-variant">
                {t('auth.createAccountDesc')}
              </p>
            </div>
            <RegisterForm />
            <p className="text-center mt-8 font-body-md text-on-surface-variant">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-primary font-bold hover:underline transition-all">{t('auth.loginInstead')}</Link>
            </p>
          </div>
        </main>

        <footer className="p-6 text-center lg:text-left lg:px-10">
          <p className="font-body-sm text-body-sm text-slate-400">{t('footer.copyright')}</p>
        </footer>
      </div>
    </div>
  );
}
