import { randomUUID } from "node:crypto";
import { dateFromParts } from "./date";
import { contributorsFromCrossref } from "./contributors";
import { fetchJson } from "./fetch";
import { buildWarnings } from "./warnings";
import { MetadataError, type CitationMetadata } from "./types";

type CrossrefWork = {
  DOI?: string;
  URL?: string;
  title?: string[];
  subtitle?: string[];
  author?: Array<{ given?: string; family?: string; name?: string }>;
  editor?: Array<{ given?: string; family?: string; name?: string }>;
  issued?: { "date-parts"?: unknown };
  published?: { "date-parts"?: unknown };
  "published-print"?: { "date-parts"?: unknown };
  "published-online"?: { "date-parts"?: unknown };
  "container-title"?: string[];
  "short-container-title"?: string[];
  volume?: string;
  issue?: string;
  page?: string;
  publisher?: string;
  ISBN?: string[];
  type?: string;
  score?: number;
};

type CrossrefResponse<T> = {
  status: string;
  message: T;
};

const crossrefMailto = process.env.CROSSREF_MAILTO?.trim();

const crossrefHeaders = {
  "User-Agent": crossrefMailto
    ? `CitationGenerator/0.1 (mailto:${crossrefMailto})`
    : "CitationGenerator/0.1"
};

function crossrefApiUrl(path: string, params = new URLSearchParams()) {
  if (crossrefMailto) params.set("mailto", crossrefMailto);
  const query = params.toString();
  return `https://api.crossref.org${path}${query ? `?${query}` : ""}`;
}

export async function lookupCrossrefDoi(doi: string) {
  const cleanDoi = encodeURIComponent(doi);
  const response = await fetchJson<CrossrefResponse<CrossrefWork>>(
    crossrefApiUrl(`/works/${cleanDoi}`),
    {
      headers: crossrefHeaders,
      timeoutMs: 8000,
      errorLabel: "CrossRef DOI lookup"
    }
  );

  if (!response.message?.title?.length) {
    throw new MetadataError("CrossRef did not return usable metadata for this DOI.", {
      status: 404,
      code: "crossref_no_metadata"
    });
  }

  return { metadata: crossrefWorkToMetadata(response.message, "Data from CrossRef") };
}

export async function searchCrossrefTitle(title: string) {
  const params = new URLSearchParams({
    "query.title": title,
    rows: "1"
  });

  const response = await fetchJson<
    CrossrefResponse<{ items?: CrossrefWork[]; "total-results"?: number }>
  >(crossrefApiUrl("/works", params), {
    headers: crossrefHeaders,
    timeoutMs: 8000,
    errorLabel: "CrossRef title search"
  });

  const item = response.message.items?.[0];
  if (!item?.title?.length) {
    throw new MetadataError("No CrossRef title result was found. Try manual entry.", {
      status: 404,
      code: "crossref_no_result"
    });
  }

  return { metadata: crossrefWorkToMetadata(item, "Data from CrossRef title search") };
}

function crossrefWorkToMetadata(work: CrossrefWork, sourceLabel: string): CitationMetadata {
  const issued =
    dateFromParts(work.issued?.["date-parts"]) ??
    dateFromParts(work.published?.["date-parts"]) ??
    dateFromParts(work["published-print"]?.["date-parts"]) ??
    dateFromParts(work["published-online"]?.["date-parts"]);

  const title = [work.title?.[0], work.subtitle?.[0]].filter(Boolean).join(": ");
  const sourceType = work.type === "book" || work.ISBN?.length ? "book" : "journal";

  const metadata: CitationMetadata = {
    id: randomUUID(),
    sourceType,
    title,
    authors: contributorsFromCrossref(work.author),
    editors: contributorsFromCrossref(work.editor),
    issued,
    containerTitle: work["container-title"]?.[0],
    containerTitleShort: work["short-container-title"]?.[0],
    volume: work.volume,
    issue: work.issue,
    page: work.page,
    DOI: work.DOI,
    URL: work.URL,
    publisher: work.publisher,
    ISBN: work.ISBN?.[0],
    sourceLabel,
    sourceProvider: "crossref",
    warnings: []
  };

  metadata.warnings = buildWarnings(metadata);
  return metadata;
}
