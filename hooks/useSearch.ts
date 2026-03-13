import { useMemo } from "react";

export function useSearch<T>(items: T[], query: string, searchFields: (keyof T)[]): T[] {
  return useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        return typeof val === "string" && val.toLowerCase().includes(trimmed);
      }),
    );
  }, [items, query, searchFields]);
}
