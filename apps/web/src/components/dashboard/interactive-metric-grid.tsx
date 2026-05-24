'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, LucideIcon } from 'lucide-react';
import { Card, CardContent, Badge } from '@portal-sekolah/ui';
import { cn } from '@/lib/utils';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  description?: string;
  delta?: string;
  href: string;
  chartKey?: string;
  detailType: string;
  icon: LucideIcon;
  color: string;
}

export function InteractiveMetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <Link href={metric.href} className="group block">
              <Card className="h-full border-border/70 bg-card/95 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <CardContent className="flex h-full flex-col gap-5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className={cn('rounded-xl p-3', metric.color)}>
                      <Icon className="size-5" />
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-black tracking-tight">{metric.value}</p>
                      {metric.delta && <Badge variant="secondary">{metric.delta}</Badge>}
                    </div>
                    {metric.description && (
                      <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                        {metric.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
