"use client";

import { useSyncExternalStore } from "react";
import { SESSION_KEY } from "./constants";
import { loadSession } from "./session";
import type { SessionData } from "./saju/types";

let cachedRaw: string | null | undefined;
let cachedSnapshot: SessionData | null | undefined;

function invalidateCache(): void {
  cachedRaw = undefined;
  cachedSnapshot = undefined;
}

function getSnapshot(): SessionData | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(SESSION_KEY);
  if (raw === cachedRaw && cachedSnapshot !== undefined) {
    return cachedSnapshot;
  }

  cachedRaw = raw;
  cachedSnapshot = loadSession();
  return cachedSnapshot;
}

function getServerSnapshot(): SessionData | null {
  return null;
}

function subscribe(callback: () => void) {
  const handler = () => {
    invalidateCache();
    callback();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("session-update", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("session-update", handler);
  };
}

export function useClientSession(): SessionData | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
