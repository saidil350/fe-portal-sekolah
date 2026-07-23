import { useFormContext } from 'react-hook-form';

export interface FormUploadProps {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  accept?: string;
  multiple?: boolean;
}

export function FormUpload({ name, label, helperText, accept, multiple }: FormUploadProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          {label}
        </span>
      )}
      <div className="relative flex items-center justify-center w-full">
        <label
          htmlFor={name}
          className="flex flex-col items-center justify-center w-full h-32 border border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50 border-input transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-3 text-muted-foreground"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Klik untuk unggah</span> atau seret berkas
            </p>
          </div>
          <input
            id={name}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            {...register(name)}
          />
        </label>
      </div>
      {errorMessage ? (
        <p className="text-xs font-medium text-destructive">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
