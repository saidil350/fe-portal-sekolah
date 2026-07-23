'use client';

import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { DashboardEntity, useDashboardStore } from '@/stores/dashboard-store';

export function MasterDetailPanel({
  title,
  items,
}: {
  title: string;
  items: DashboardEntity[];
}) {
  const selectedEntity = useDashboardStore((state) => state.selectedEntity);
  const setSelectedEntity = useDashboardStore((state) => state.setSelectedEntity);
  const active = selectedEntity ?? items[0];

  return (
    <Card>
      <CardContent className="grid gap-0 p-0 lg:grid-cols-[320px_1fr]">
        <div className="border-b p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{title}</h3>
            <Badge variant="secondary">{items.length} item</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedEntity(item)}
                className="rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted/50 data-[active=true]:border-primary data-[active=true]:bg-accent"
                data-active={active?.id === item.id}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-muted p-2 text-muted-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-80 flex-col justify-between gap-6 p-6 text-left">
          {active ? (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary">{active.type}</Badge>
                    <div>
                      <h3 className="text-xl font-bold">{active.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {active.preview?.description ?? active.subtitle}
                      </p>
                    </div>
                  </div>
                  {active.status && <Badge>{active.status}</Badge>}
                </div>
                {active.metrics && (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {Object.entries(active.metrics).map(([label, value]) => (
                      <div key={label} className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-xs font-medium text-muted-foreground">{label}</p>
                        <p className="mt-1 text-lg font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button asChild className="self-start gap-2">
                <Link href={active.href}>
                  Buka detail {active.type} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
