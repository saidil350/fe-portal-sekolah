import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border bg-card p-6 text-card-foreground shadow-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="mt-4">{children}</div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <span className="sr-only">Close</span>
          <span className="text-lg font-bold">×</span>
        </button>
      </div>
    </div>
  );
}

// Shadcn compatibility exports
export const DialogTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div onClick={onClick} className="inline-block">{children}</div>
);
export const DialogContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="flex flex-col space-y-1.5">{children}</div>;
export const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>;
export const DialogDescription = ({ children }: { children: React.ReactNode }) => <p className="text-sm text-muted-foreground">{children}</p>;
export const DialogFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}>{children}</div>
);
