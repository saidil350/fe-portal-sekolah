'use client';

import * as React from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

type ToastContextType = {
  toast: (options: Omit<ToastItem, 'id'>) => void;
  toasts: ToastItem[];
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, type = 'info' }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-md flex-col gap-2 pointer-events-none">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={`pointer-events-auto flex items-start justify-between gap-4 rounded-xl border p-4 shadow-lg ${
              toastItem.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : toastItem.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : toastItem.type === 'warning'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border bg-background text-foreground'
            }`}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">{toastItem.title}</p>
              {toastItem.description && <p className="mt-1 text-xs opacity-90">{toastItem.description}</p>}
            </div>
            <button type="button" onClick={() => dismiss(toastItem.id)} className="text-xs font-bold opacity-70">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
