import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={cn(
          'absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-0 rounded-md bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap shadow-md',
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}

// Shadcn compatibility exports
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipRoot = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const TooltipContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
