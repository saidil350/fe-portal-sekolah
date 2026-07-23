'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui';

export interface DashboardTabItem {
  id: string;
  label: string;
}

export function DashboardTabs({
  items,
  value,
  onValueChange,
}: {
  items: DashboardTabItem[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        {items.map((item) => (
          <TabsTrigger key={item.id} value={item.id}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
