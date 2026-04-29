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
    if (payload.length > 4 * 1024 * 1024) return; // skip if > 4MB
    localStorage.setItem(key, payload);
  } catch {
    // localStorage disabled or full — fail silently
  }
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  debounceMs = 500,
): {
  value: T;
  set: (v: T | ((prev: T) => T)) => void;
  clear: () => void;
  saved: boolean;
} {
  const [value, setInner] = useState<T>(defaultValue);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = readItem<T>(key);
    if (stored !== null) setInner(stored);
  }, [key]);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setInner(prev => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          writeItem(key, next);
          setSaved(true);
          if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
          savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
        }, debounceMs);

        return next;
      });
    },
    [key, debounceMs],
  );

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInner(defaultValue);
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    setSaved(false);
  }, [key, defaultValue]);

  return { value, set, clear, saved };
}
