'use client';

import { useRef, useState, type FormEvent } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import RequireRole from '@/components/auth/RequireRole';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changePassword, updateProfile } from '@/store/actions/authActions';
import { uploadApi } from '@/api/location.api';
import { useToast } from '@/lib/toast/ToastContext';
import type { NormalizedError } from '@/lib/axios';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function ProfilePage() {
  return (
    <RequireRole roles={['renter', 'vendor', 'admin']}>
      <ProfileContent />
    </RequireRole>
  );
}

function ProfileContent() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    username: user?.username ?? '',
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPw, setChangingPw] = useState(false);

  if (!user) return null;

  const onAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setAvatarUploading(true);
    try {
      const [url] = await uploadApi.images([file]);
      setAvatarUrl(url);
    } catch (err) {
      toast.error((err as NormalizedError).message);
    } finally {
      setAvatarUploading(false);
    }
  };

  const onSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const emailChanged = form.email.trim().toLowerCase() !== user.email.toLowerCase();
    const result = await dispatch(
      updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        avatarUrl,
        email: form.email,
        username: form.username,
      })
    );
    setSavingProfile(false);
    if (updateProfile.fulfilled.match(result)) {
      toast.success(
        emailChanged ? 'Profile updated — please re-verify your new email.' : 'Profile updated.'
      );
    } else {
      toast.error(result.payload ?? 'Could not save your profile.');
    }
  };

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    setChangingPw(true);
    const result = await dispatch(
      changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
    );
    setChangingPw(false);
    if (changePassword.fulfilled.match(result)) {
      toast.success('Password changed.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(result.payload ?? 'Could not change your password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow max-w-[720px] mx-auto w-full px-margin-mobile py-stack-lg space-y-stack-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">My Profile</h1>
          <p className="font-body-md text-on-surface-variant">Manage your personal details and account security.</p>
        </div>

        {/* Profile details */}
        <section className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant shadow-sm">
          <form onSubmit={onSaveProfile} className="space-y-stack-md">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary-container flex items-center justify-center text-white font-headline-sm text-headline-sm shrink-0">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials(form.fullName || user.username)
                )}
                {avatarUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="material-symbols-outlined animate-spin text-white text-[22px]">progress_activity</span>
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={onAvatarSelected}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors disabled:opacity-60"
                >
                  Change Photo
                </button>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">JPG, PNG or WebP.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <Input
                label="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                minLength={3}
              />
            </div>
            {form.email.trim().toLowerCase() !== user.email.toLowerCase() && (
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Changing your email will require re-verifying it.
              </p>
            )}
            <Button type="submit" loading={savingProfile} className="md:w-auto md:px-8">
              Save Changes
            </Button>
          </form>
        </section>

        {/* Change password */}
        <section className="bg-surface-container-lowest rounded-xl p-stack-lg border border-outline-variant shadow-sm">
          <h2 className="font-headline-md text-headline-md mb-stack-md">Change Password</h2>
          <form onSubmit={onChangePassword} className="space-y-stack-md">
            <Input
              label="Current Password"
              type="password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <Input
                label="New Password"
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                required
                minLength={6}
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" loading={changingPw} variant="ghost" className="md:w-auto md:px-8">
              Update Password
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
