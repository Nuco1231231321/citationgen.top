import { detectInput } from "./detect";
import { lookupCrossrefDoi, searchCrossrefTitle } from "./crossref";
import { lookupGoogleBooksIsbn, searchGoogleBooksTitle } from "./google-books";
import { extractUrlMetadata } from "./url";
import { createManualMetadata, normalizeManualMetadata } from "./manual";
import { MetadataError, type CitationMetadata, type ResolvedSourceType, type SourceType } from "./types";

export async function resolveCitationMetadata(options: {
  input?: string;
  sourceType: SourceType;
  metadata?: CitationMetadata;
}) {
  if (options.sourceType === "manual") {
    if (options.metadata) return { metadata: normalizeManualMetadata(options.metadata) };
    return { metadata: createManualMetadata("manual") };
  }

  if (options.metadata) {
    const sourceType: ResolvedSourceType =
      options.sourceType === "auto" ? options.metadata.sourceType : options.sourceType;
    return { metadata: normalizeManualMetadata({ ...options.metadata, sourceType }) };
  }

  const detected = detectInput(options.input ?? "");
  if (detected.kind === "empty") {
    throw new MetadataError("Paste a DOI, ISBN, URL, title, or use manual entry.", {
      status: 400,
      code: "empty_input"
    });
  }

  if (options.sourceType === "auto") {
    if (detected.kind === "doi") return lookupCrossrefDoi(detected.value);
    if (detected.kind === "isbn") return lookupGoogleBooksIsbn(detected.value);
    if (detected.kind === "url") return extractUrlMetadata(detected.value);
    if (detected.kind === "title") {
      try {
        return await searchCrossrefTitle(detected.value);
      } catch (articleError) {
        try {
          return await searchGoogleBooksTitle(detected.value);
        } catch {
          if (articleError instanceof MetadataError) throw articleError;
          throw new MetadataError("No public article or book record was found for that title.", {
            status: 404,
            code: "title_not_found"
          });
        }
      }
    }
  }

  const requestedSourceType = toResolvedSourceType(options.sourceType);

  if (detected.kind === "doi") return lookupCrossrefDoi(detected.value);
  if (detected.kind === "isbn") return lookupGoogleBooksIsbn(detected.value);
  if (detected.kind === "url") {
    const result = await extractUrlMetadata(detected.value);
    if (requestedSourceType === "video") {
      return { metadata: { ...result.metadata, sourceType: "video" as const } };
    }
    if (requestedSourceType === "website" || result.metadata.sourceType === "video") {
      return result;
    }
    return { metadata: { ...result.metadata, sourceType: requestedSourceType } };
  }

  if (detected.kind === "title") {
    if (requestedSourceType === "book") return searchGoogleBooksTitle(detected.value);
    if (requestedSourceType === "journal") return searchCrossrefTitle(detected.value);
    throw new MetadataError(
      "Title search is available for journal articles and books. Use manual entry for this source type.",
      { status: 400, code: "unsupported_title_search" }
    );
  }

  throw new MetadataError("This input could not be recognized. Try manual entry.", {
    status: 400,
    code: "unrecognized_input"
  });
}

function toResolvedSourceType(sourceType: SourceType): ResolvedSourceType {
  if (sourceType === "journal" || sourceType === "book" || sourceType === "website" || sourceType === "video") {
    return sourceType;
  }
  return "website";
}
