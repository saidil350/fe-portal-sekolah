import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-4', className)}
    data-value={value}
    data-on-value-change={onValueChange ? 'true' : undefined}
    {...props}
  />
));
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, active = false, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      active && 'bg-background text-foreground shadow-sm',
      className
    )}
    data-state={active ? 'active' : 'inactive'}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { active?: boolean }
>(({ className, active = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('outline-none', !active && 'hidden', className)}
    data-state={active ? 'active' : 'inactive'}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
