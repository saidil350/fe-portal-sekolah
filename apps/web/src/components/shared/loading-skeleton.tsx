import * as React from 'react';
import { Skeleton } from '@portal-sekolah/ui';

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border p-5 bg-card space-y-3.5">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 p-4 border rounded-xl bg-card">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <ListSkeleton />
    </div>
  );
}
