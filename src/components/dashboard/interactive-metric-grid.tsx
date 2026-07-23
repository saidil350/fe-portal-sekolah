'use client';

import Link from 'next/link';
import { ArrowUpRight, LucideIcon } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/ui';


export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  description?: string;
  delta?: string;
  href?: string;
  onClick?: () => void;
  chartKey?: string;
  detailType: string;
  icon: LucideIcon;
  color?: string;
}

export function InteractiveMetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isClickable = Boolean(metric.href || metric.onClick);

        const cardContent = (
          <Card className={`h-full transition-colors ${isClickable ? 'hover:bg-accent/40 cursor-pointer' : ''}`}>
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-md bg-muted p-2.5 text-foreground">
                  <Icon className="size-4" />
                </div>
                {isClickable && (
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-1 text-left">
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  {metric.title}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
                  {metric.delta && <Badge variant="secondary">{metric.delta}</Badge>}
                </div>
                {metric.description && (
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

        return (
          <div key={metric.id}>
            {metric.href ? (
              <Link href={metric.href} className="group block">
                {cardContent}
              </Link>
            ) : metric.onClick ? (
              <div onClick={metric.onClick} className="group block">
                {cardContent}
              </div>
            ) : (
              <div className="block cursor-default">
                {cardContent}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
