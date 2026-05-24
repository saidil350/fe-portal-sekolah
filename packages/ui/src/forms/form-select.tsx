import { useFormContext } from 'react-hook-form';
import { Select, SelectProps } from '../components/select';

export interface FormSelectProps extends SelectProps {
  name: string;
  label?: string;
  helperText?: string;
}

export function FormSelect({ name, label, helperText, className, ...props }: FormSelectProps) {
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
      <Select
        id={name}
        className={className}
        {...register(name)}
        {...props}
      />
      {errorMessage ? (
        <p className="text-xs font-medium text-destructive">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
