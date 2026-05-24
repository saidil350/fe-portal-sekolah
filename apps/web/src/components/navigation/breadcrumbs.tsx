'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground select-none">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        
        // Memformat nama jalur (cth: super-admin -> Super Admin)
        const label = path
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-[120px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors truncate max-w-[120px] sm:max-w-none"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
