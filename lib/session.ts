"use client";

import { SESSION_KEY } from "./constants";
import type { SessionData } from "./saju/types";

export function saveSession(data: SessionData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("session-update"));
}

export function loadSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function updateSession(partial: Partial<SessionData>): SessionData | null {
  const current = loadSession();
  if (!current) return null;
  const next = { ...current, ...partial };
  saveSession(next);
  return next;
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("session-update"));
}
