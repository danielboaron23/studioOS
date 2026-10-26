"use client"

import { useSyncExternalStore } from "react"
import { defaultSettings } from "./defaults"
import type { Settings } from "./types"

/**
 * Design-prototype store: in memory only (no localStorage). The real build
 * replaces this with lib/settings-store.ts as described in the spec; the
 * hook signature is meant to stay the same.
 */
let state: Settings = defaultSettings
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSettings() {
  return state
}

export function saveSection<K extends keyof Settings>(section: K, value: Settings[K]) {
  state = { ...state, [section]: value }
  listeners.forEach((l) => l())
}

/** Returns null during SSR/hydration so sections render their Skeleton first. */
export function useSettings(): Settings | null {
  return useSyncExternalStore(subscribe, getSettings, () => null)
}
