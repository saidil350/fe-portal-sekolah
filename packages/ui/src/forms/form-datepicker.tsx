import { useFormContext } from 'react-hook-form';
import { Input } from '../components/input';

export interface FormDatePickerProps {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

export function FormDatePicker({ name, label, helperText, className, disabled }: FormDatePickerProps) {
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
        type="date"
        disabled={disabled}
        className={className}
        {...register(name)}
      />
      {errorMessage ? (
        <p className="text-xs font-medium text-destructive">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
