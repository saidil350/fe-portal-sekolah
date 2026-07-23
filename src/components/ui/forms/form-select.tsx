import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/select';
import * as SelectPrimitive from '@radix-ui/react-select';

export interface FormSelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  placeholder?: string;
  options?: FormSelectOption[];
}

export function FormSelect({
  name,
  label,
  helperText,
  className,
  placeholder = 'Pilih opsi...',
  options = [],
  ...props
}: FormSelectProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;
  const selectedValue = watch(name);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <div id={name} className={className}>
        <Select
          {...props}
          value={selectedValue ?? ''}
          onValueChange={(val) => {
            setValue(name, val, { shouldValidate: true, shouldDirty: true });
            if (props.onValueChange) props.onValueChange(val);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {errorMessage ? (
        <p className="text-xs font-medium text-destructive">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
