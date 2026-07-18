'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Material Symbols icon name, e.g. "mail", "lock", "person". */
  icon?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, id, className = '', ...props }, ref) => {
    return (
      <div className="space-y-unit">
        {label && (
          <label
            htmlFor={id}
            className="block font-label-md text-label-md text-on-surface mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-lg border bg-surface-container-low font-body-md text-body-md transition-all focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary-container ${
              error ? 'border-error' : 'border-outline-variant/40'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="font-body-sm text-body-sm text-error mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
