import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { supabase, fetchAll, fetchAllSync } from '@/lib/supabase';
import type { Apartment, Location, Booking, GuestArchive } from '@/types';

export type ViewName = 'dashboard' | 'schedule' | 'checkout' | 'archive';

interface DataCache {
  locations: Location[];
  apartments: Apartment[];
  bookings: Booking[];
  archive: GuestArchive[];
}

interface AppContextValue {
  view: ViewName;
  setView: (v: ViewName) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  data: DataCache;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewName>('schedule');
  const [refreshKey, setRefreshKey] = useState(0);
  // Synchronous initial load from localStorage cache — instant display, no spinner.
  const [data, setData] = useState<DataCache>(() => {
    const cached = fetchAllSync();
    return {
      locations: cached.locations,
      apartments: cached.apartments,
      bookings: cached.bookings,
      archive: cached.guests_archive,
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const fresh = await fetchAll();
        setData({
          locations: fresh.locations,
          apartments: fresh.apartments,
          bookings: fresh.bookings,
          archive: fresh.guests_archive,
        });
        setIsOnline(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'فشل تحميل البيانات';
        console.error('Refresh failed, falling back to cache:', msg);
        const cached = fetchAllSync();
        if (cached.apartments.length > 0 || cached.locations.length > 0) {
          setData({
            locations: cached.locations,
            apartments: cached.apartments,
            bookings: cached.bookings,
            archive: cached.guests_archive,
          });
          setIsOnline(false);
        } else {
          setError(msg);
          setIsOnline(false);
        }
      } finally {
        setLoading(false);
        setRefreshKey((k) => k + 1);
      }
    }, 500);
  }, []);

  // Initial async fetch from Supabase on mount.
  useEffect(() => {
    triggerRefresh();
  }, [triggerRefresh]);

  // Subscribe to Realtime changes on all tables.
  useEffect(() => {
    const channel = supabase
      .channel('pms-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, () => triggerRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'apartments' }, () => triggerRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => triggerRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests_archive' }, () => triggerRefresh())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [triggerRefresh]);

  // Track online/offline status.
  useEffect(() => {
    const onOnline = () => { setIsOnline(true); triggerRefresh(); };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [triggerRefresh]);

  return (
    <AppContext.Provider value={{ view, setView, refreshKey, triggerRefresh, data, loading, error, isOnline }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
