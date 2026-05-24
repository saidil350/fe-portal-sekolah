import * as React from 'react';
import { cn } from '@portal-sekolah/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function Avatar({ src, alt, fallback, className, ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted border border-border/50 items-center justify-center font-semibold text-sm text-muted-foreground select-none',
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{fallback || 'U'}</span>
      )}
    </div>
  );
}

// Shadcn compatibility exports
export const AvatarImage = ({ src, alt }: { src?: string; alt?: string }) => <>{src && <Avatar src={src} alt={alt} />}</>;
export const AvatarFallback = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;
