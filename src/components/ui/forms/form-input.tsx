import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../components/input';

export interface FormInputProps extends React.ComponentProps<"input"> {
  name: string;
  label?: string;
  helperText?: string;
}

export function FormInput({ name, label, helperText, className, ...props }: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
      )}
      <Input
        id={name}
        className={className}
        {...register(name)}
        {...props}
      />
      {errorMessage ? (
        <p className="text-xs font-medium text-destructive animate-in fade-in duration-200">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
