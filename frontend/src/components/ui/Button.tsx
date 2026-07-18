'use client';

import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'ghost';
}

export default function Button({
  loading = false,
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'w-full py-4 rounded-lg font-label-md text-label-md transition-all flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary-container text-on-primary shadow-md hover:brightness-110',
    ghost: 'border border-outline-variant text-on-surface hover:bg-surface-container',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[20px]">
          progress_activity
        </span>
      ) : (
        children
      )}
    </button>
  );
}
