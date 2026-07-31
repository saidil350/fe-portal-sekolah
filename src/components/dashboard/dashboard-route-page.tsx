'use client';

import * as React from 'react';
import {
  Badge,
  BadgeProps,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-left">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
import { ArrowUpRight, LucideIcon, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { EnterpriseDataTable, DashboardTableColumn } from './enterprise-data-table';
import { EntitySidePanel } from './entity-side-panel';
import { InteractiveMetricGrid, DashboardMetric as InteractiveDashboardMetric } from './interactive-metric-grid';
import { FilterSection } from './filter-section';
import { DashboardEntity } from '@/stores/dashboard-store';

export type DashboardRow = Record<string, unknown>;

export interface DashboardStat {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  color?: string;
  href?: string;
  onClick?: () => void;
}

export interface DashboardColumn {
  header: string;
  accessorKey?: string;
  render?: (row: DashboardRow) => React.ReactNode;
}

export interface DashboardTableSection {
  title: string;
  icon: LucideIcon;
  data: DashboardRow[];
  columns: DashboardColumn[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export interface DashboardInsight {
  title: string;
  value: string;
  description: string;
  badge?: string;
  badgeVariant?: BadgeProps['variant'];
}

export interface DashboardRoutePageProps {
  title: string;
  description: string;
  actionLabel: string;
  actionIcon: LucideIcon;
  onAction?: () => void;
  stats: DashboardStat[];
  table: DashboardTableSection;
  insights?: DashboardInsight[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/rp\s?/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);
}

function currentRouteBase(pathname: string) {
  return pathname.split('/').filter(Boolean).join('/').replace(/^/, '/');
}

function rowHref(pathname: string, row: DashboardRow, index: number) {
  const base = currentRouteBase(pathname);
  if (row.id) {
    return `${base}/${String(row.id)}`;
  }
  const raw =
    row.student ??
    row.className ??
    row.month ??
    row.school ??
    row.invoice ??
    row.title ??
    row.grade ??
    row.unit ??
    row.report ??
    row.setting ??
    `detail-${index + 1}`;
  return `${base}/${slugify(String(raw))}`;
}

function rowTitle(row: DashboardRow) {
  return String(
    row.studentName ??
      row.student ??
      row.name ??
      row.className ??
      row.month ??
      row.school ??
      row.invoice ??
      row.title ??
      row.grade ??
      row.unit ??
      row.report ??
      row.setting ??
      'Detail'
  );
}

function rowSubtitle(row: DashboardRow) {
  const subtitle =
    row.className ??
    row.email ??
    row.domain ??
    row.subject ??
    row.owner ??
    row.module ??
    row.period ??
    row.note ??
    row.value ??
    row.target;
  return String(subtitle ?? 'Klik untuk membuka detail dan konteks lengkap.');
}

function rowMetrics(row: DashboardRow) {
  return Object.fromEntries(
    Object.entries(row)
      .filter(([, value]) => typeof value === 'string' || typeof value === 'number')
      .slice(0, 4)
      .map(([key, value]) => [key, String(value)])
  );
}

export function StatusBadge({
  label,
  variant = 'secondary',
}: {
  label: string;
  variant?: BadgeProps['variant'];
}) {
  return <Badge variant={variant}>{label}</Badge>;
}

export function DashboardStatCards({ stats }: { stats: DashboardStat[] }) {
  const metrics: InteractiveDashboardMetric[] = stats.map((stat) => ({
    id: slugify(stat.title),
    title: stat.title,
    value: stat.value,
    description: stat.description,
    delta: stat.value.includes('%') ? '+2.4%' : undefined,
    href: stat.onClick ? undefined : stat.href,
    onClick: stat.onClick,
    chartKey: slugify(stat.title),
    detailType: 'analytics',
    icon: stat.icon,
    color: stat.color ?? 'blue',
  }));

  return <InteractiveMetricGrid metrics={metrics} />;
}

export function DashboardSectionCard({
  section,
  searchQuery,
}: {
  section: DashboardTableSection;
  searchQuery: string;
}) {
  const pathname = usePathname();
  const safeData = Array.isArray(section.data) ? section.data : [];
  const entities = safeData.map((row, index): DashboardEntity & DashboardRow => {
    const href = rowHref(pathname, row, index);

    return {
      ...row,
      id: slugify(`${rowTitle(row)}-${index}`),
      type: section.title,
      title: rowTitle(row),
      subtitle: rowSubtitle(row),
      href,
      status: typeof row.status === 'string' ? row.status : undefined,
      isActive: typeof row.isActive === 'boolean' ? row.isActive : undefined,
      onToggleStatus: typeof row.onToggleStatus === 'function' ? (row.onToggleStatus as () => void) : undefined,
      metrics: rowMetrics(row),
      preview: {
        title: rowTitle(row),
        description: `${rowTitle(row)} memiliki detail operasional, histori, dan konteks analitik yang dapat dieksplorasi lebih lanjut.`,
        meta: rowMetrics(row),
      },
    };
  });

  const safeColumns = Array.isArray(section.columns) ? section.columns : [];
  const columns: DashboardTableColumn<DashboardEntity & DashboardRow>[] = safeColumns.map((column) => ({
    header: column.header,
    accessorKey: column.accessorKey as keyof (DashboardEntity & DashboardRow),
    cell: ({ row }) => (column.render ? column.render(row.original) : String(row.original[column.accessorKey ?? 'title'] ?? '')),
  }));

  return (
    <EnterpriseDataTable
      title={section.title}
      data={entities}
      columns={columns}
      searchPlaceholder={section.searchPlaceholder}
      showSearch={false}
      externalSearchQuery={searchQuery}
    />
  );
}

export function DashboardInsights({ insights = [] }: { insights?: DashboardInsight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {insights.map((insight) => (
        <Card key={insight.title}>
          <CardContent className="space-y-3 p-5 text-left">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {insight.title}
              </p>
              {insight.badge && (
                <Badge variant={insight.badgeVariant ?? 'secondary'}>{insight.badge}</Badge>
              )}
            </div>
            <p className="text-2xl font-bold">{insight.value}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {insight.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardRoutePage({
  title,
  description,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  stats,
  table,
  insights,
}: DashboardRoutePageProps) {
  const [isActionOpen, setIsActionOpen] = React.useState(false);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('default');

  const statusOptions = React.useMemo(() => {
    const statuses = new Set<string>();
    table.data.forEach((row) => {
      if (typeof row.status === 'string') {
        statuses.add(row.status);
      }
    });
    return Array.from(statuses).map((s) => ({ value: s, label: s }));
  }, [table.data]);

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'title-asc', label: 'Nama (A-Z)' },
    { value: 'title-desc', label: 'Nama (Z-A)' },
  ];

  const filteredData = React.useMemo(() => {
    let result = [...table.data];

    // Status Filter
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((row) => row.status === statusFilter);
    }

    // Sorting
    if (sortBy === 'title-asc') {
      result.sort((a, b) => rowTitle(a).localeCompare(rowTitle(b)));
    } else if (sortBy === 'title-desc') {
      result.sort((a, b) => rowTitle(b).localeCompare(rowTitle(a)));
    }

    return result;
  }, [table.data, statusFilter, sortBy]);

  const filteredTable = React.useMemo(() => {
    return {
      ...table,
      data: filteredData,
    };
  }, [table, filteredData]);


  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          <Button className="gap-2" onClick={onAction ? onAction : () => setIsActionOpen(true)}>
            <ActionIcon className="h-4 w-4" /> {actionLabel}
          </Button>
        }
      />

      <DashboardStatCards stats={stats} />

      <DashboardInsights insights={insights} />
          
          <FilterSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={table.searchPlaceholder}
            statusFilter={statusFilter}
            onStatusFilterChange={statusOptions.length > 0 ? setStatusFilter : undefined}
            statusOptions={statusOptions}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOptions={sortOptions}
            onExport={(format) => {
              alert(`Mengekspor laporan ${title} sebagai ${format.toUpperCase()}`);
            }}
          />

          <DashboardSectionCard section={filteredTable} searchQuery={searchQuery} />


      <EntitySidePanel />

      <Dialog open={isActionOpen} onOpenChange={(open) => { if (!open) { setIsActionOpen(false); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionLabel}</DialogTitle>
            <DialogDescription>
              Aksi ini disiapkan sebagai modal enterprise agar workflow dashboard terasa stateful.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 text-left mt-2">
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="size-5 text-foreground" />
                <div>
                  <p className="text-sm font-semibold">Workflow siap dilanjutkan</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dari sini implementasi berikutnya dapat menghubungkan form, export, atau create flow ke API.
                  </p>
                </div>
              </div>
            </div>
            <Button className="self-end gap-2" onClick={() => setIsActionOpen(false)}>
              Tutup <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
