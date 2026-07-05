"use client";

import { useCallback, useMemo } from "react";
import type { GeneratorSlug } from "@/lib/formats";
import type { CitationMetadata, CitationResponse } from "@/lib/metadata/types";
import { stripHtml } from "@/lib/utils";
import { useLocalStorage } from "./useLocalStorage";

export type LibraryEntry = {
  id: string;
  itemKey: string;
  fullCitation: string;
  inTextCitation: string;
  styleSlug: GeneratorSlug;
  sourceLabels: string[];
  warnings: string[];
  metadata: CitationMetadata;
  input: string;
  addedAt: number;
};

const MAX_LIBRARY_ITEMS = 100;

export function useCitationLibrary() {
  const { value, setValue, remove, ready } = useLocalStorage<LibraryEntry[]>(
    "citation-library-v1",
    []
  );

  const items = useMemo(
    () => [...(value ?? [])].sort((a, b) => (a.addedAt ?? 0) - (b.addedAt ?? 0)),
    [value]
  );

  const hasItem = useCallback(
    (result: CitationResponse, styleSlug: GeneratorSlug) => {
      const itemKey = createLibraryKey(result.metadata, styleSlug);
      return (value ?? []).some((item) => item.itemKey === itemKey);
    },
    [value]
  );

  const addItem = useCallback(
    (result: CitationResponse, styleSlug: GeneratorSlug, input: string) => {
      const itemKey = createLibraryKey(result.metadata, styleSlug);
      const entry: LibraryEntry = {
        id: `${itemKey}-${Date.now()}`,
        itemKey,
        fullCitation: stripHtml(result.fullCitation),
        inTextCitation: stripHtml(result.inTextCitation),
        styleSlug,
        sourceLabels: result.sourceLabels,
        warnings: result.warnings,
        metadata: result.metadata,
        input,
        addedAt: Date.now()
      };

      const alreadySaved = (value ?? []).some((item) => item.itemKey === itemKey);
      setValue((prev) => {
        const filtered = (prev ?? []).filter((item) => item.itemKey !== itemKey);
        return [...filtered, entry].slice(-MAX_LIBRARY_ITEMS);
      });

      return alreadySaved ? "updated" : "added";
    },
    [setValue, value]
  );

  const removeItem = useCallback(
    (id: string) => {
      setValue((prev) => (prev ?? []).filter((item) => item.id !== id));
    },
    [setValue]
  );

  const clearLibrary = useCallback(() => {
    remove();
  }, [remove]);

  return { items, ready, addItem, removeItem, clearLibrary, hasItem };
}

function createLibraryKey(metadata: CitationMetadata, styleSlug: GeneratorSlug) {
  const sourceKey =
    metadata.DOI?.toLowerCase() ??
    metadata.ISBN?.replace(/[-\s]/g, "").toLowerCase() ??
    metadata.URL?.toLowerCase() ??
    metadata.title?.toLowerCase() ??
    metadata.id;

  return `${styleSlug}:${metadata.sourceType}:${sourceKey}`;
}
