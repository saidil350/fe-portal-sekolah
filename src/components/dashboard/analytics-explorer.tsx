'use client';

import * as React from 'react';
import Link from 'next/link';
import { BarChart3, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DashboardTabs } from './dashboard-tabs';
import { useDashboardStore } from '@/stores/dashboard-store';

export interface AnalyticsPoint {
  id: string;
  label: string;
  value: number;
  secondary?: number;
  href: string;
}

export function AnalyticsExplorer({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: AnalyticsPoint[];
}) {
  const [mode, setMode] = React.useState<'trend' | 'bar'>('trend');
  const setChartKey = useDashboardStore((state) => state.setChartKey);
  const maxValue = Math.max(...data.flatMap((point) => [point.value, point.secondary ?? 0]), 1);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between">
        <div className="text-left">
          <CardTitle className="flex items-center gap-2 text-lg">
            {mode === 'trend' ? <LineChart className="size-5 text-muted-foreground" /> : <BarChart3 className="size-5 text-muted-foreground" />}
            {title}
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <DashboardTabs
          value={mode}
          onValueChange={(value) => setMode(value as 'trend' | 'bar')}
          items={[
            { id: 'trend', label: 'Trend' },
            { id: 'bar', label: 'Komparasi' },
          ]}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="h-72 w-full">
          <div className="flex h-full items-end gap-3 rounded-lg border bg-muted/30 p-4">
            {data.map((point) => (
              <Link
                key={point.id}
                href={point.href}
                className="group flex h-full flex-1 flex-col justify-end gap-2"
                onClick={() => setChartKey(point.id)}
              >
                <div className="flex flex-1 items-end gap-1">
                  <div
                    className="w-full rounded-t-md bg-primary transition-opacity group-hover:opacity-80"
                    style={{ height: `${Math.max(10, (point.value / maxValue) * 100)}%` }}
                  />
                  {mode === 'bar' && point.secondary ? (
                    <div
                      className="w-full rounded-t-md bg-muted-foreground/50 transition-opacity group-hover:opacity-80"
                      style={{ height: `${Math.max(10, (point.secondary / maxValue) * 100)}%` }}
                    />
                  ) : null}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium">{point.label}</p>
                  <p className="text-[11px] text-muted-foreground">{point.value}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {data.slice(0, 4).map((point) => (
            <Link
              key={point.id}
              href={point.href}
              className="inline-flex h-9 items-center justify-between gap-2 rounded-md border bg-background px-3 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setChartKey(point.id)}
            >
              <span className="truncate">{point.label}</span>
              <span className="font-semibold">{point.value}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
