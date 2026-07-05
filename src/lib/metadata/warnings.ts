import type { CitationMetadata } from "./types";

export function buildWarnings(metadata: CitationMetadata) {
  const warnings = new Set(metadata.warnings);

  if (!metadata.title) warnings.add("Title is missing.");
  if (!metadata.authors.length) warnings.add("Author is missing.");
  if (!metadata.issued?.year) warnings.add("Publication date is missing.");

  if (metadata.sourceType === "journal") {
    if (!metadata.containerTitle) warnings.add("Journal title is missing.");
    if (!metadata.volume) warnings.add("Volume is missing.");
    if (!metadata.page) warnings.add("Page range is missing.");
    if (!metadata.DOI) warnings.add("DOI is missing.");
  }

  if (metadata.sourceType === "book") {
    if (!metadata.publisher) warnings.add("Publisher is missing.");
  }

  if (metadata.sourceType === "website" || metadata.sourceType === "video") {
    if (!metadata.URL) warnings.add("URL is missing.");
    if (!metadata.accessed?.year) warnings.add("Access date is missing.");
  }

  return Array.from(warnings);
}
