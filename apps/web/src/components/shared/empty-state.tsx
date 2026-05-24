import * as React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@portal-sekolah/ui';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-2xl bg-card border-border/60 py-12">
      <div className="p-4 bg-muted/40 rounded-full text-muted-foreground mb-4 shrink-0">
        <Inbox className="h-8 w-8" />
      </div>
      
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5 font-medium">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="rounded-xl px-5 text-xs font-semibold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
