import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  title?: string;
}

export function Sheet({ isOpen, onClose, side = 'right', children, title }: SheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          'fixed z-50 bg-card p-6 shadow-lg transition-transform duration-300 ease-in-out border text-card-foreground',
          {
            'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l transform translate-x-0 animate-in slide-in-from-right':
              side === 'right',
            'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r transform translate-x-0 animate-in slide-in-from-left':
              side === 'left',
            'inset-x-0 bottom-0 w-full h-1/2 border-t transform translate-y-0 animate-in slide-in-from-bottom':
              side === 'bottom',
            'inset-x-0 top-0 w-full h-1/2 border-b transform translate-y-0 animate-in slide-in-from-top':
              side === 'top',
          }
        )}
      >
        <div className="flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
          >
            <span className="text-lg font-bold">×</span>
          </button>
        </div>
        <div className="mt-4 h-full overflow-y-auto pb-8">{children}</div>
      </div>
    </div>
  );
}

// Shadcn compatibility exports
export const SheetTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div onClick={onClick} className="inline-block">{children}</div>
);
export const SheetContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SheetHeader = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col space-y-2">{children}</div>;
export const SheetTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold">{children}</h2>;
export const SheetDescription = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground">{children}</p>;
export const SheetFooter = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{children}</div>;
