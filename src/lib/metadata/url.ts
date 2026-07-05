import { randomUUID } from "node:crypto";
import * as cheerio from "cheerio";
import { contributorFromName } from "./contributors";
import { dateFromString, todayDateParts } from "./date";
import { fetchWithTimeout } from "./fetch";
import { assertPublicHttpUrl } from "./safe-url";
import { buildWarnings } from "./warnings";
import { MetadataError, type CitationMetadata } from "./types";

type JsonLdRecord = Record<string, unknown>;

export async function extractUrlMetadata(rawUrl: string) {
  const parsedUrl = await assertPublicHttpUrl(rawUrl);
  const response = await fetchWithTimeout(parsedUrl.toString(), {
    timeoutMs: 8000,
    headers: {
      "User-Agent": "CitationGenerator/0.1 metadata extractor"
    }
  });

  if (!response.ok) {
    throw new MetadataError(`URL metadata extraction failed with status ${response.status}.`, {
      status: response.status,
      code: "url_http_error"
    });
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    throw new MetadataError("This URL did not return an HTML page. Try manual entry.", {
      status: 415,
      code: "url_not_html"
    });
  }

  const html = await limitedText(response, 1_500_000);
  const $ = cheerio.load(html);
  const jsonLdRecords = extractJsonLd($);

  const canonical = resolveUrl(
    $("link[rel='canonical']").attr("href") ??
      meta($, "og:url") ??
      parsedUrl.toString(),
    parsedUrl
  );

  const title =
    meta($, "og:title") ??
    meta($, "twitter:title") ??
    firstJsonValue(jsonLdRecords, ["headline", "name"]) ??
    $("title").first().text().trim();

  if (!title) {
    throw new MetadataError("No usable page title was found. Try manual entry.", {
      status: 422,
      code: "url_missing_title"
    });
  }

  const siteName =
    meta($, "og:site_name") ??
    firstJsonValue(jsonLdRecords, ["publisher.name", "isPartOf.name"]) ??
    parsedUrl.hostname.replace(/^www\./, "");

  const authorName =
    metaName($, "author") ??
    firstJsonValue(jsonLdRecords, ["author.name", "creator.name", "author"]);

  const published =
    meta($, "article:published_time") ??
    metaName($, "date") ??
    firstJsonValue(jsonLdRecords, ["datePublished", "dateCreated"]);

  const modified =
    meta($, "article:modified_time") ??
    firstJsonValue(jsonLdRecords, ["dateModified", "dateUpdated"]);

  const detectedType = isVideoUrl(parsedUrl) || isVideoJsonLd(jsonLdRecords) ? "video" : "website";

  const metadata: CitationMetadata = {
    id: randomUUID(),
    sourceType: detectedType,
    title,
    authors: authorName ? [contributorFromName(authorName)] : [],
    issued: dateFromString(published ?? modified),
    accessed: todayDateParts(),
    containerTitle: siteName,
    siteName,
    URL: canonical,
    abstract:
      meta($, "og:description") ??
      metaName($, "description") ??
      firstJsonValue(jsonLdRecords, ["description"]),
    sourceLabel: "Metadata extracted from URL",
    sourceProvider: "url",
    warnings: []
  };

  metadata.warnings = buildWarnings(metadata);
  return { metadata };
}

function meta($: cheerio.CheerioAPI, property: string) {
  return $(`meta[property='${property}']`).attr("content")?.trim() || undefined;
}

function metaName($: cheerio.CheerioAPI, name: string) {
  return $(`meta[name='${name}'], meta[itemprop='${name}']`).attr("content")?.trim() || undefined;
}

function resolveUrl(value: string, base: URL) {
  try {
    return new URL(value, base).toString();
  } catch {
    return base.toString();
  }
}

async function limitedText(response: Response, maxBytes: number) {
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const limited = bytes.byteLength > maxBytes ? bytes.slice(0, maxBytes) : bytes;
  return new TextDecoder("utf-8", { fatal: false }).decode(limited);
}

function extractJsonLd($: cheerio.CheerioAPI) {
  const records: JsonLdRecord[] = [];
  $("script[type='application/ld+json']").each((_, element) => {
    const raw = $(element).contents().text();
    if (!raw.trim()) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      flattenJsonLd(parsed).forEach((record) => records.push(record));
    } catch {
      // Invalid JSON-LD is common on the web. Other metadata can still be used.
    }
  });
  return records;
}

function flattenJsonLd(value: unknown): JsonLdRecord[] {
  if (Array.isArray(value)) return value.flatMap(flattenJsonLd);
  if (!isRecord(value)) return [];
  const graph = value["@graph"];
  const records = [value];
  if (Array.isArray(graph)) {
    records.push(...graph.filter(isRecord));
  }
  return records;
}

function firstJsonValue(records: JsonLdRecord[], paths: string[]) {
  for (const path of paths) {
    for (const record of records) {
      const value = readPath(record, path);
      if (typeof value === "string" && value.trim()) return value.trim();
      if (Array.isArray(value)) {
        const first = value.find((entry) => typeof entry === "string" && entry.trim());
        if (typeof first === "string") return first.trim();
      }
    }
  }
  return undefined;
}

function readPath(record: JsonLdRecord, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (Array.isArray(current)) {
      const firstRecord = current.find(isRecord);
      return firstRecord?.[key];
    }
    if (!isRecord(current)) return undefined;
    return current[key];
  }, record);
}

function isRecord(value: unknown): value is JsonLdRecord {
  return typeof value === "object" && value !== null;
}

function isVideoUrl(url: URL) {
  return /(^|\.)youtube\.com$|(^|\.)youtu\.be$|(^|\.)vimeo\.com$/i.test(url.hostname);
}

function isVideoJsonLd(records: JsonLdRecord[]) {
  return records.some((record) => {
    const type = record["@type"];
    if (typeof type === "string") return type.toLowerCase().includes("video");
    if (Array.isArray(type)) {
      return type.some((entry) => typeof entry === "string" && entry.toLowerCase().includes("video"));
    }
    return false;
  });
}
