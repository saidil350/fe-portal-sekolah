'use client';

import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { Badge, Button, Sheet } from '@portal-sekolah/ui';
import { useDashboardStore } from '@/stores/dashboard-store';

export function EntitySidePanel() {
  const { selectedEntity, activeSidePanel, closeSidePanel } = useDashboardStore();
  const isOpen = activeSidePanel === 'entity' && Boolean(selectedEntity);

  return (
    <Sheet isOpen={isOpen} onClose={closeSidePanel} title={selectedEntity?.title ?? 'Detail'}>
      {selectedEntity && (
        <div className="flex flex-col gap-5 text-left">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Badge variant="secondary">{selectedEntity.type}</Badge>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">{selectedEntity.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selectedEntity.preview?.description ?? selectedEntity.subtitle}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={closeSidePanel} aria-label="Tutup panel">
              <X className="size-4" />
            </Button>
          </div>

          {selectedEntity.status && (
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
              <p className="mt-1 text-sm font-bold">{selectedEntity.status}</p>
            </div>
          )}

          {selectedEntity.metrics && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(selectedEntity.metrics).map(([label, value]) => (
                <div key={label} className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                  <p className="mt-1 text-base font-black">{value}</p>
                </div>
              ))}
            </div>
          )}

          {selectedEntity.preview?.meta && (
            <div className="flex flex-col gap-2 rounded-xl border bg-background p-4">
              {Object.entries(selectedEntity.preview.meta).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          )}

          <Link
            href={selectedEntity.href}
            onClick={closeSidePanel}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buka detail penuh <ArrowUpRight className="size-4" />
          </Link>
        </div>
      )}
    </Sheet>
  );
}
