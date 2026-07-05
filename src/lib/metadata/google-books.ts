import { randomUUID } from "node:crypto";
import { contributorsFromGoogleBooks } from "./contributors";
import { dateFromString } from "./date";
import { fetchJson } from "./fetch";
import { buildWarnings } from "./warnings";
import { MetadataError, type CitationMetadata } from "./types";

type GoogleBooksResponse = {
  totalItems?: number;
  items?: Array<{
    volumeInfo?: {
      title?: string;
      subtitle?: string;
      authors?: string[];
      publisher?: string;
      publishedDate?: string;
      industryIdentifiers?: Array<{ type?: string; identifier?: string }>;
      infoLink?: string;
      canonicalVolumeLink?: string;
      description?: string;
    };
  }>;
};

export async function lookupGoogleBooksIsbn(isbn: string) {
  return searchGoogleBooks(`isbn:${isbn}`, "Data from Google Books");
}

export async function searchGoogleBooksTitle(title: string) {
  return searchGoogleBooks(`intitle:${title}`, "Data from Google Books title search");
}

async function searchGoogleBooks(query: string, sourceLabel: string) {
  const params = new URLSearchParams({
    q: query,
    maxResults: "1",
    printType: "books"
  });

  const response = await fetchJson<GoogleBooksResponse>(
    `https://www.googleapis.com/books/v1/volumes?${params.toString()}`,
    {
      timeoutMs: 8000,
      errorLabel: "Google Books lookup"
    }
  );

  const volume = response.items?.[0]?.volumeInfo;
  if (!volume?.title) {
    throw new MetadataError("No Google Books result was found. Try manual entry.", {
      status: 404,
      code: "google_books_no_result"
    });
  }

  const title = [volume.title, volume.subtitle].filter(Boolean).join(": ");
  const isbn =
    volume.industryIdentifiers?.find((entry) => entry.type === "ISBN_13")?.identifier ??
    volume.industryIdentifiers?.find((entry) => entry.type === "ISBN_10")?.identifier;

  const metadata: CitationMetadata = {
    id: randomUUID(),
    sourceType: "book",
    title,
    authors: contributorsFromGoogleBooks(volume.authors),
    issued: dateFromString(volume.publishedDate),
    publisher: volume.publisher,
    ISBN: isbn,
    URL: volume.canonicalVolumeLink ?? volume.infoLink,
    abstract: volume.description,
    sourceLabel,
    sourceProvider: "google-books",
    warnings: []
  };

  metadata.warnings = buildWarnings(metadata);
  return { metadata };
}
