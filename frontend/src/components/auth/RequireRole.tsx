'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import type { UserRole } from '@/types/auth';

/**
 * Client-side gate for role-restricted pages (/admin/*, vendor-only pages).
 * This is a UX convenience, not the security boundary — the backend
 * re-checks the role on every request regardless of what this renders.
 */
export default function RequireRole({
  roles,
  children,
}: {
  roles: UserRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initialized } = useAppSelector((s) => s.auth);
  const allowed = !!user && roles.includes(user.role);

  useEffect(() => {
    if (initialized && !allowed) {
      router.replace(user ? '/' : '/login');
    }
  }, [initialized, allowed, user, router]);

  if (!initialized || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">
          progress_activity
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
