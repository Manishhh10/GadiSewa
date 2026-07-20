'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<ToastKind, { bg: string; icon: string }> = {
  success: { bg: 'bg-tertiary text-white', icon: 'check_circle' },
  error: { bg: 'bg-error text-white', icon: 'error' },
  info: { bg: 'bg-on-surface text-surface', icon: 'info' },
};

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => remove(id), AUTO_DISMISS_MS);
    },
    [remove]
  );

  const value: ToastContextValue = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[2000] flex flex-col gap-2 max-w-[90vw] w-[360px]">
        {toasts.map((t) => {
          const style = STYLES[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className={`${style.bg} rounded-lg shadow-lg px-4 py-3 flex items-start gap-2 animate-[toast-in_0.2s_ease-out]`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">{style.icon}</span>
              <p className="font-body-sm text-body-sm flex-1">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                aria-label="Dismiss"
                className="opacity-80 hover:opacity-100 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
