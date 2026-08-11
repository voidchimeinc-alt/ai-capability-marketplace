"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const STORAGE_KEY = "ai-workbench.shortlist";
const listeners = new Set<() => void>();
const EMPTY: string[] = [];

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

function readSlugs(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as string[];
    return parsed.length ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getServerSnapshot() {
  return EMPTY;
}

function writeSlugs(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  emit();
}

type ShortlistContextValue = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const slugs = useSyncExternalStore(subscribe, readSlugs, getServerSnapshot);

  const add = useCallback((slug: string) => {
    const next = readSlugs();
    if (!next.includes(slug)) writeSlugs([...next, slug]);
  }, []);

  const remove = useCallback((slug: string) => {
    writeSlugs(readSlugs().filter((s) => s !== slug));
  }, []);

  const toggle = useCallback((slug: string) => {
    const next = readSlugs();
    writeSlugs(next.includes(slug) ? next.filter((s) => s !== slug) : [...next, slug]);
  }, []);

  const clear = useCallback(() => writeSlugs([]), []);

  const value = useMemo(
    () => ({
      slugs,
      has: (slug: string) => slugs.includes(slug),
      toggle,
      add,
      remove,
      clear,
    }),
    [slugs, toggle, add, remove, clear],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used within ShortlistProvider");
  return ctx;
}
