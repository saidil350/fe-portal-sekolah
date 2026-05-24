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

  const toast = React.useCallback(({ title, description, type = 'info' }: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismiss(id);
    }, 4000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      
      {/* Toast Container Render */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-lg border pointer-events-auto flex justify-between items-start gap-4 transition-all duration-300 transform translate-y-0 ${
              t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300' :
              t.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-300' :
              t.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300' :
              'bg-background border text-foreground'
            }`}
          >
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{t.title}</h4>
              {t.description && <p className="text-xs mt-1 opacity-90">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-xs hover:opacity-75 font-bold"
            >
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
