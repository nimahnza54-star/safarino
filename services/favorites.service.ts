/**
 * Favorites persistence — localStorage-backed, SSR-safe.
 *
 * The module guards every access behind `typeof window` checks, so it
 * is safe to import from client components. All favorites are keyed by
 * hotel id (never by name).
 */

export const FAVORITES_STORAGE_KEY = "safarino:favorites";

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    // Accessing localStorage can throw (e.g. disabled cookies, private mode).
    return false;
  }
}

export function readFavoriteIds(): string[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    // Corrupted payload — fail closed with an empty list.
    return [];
  }
}

export function writeFavoriteIds(ids: string[]): boolean {
  if (!canUseStorage()) return false;
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
    return true;
  } catch {
    // Quota exceeded or storage blocked — keep in-memory state only.
    return false;
  }
}
