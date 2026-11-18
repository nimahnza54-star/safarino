"use client";

import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
};
const getSnapshot = () => Math.floor(Date.now() / 1000);
/** -1 means "unknown during SSR/first paint". */
const getServerSnapshot = () => -1;

/**
 * Wall-clock seconds, ticking once per second on the client.
 * SSR-safe: server snapshot is -1 until hydration completes.
 */
export function useNowSeconds(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
