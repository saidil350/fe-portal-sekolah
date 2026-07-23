import { create } from 'zustand';

export interface DashboardPreview {
  title: string;
  description: string;
  meta?: Record<string, string>;
}

export interface DashboardEntity {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
  status?: string;
  isActive?: boolean;
  onToggleStatus?: () => void;
  metrics?: Record<string, string>;
  preview?: DashboardPreview;
}

interface DashboardState {
  selectedEntity: DashboardEntity | null;
  activeSidePanel: 'entity' | null;
  activeFilters: Record<string, string>;
  recentlyViewed: DashboardEntity[];
  chartKey: string | null;
  setSelectedEntity: (entity: DashboardEntity | null) => void;
  closeSidePanel: () => void;
  setFilter: (key: string, value: string) => void;
  setChartKey: (chartKey: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedEntity: null,
  activeSidePanel: null,
  activeFilters: {},
  recentlyViewed: [],
  chartKey: null,
  setSelectedEntity: (entity) =>
    set((state) => ({
      selectedEntity: entity,
      activeSidePanel: entity ? 'entity' : null,
      recentlyViewed: entity
        ? [entity, ...state.recentlyViewed.filter((item) => item.id !== entity.id)].slice(0, 5)
        : state.recentlyViewed,
    })),
  closeSidePanel: () => set({ selectedEntity: null, activeSidePanel: null }),
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [key]: value,
      },
    })),
  setChartKey: (chartKey) => set({ chartKey }),
}));
