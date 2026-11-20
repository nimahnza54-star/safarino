"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  ANNOUNCEMENT_CHANGED_EVENT,
  dismissAnnouncement,
  getDismissedAnnouncementId,
} from "@/services/announcement.service";

const SERVER_SNAPSHOT = "";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(ANNOUNCEMENT_CHANGED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ANNOUNCEMENT_CHANGED_EVENT, callback);
  };
}

/**
 * Tracks whether the announcement with the given `id` has been dismissed.
 *
 * Dismissal is persisted in localStorage and survives refreshes and revisits.
 * Changing the announcement id produces a fresh, visible announcement even
 * after the previous one was dismissed. SSR-safe via `useSyncExternalStore`:
 * the server renders the announcement visible, so first-time visitors see it
 * immediately in the initial HTML.
 */
export function useAnnouncementDismiss(id: string): {
  visible: boolean;
  dismiss: () => void;
} {
  const dismissedId = useSyncExternalStore(
    subscribe,
    getDismissedAnnouncementId,
    () => SERVER_SNAPSHOT
  );

  const visible = dismissedId !== id;

  const dismiss = useCallback(() => {
    dismissAnnouncement(id);
  }, [id]);

  return { visible, dismiss };
}