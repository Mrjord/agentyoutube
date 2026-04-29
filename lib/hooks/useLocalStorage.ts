'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function readItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { v, ts } = JSON.parse(raw) as { v: T; ts: number };
    if (Date.now() - ts > EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

function writeItem<T>(key: string, value: T) {
  try {
    const payload = JSON.stringify({ v: value, ts: Date.now() });
    if (payload.length > 4 * 1024 * 1024) return; // skip if > 4 MB
    localStorage.setItem(key, payload);
  } catch {
    // localStorage disabled or full — fail silently
  }
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): {
  value: T;
  set: (v: T | ((prev: T) => T)) => void;
  clear: () => void;
  saved: boolean;
} {
  const [value, setValue] = useState<T>(defaultValue);
  const [saved, setSaved] = useState(false);
  // Track latest value in a ref so `set` doesn't need a functional setState updater
  const currentRef = useRef<T>(defaultValue);
  const indicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = readItem<T>(key);
    if (stored !== null) {
      currentRef.current = stored;
      setValue(stored);
    }
  }, [key]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(currentRef.current) : v;
      currentRef.current = next;
      setValue(next);

      // Write immediately — guarantees data survives tab switches before debounce fires
      writeItem(key, next);

      // Debounce only the visual "Sauvegardé" indicator
      if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      indicatorTimerRef.current = setTimeout(() => {
        setSaved(true);
        savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
      }, 300);
    },
    [key],
  );

  const clear = useCallback(() => {
    currentRef.current = defaultValue;
    setValue(defaultValue);
    if (indicatorTimerRef.current) clearTimeout(indicatorTimerRef.current);
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    setSaved(false);
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }, [key, defaultValue]);

  return { value, set, clear, saved };
}
