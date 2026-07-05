export type DetectedInput =
  | { kind: "empty" }
  | { kind: "doi"; value: string }
  | { kind: "isbn"; value: string }
  | { kind: "url"; value: string }
  | { kind: "pmid"; value: string }
  | { kind: "arxiv"; value: string }
  | { kind: "title"; value: string }
  | { kind: "batch-doi"; values: string[] };

const doiPattern = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i;

export function detectInput(rawInput: string): DetectedInput {
  const input = rawInput.trim();
  if (!input) return { kind: "empty" };

  const batchResult = detectBatchDoi(input);
  if (batchResult) return batchResult;

  const doiMatch = input.match(doiPattern);
  if (doiMatch) {
    return { kind: "doi", value: cleanDoi(doiMatch[0]) };
  }

  const maybeIsbn = input.replace(/[-\s]/g, "");
  if (/^(97[89])?\d{9}[\dX]$/i.test(maybeIsbn) && isValidIsbn(maybeIsbn)) {
    return { kind: "isbn", value: maybeIsbn.toUpperCase() };
  }

  try {
    const url = new URL(input);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return { kind: "url", value: url.toString() };
    }
  } catch {
    // Not a URL, continue below.
  }

  const pmid = extractPmid(input);
  if (pmid) return { kind: "pmid", value: pmid };

  const arxiv = extractArxivId(input);
  if (arxiv) return { kind: "arxiv", value: arxiv };

  return { kind: "title", value: input };
}

function detectBatchDoi(input: string): DetectedInput | null {
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  const dois: string[] = [];
  for (const line of lines) {
    const match = line.match(doiPattern);
    if (!match) return null;
    dois.push(cleanDoi(match[0]));
  }
  if (dois.length < 2) return null;
  return { kind: "batch-doi", values: dois };
}

function extractPmid(input: string): string | null {
  const match = input.match(/^PMID:\s*(\d+)$/i) ?? input.match(/^(\d{8})$/);
  if (!match) return null;
  const id = match[1];
  if (id.length >= 7 && id.length <= 9 && /^\d+$/.test(id)) return id;
  return null;
}

function extractArxivId(input: string): string | null {
  const clean = input
    .replace(/^https?:\/\/arxiv\.org\/(abs|pdf)\//i, "")
    .replace(/^arxiv:\s*/i, "");
  const legacy = clean.match(/^([a-z-]+(?:\.[a-z]{2})?\.?\d{4}\d{4}(?:v\d+)?)$/i);
  if (legacy) return legacy[1];
  const modern = clean.match(/^(\d{4}\.\d{4,5}(?:v\d+)?)$/);
  if (modern) return modern[1];
  return null;
}

export function detectionLabel(detected: DetectedInput): string {
  switch (detected.kind) {
    case "empty":
      return "Waiting for input";
    case "doi":
      return `DOI detected: ${detected.value}`;
    case "isbn":
      return `ISBN detected: ${detected.value}`;
    case "url":
      return "URL detected";
    case "pmid":
      return `PubMed ID detected: ${detected.value}`;
    case "arxiv":
      return `arXiv ID detected: ${detected.value}`;
    case "title":
      return "Searching by title";
    case "batch-doi":
      return `${detected.values.length} DOIs detected for batch processing`;
    default:
      return "Input detected";
  }
}

export function cleanDoi(value: string) {
  return value
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .replace(/[.,;)\]]+$/g, "")
    .trim();
}

function isValidIsbn(value: string) {
  if (value.length === 10) return isValidIsbn10(value);
  if (value.length === 13) return isValidIsbn13(value);
  return false;
}

function isValidIsbn10(value: string) {
  let sum = 0;
  for (let index = 0; index < 10; index += 1) {
    const char = value[index]?.toUpperCase();
    const digit = char === "X" && index === 9 ? 10 : Number(char);
    if (!Number.isInteger(digit)) return false;
    sum += digit * (10 - index);
  }
  return sum % 11 === 0;
}

function isValidIsbn13(value: string) {
  let sum = 0;
  for (let index = 0; index < 13; index += 1) {
    const digit = Number(value[index]);
    if (!Number.isInteger(digit)) return false;
    sum += digit * (index % 2 === 0 ? 1 : 3);
  }
  return sum % 10 === 0;
}
