import { randomUUID } from "node:crypto";
import { todayDateParts } from "./date";
import { buildWarnings } from "./warnings";
import type { CitationMetadata, ResolvedSourceType, SourceType } from "./types";

export function createManualMetadata(
  sourceType: SourceType | ResolvedSourceType,
  options?: { cslType?: string }
): CitationMetadata {
  const normalizedType =
    sourceType === "manual" || sourceType === "auto" ? "website" : sourceType;
  const metadata: CitationMetadata = {
    id: randomUUID(),
    sourceType: normalizedType,
    cslType: options?.cslType,
    title: "",
    authors: [],
    accessed: normalizedType === "website" || normalizedType === "video" ? todayDateParts() : undefined,
    sourceLabel: "Manually entered",
    sourceProvider: "manual",
    warnings: []
  };
  metadata.warnings = buildWarnings(metadata);
  return metadata;
}

export function normalizeManualMetadata(metadata: CitationMetadata): CitationMetadata {
  const normalized: CitationMetadata = {
    ...metadata,
    id: metadata.id || randomUUID(),
    sourceProvider: "manual",
    sourceLabel: "Manually entered",
    authors: metadata.authors ?? [],
    warnings: []
  };
  normalized.warnings = buildWarnings(normalized);
  return normalized;
}
