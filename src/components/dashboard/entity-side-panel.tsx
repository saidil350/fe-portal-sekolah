'use client';

import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { Badge, Button, Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui';
import { useDashboardStore } from '@/stores/dashboard-store';

export function EntitySidePanel() {
  const { selectedEntity, activeSidePanel, closeSidePanel } = useDashboardStore();
  const isOpen = activeSidePanel === 'entity' && Boolean(selectedEntity);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeSidePanel();
      }}
    >
      <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-2 border-b">
          <Badge variant="secondary" className="w-fit mb-1">
            {selectedEntity?.type ?? 'Detail'}
          </Badge>
          <SheetTitle className="text-xl font-bold">{selectedEntity?.title ?? 'Detail Pengguna'}</SheetTitle>
        </SheetHeader>

        {selectedEntity && (
          <div className="flex flex-col gap-5 pt-4 text-left">
            {selectedEntity.preview?.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {selectedEntity.preview.description}
              </p>
            )}

            {selectedEntity.status && (
              <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/30 p-4 shadow-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Status Akun</p>
                  <p className={`mt-0.5 text-sm font-semibold ${selectedEntity.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedEntity.status}
                  </p>
                </div>
                {selectedEntity.onToggleStatus && (
                  <Button
                    type="button"
                    variant={selectedEntity.isActive ? 'destructive' : 'default'}
                    size="sm"
                    className="font-medium"
                    onClick={selectedEntity.onToggleStatus}
                  >
                    {selectedEntity.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                  </Button>
                )}
              </div>
            )}

            {selectedEntity.metrics && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informasi Akun</h4>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {Object.entries(selectedEntity.metrics).map(([label, value]) => (
                    <div key={label} className="rounded-lg border bg-card p-3 shadow-xs">
                      <p className="text-xs font-medium capitalize text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-semibold break-all">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEntity.preview?.meta && (
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-xs">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Metadata</h4>
                {Object.entries(selectedEntity.preview.meta).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 text-sm border-b last:border-0 pb-1.5 last:pb-0">
                    <span className="text-xs text-muted-foreground capitalize">{label}</span>
                    <span className="font-semibold text-xs break-all">{value}</span>
                  </div>
                ))}
              </div>
            )}

            <Button asChild className="gap-2 mt-2 w-full">
              <Link href={selectedEntity.href} onClick={closeSidePanel}>
                Buka Detail Penuh <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
