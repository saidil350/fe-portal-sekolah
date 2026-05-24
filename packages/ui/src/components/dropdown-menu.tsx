import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 w-56 rounded-xl border bg-card p-1 text-card-foreground shadow-md z-50 animate-in fade-in slide-in-from-top-2 duration-150',
            {
              'right-0 origin-top-right': align === 'right',
              'left-0 origin-top-left': align === 'left',
            }
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">{children}</div>;
}

export function DropdownMenuSeparator() {
  return <div className="-mx-1 my-1 h-px bg-muted" />;
}

// Additional Shadcn compatibility exports
export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
