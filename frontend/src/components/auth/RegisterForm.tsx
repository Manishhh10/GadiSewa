'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { registerUser } from '@/store/actions/authActions';
import { clearError } from '@/store/slices/authSlice';
import { useTranslation } from '@/lib/i18n/I18nContext';
import type { RegisterPayload } from '@/types/auth';

const inputCls =
  'w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body-md bg-white';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState<RegisterPayload>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) dispatch(clearError());
    if (localError) setLocalError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setLocalError('Please accept the Terms of Service to continue.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    const res = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(res)) router.push('/');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-stack-md">
      {(localError || error) && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body-sm text-body-sm">
          {localError || error}
        </div>
      )}

      <div>
        <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="fullName">{t('auth.fullName')}</label>
        <input id="fullName" name="fullName" type="text" placeholder="John Doe" required value={form.fullName} onChange={onChange} className={inputCls} />
      </div>

      <div>
        <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="email">{t('auth.emailLabel')}</label>
        <input id="email" name="email" type="email" placeholder="name@example.com" required value={form.email} onChange={onChange} className={inputCls} />
      </div>

      <div>
        <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="phone">{t('auth.phoneNumber')}</label>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-4 rounded-lg border border-slate-200 bg-surface-variant text-on-surface font-label-md">+977</span>
          <input id="phone" name="phone" type="tel" placeholder="98XXXXXXXX" value={form.phone} onChange={onChange} className={`flex-1 ${inputCls}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="password">{t('auth.passwordLabel')}</label>
          <input id="password" name="password" type="password" placeholder="••••••••" required value={form.password} onChange={onChange} className={inputCls} />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
          <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required value={form.confirmPassword} onChange={onChange} className={inputCls} />
        </div>
      </div>

      <div className="flex items-start gap-3 py-2">
        <input id="terms" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
        <label htmlFor="terms" className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {t('auth.agreePrefix')} <a className="text-primary font-semibold hover:underline" href="#">{t('auth.termsOfService')}</a> {t('auth.and')}{' '}
          <a className="text-primary font-semibold hover:underline" href="#">{t('auth.privacyPolicy')}</a>.
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 mt-4 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        ) : (
          t('auth.createAccount')
        )}
      </button>
    </form>
  );
}
