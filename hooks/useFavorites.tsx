"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  FAVORITES_STORAGE_KEY,
  readFavoriteIds,
  writeFavoriteIds,
} from "@/services/favorites.service";

const FAVORITES_EVENT = "safarino:favorites-changed";
const SERVER_SNAPSHOT = "";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

/** Raw localStorage payload — a primitive, so snapshots compare stably. */
function getSnapshot(): string {
  try {
    return window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "";
  } catch {
    return SERVER_SNAPSHOT;
  }
}

const getServerSnapshot = () => SERVER_SNAPSHOT;

function parseIds(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

const subscribeMounted = () => () => {};

interface FavoritesContextValue {
  favoriteIds: ReadonlySet<string>;
  /** False during SSR / before hydration — hearts render inactive until then. */
  hydrated: boolean;
  isFavorite: (hotelId: string) => boolean;
  toggleFavorite: (hotelId: string) => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Single favorites store shared by every heart icon on the page, backed
 * by localStorage via useSyncExternalStore (hydration-safe, no effects,
 * syncs across tabs). Ids are hotel ids, never names.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated =
    useSyncExternalStore(subscribeMounted, () => "client", () => "server") ===
    "client";

  const favoriteIds = useMemo<ReadonlySet<string>>(
    () => new Set(parseIds(raw)),
    [raw]
  );

  const toggleFavorite = useCallback((hotelId: string) => {
    const next = new Set(readFavoriteIds());
    if (next.has(hotelId)) {
      next.delete(hotelId);
    } else {
      next.add(hotelId);
    }
    writeFavoriteIds([...next]);
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      hydrated,
      isFavorite: (hotelId: string) => favoriteIds.has(hotelId),
      toggleFavorite,
      count: favoriteIds.size,
    }),
    [favoriteIds, hydrated, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within <FavoritesProvider>");
  }
  return ctx;
}
