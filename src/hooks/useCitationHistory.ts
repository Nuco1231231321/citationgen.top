"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { CitationResponse } from "@/lib/metadata/types";
import type { GeneratorSlug } from "@/lib/formats";
import { stripHtml } from "@/lib/utils";

export type HistoryEntry = {
  id: string;
  fullCitation: string;
  inTextCitation: string;
  styleSlug: string;
  input: string;
  sourceLabels: string[];
  warnings: string[];
  createdAt: number;
};

const MAX_ENTRIES = 30;

export function useCitationHistory() {
  const { value, setValue, remove, ready } = useLocalStorage<HistoryEntry[]>(
    "citation-history-v1",
    []
  );

  const entries = useMemo(
    () =>
      [...(value ?? [])].sort(
        (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
      ),
    [value]
  );

  const addEntry = useCallback(
    (
      result: CitationResponse,
      styleSlug: GeneratorSlug,
      input: string
    ) => {
      const entry: HistoryEntry = {
        id: result.metadata.id,
        fullCitation: stripHtml(result.fullCitation),
        inTextCitation: stripHtml(result.inTextCitation),
        styleSlug,
        input,
        sourceLabels: result.sourceLabels,
        warnings: result.warnings,
        createdAt: Date.now()
      };

      setValue((prev) => {
        const filtered = (prev ?? []).filter((e) => e.id !== entry.id);
        const next = [entry, ...filtered];
        return next.slice(0, MAX_ENTRIES);
      });
    },
    [setValue]
  );

  const clearHistory = useCallback(() => {
    remove();
  }, [remove]);

  return { entries, addEntry, clearHistory, ready };
}
