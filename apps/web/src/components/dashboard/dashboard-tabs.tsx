'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@portal-sekolah/ui';

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
          <TabsTrigger
            key={item.id}
            type="button"
            active={item.id === value}
            onClick={() => onValueChange(item.id)}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
