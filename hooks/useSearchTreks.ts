import { useState, useEffect, useCallback, useRef } from "react";

export type TrekResult = {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  price_per_adult: number;
  duration: string;
  categories: { id: string; name: string; photo: string | null } | null;
};

export function useSearchTreks(query: string, debounceMs = 300) {
  const [results, setResults] = useState<TrekResult[]>([]);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, {
        signal: controller.signal,
      });
      const data = await res.json();
      if (!controller.signal.aborted) {
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") setResults([]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  // Load popular treks immediately on mount
  useEffect(() => {
    fetchResults("");
  }, [fetchResults]);

  // Debounce typed queries
  useEffect(() => {
    const timer = setTimeout(() => fetchResults(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, fetchResults, debounceMs]);

  return { results, loading };
}
