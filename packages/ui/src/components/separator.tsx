import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <div
      className={cn(
        'shrink-0 bg-border',
        {
          'h-[1px] w-full': orientation === 'horizontal',
          'h-full w-[1px]': orientation === 'vertical',
        },
        className
      )}
      {...props}
    />
  );
}

export { Separator };
