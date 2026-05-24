import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ScrollArea({ children, className, ...props }: ScrollAreaProps) {
  return (
    <div
      className={cn('relative overflow-auto custom-scrollbar scroll-smooth', className)}
      {...props}
    >
      {children}
    </div>
  );
}
