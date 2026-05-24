import * as React from 'react';
import { Breadcrumbs } from '../navigation/breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 pb-5 border-b border-border/60">
      <div className="space-y-1.5 text-left">
        {/* Breadcrumbs di mobile */}
        <div className="sm:hidden mb-2">
          <Breadcrumbs />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {title}
        </h1>
        
        {description && (
          <p className="text-sm text-muted-foreground font-medium max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {action && (
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          {action}
        </div>
      )}
    </div>
  );
}
