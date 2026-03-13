import { create, type StoreApi } from 'zustand';
import { createContext, useContext, type ReactNode } from 'react';
import type { Notification } from './use-notification';
import type { Feature } from 'ol';
import { BoundaryLevel } from '~/map-view/map-utils';

// Define the global state interface
export interface GlobalState {
  // UI states
  sidebarOpen: boolean;
  imagePreview: boolean;
  detailDrawerOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  currentBoundary: BoundaryLevel;
  loading: boolean;

  // Application states
  error: string | null;
  notifications: Notification[];

  // User preferences
  mapSettings: {
    center: [number, number];
    zoom: number;
    showControls: boolean;
  };

  selectedFeature?: Feature | null;
}

// Initial state
const initialState: GlobalState = {
  sidebarOpen: false,
  detailDrawerOpen: false,
  theme: 'system',
  imagePreview: false,
  loading: false,
  error: null,
  notifications: [],
  currentBoundary: BoundaryLevel.COUNTRY,
  mapSettings: {
    center: [0, 0],
    zoom: 2,
    showControls: true,
  },
};

// Create Zustand store
interface GlobalStore extends GlobalState {
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  addNotification: (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  updateMapSettings: (settings: Partial<GlobalState['mapSettings']>) => void;
  setGlobalStates: StoreApi<GlobalState>['setState'];
}

const useGlobalStore = create<GlobalStore>((set) => ({
  ...initialState,

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),

  addNotification: (notification) => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
      autoHide: true,
      duration: 5000,
      ...notification,
    };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  updateMapSettings: (settings) => {
    set((state) => ({
      mapSettings: { ...state.mapSettings, ...settings },
    }));
  },

  setGlobalStates: set,
}));

// Create context for React integration
const GlobalStateContext = createContext<GlobalStore | undefined>(undefined);

// Provider component (for compatibility with existing code)
export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const store = useGlobalStore();

  return (
    <GlobalStateContext.Provider value={store}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// Custom hook to use global state (for compatibility)
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}

// Convenience hooks for specific state slices
export function useSidebar() {
  const { sidebarOpen, setSidebarOpen } = useGlobalStore();
  return {
    isOpen: sidebarOpen,
    open: () => setSidebarOpen(true),
    close: () => setSidebarOpen(false),
    toggle: () => setSidebarOpen(!sidebarOpen),
  };
}

export function useTheme() {
  const { theme, setTheme } = useGlobalStore();
  return {
    theme,
    setTheme,
  };
}

export function useLoading() {
  const { loading, setLoading } = useGlobalStore();
  return {
    isLoading: loading,
    setLoading,
    startLoading: () => setLoading(true),
    stopLoading: () => setLoading(false),
  };
}

export function useError() {
  const { error, setError, clearError } = useGlobalStore();
  return {
    error,
    setError,
    clearError,
  };
}

export function useMapSettings() {
  const { mapSettings, updateMapSettings } = useGlobalStore();
  return {
    mapSettings,
    updateMapSettings,
    setCenter: (center: [number, number]) => updateMapSettings({ center }),
    setZoom: (zoom: number) => updateMapSettings({ zoom }),
    setShowControls: (showControls: boolean) =>
      updateMapSettings({ showControls }),
  };
}
