import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: { label: string; value: string | number }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export { Select };
export const SelectTrigger = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className}>{children}</div>
);
export const SelectValue = ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>;
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectItem = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;
