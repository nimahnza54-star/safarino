/**
 * Announcement dismissal — localStorage-backed, SSR-safe.
 *
 * Stores the id of the currently-dismissed announcement. When the
 * announcement id changes, the stored id no longer matches, so the new
 * announcement is shown again even after the previous one was dismissed.
 * All access is guarded behind `typeof window` checks, so the module is
 * safe to import from client components.
 */

export const ANNOUNCEMENT_STORAGE_KEY = "safarino:announcement-dismissed";
export const ANNOUNCEMENT_CHANGED_EVENT = "safarino:announcement-changed";

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    // Accessing localStorage can throw (e.g. disabled cookies, private mode).
    return false;
  }
}

/** Returns the id of the currently-dismissed announcement (or "" if none). */
export function getDismissedAnnouncementId(): string {
  if (!canUseStorage()) return "";
  try {
    return window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) ?? "";
  } catch {
    // Corrupted / blocked storage — fail closed (show the announcement).
    return "";
  }
}

/** Persists the dismissed announcement id and notifies same-tab listeners. */
export function dismissAnnouncement(id: string): boolean {
  if (!canUseStorage()) return false;
  try {
    window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, id);
    window.dispatchEvent(new Event(ANNOUNCEMENT_CHANGED_EVENT));
    return true;
  } catch {
    // Quota exceeded or storage blocked — no-op.
    return false;
  }
}