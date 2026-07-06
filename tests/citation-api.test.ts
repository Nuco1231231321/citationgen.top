import { describe, expect, it } from "vitest";
import { generatorSlugs } from "@/lib/formats";
import { handleCitationApiRequest, renderJournalCitation } from "../worker/citation-api";
import type { CitationMetadata } from "@/lib/metadata/types";

const journalMetadata: CitationMetadata = {
  id: "science-water-example",
  sourceType: "journal",
  title: "The Structure of Ordinary Water",
  authors: [{ given: "Henry S.", family: "Frank" }],
  issued: { year: 1970, month: 8, day: 14 },
  containerTitle: "Science",
  volume: "169",
  issue: "3946",
  page: "635-641",
  DOI: "10.1126/science.169.3946.635",
  URL: "https://doi.org/10.1126/science.169.3946.635",
  publisher: "American Association for the Advancement of Science (AAAS)",
  sourceLabel: "Data from CrossRef",
  sourceProvider: "crossref",
  warnings: []
};

const bookMetadata: CitationMetadata = {
  id: "manual-book-1",
  sourceType: "book",
  title: "Test Book",
  authors: [{ given: "Ada", family: "Lovelace" }],
  issued: { year: 2024 },
  publisher: "Example Press",
  sourceLabel: "Manually entered",
  sourceProvider: "manual",
  warnings: []
};

const websiteMetadata: CitationMetadata = {
  id: "manual-website-1",
  sourceType: "website",
  title: "Example Page",
  authors: [{ literal: "Example Organization" }],
  issued: { year: 2024, month: 7, day: 1 },
  containerTitle: "Example Site",
  URL: "https://example.com",
  sourceLabel: "Manually entered",
  sourceProvider: "manual",
  warnings: []
};

describe("worker citation api", () => {
  it("renders stable journal citations across all supported styles", () => {
    for (const slug of generatorSlugs) {
      const result = renderJournalCitation(journalMetadata, slug);
      expect(result.fullCitation).toContain("Frank");
      expect(result.fullCitation).toContain("Science");
      expect(result.fullCitation).not.toMatch(/\.\./);
      expect(result.inTextCitation.length).toBeGreaterThan(0);
    }
  });

  it("returns 200 for manual book requests", async () => {
    const response = await handleCitationApiRequest(
      new Request("https://citationgen.top/api/citations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          style: "apa",
          sourceType: "manual",
          metadata: bookMetadata
        })
      })
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { fullCitation: string };
    expect(payload.fullCitation).toContain("Lovelace");
  });

  it("returns 200 for manual website requests", async () => {
    const response = await handleCitationApiRequest(
      new Request("https://citationgen.top/api/citations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          style: "mla",
          sourceType: "manual",
          metadata: websiteMetadata
        })
      })
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { fullCitation: string };
    expect(payload.fullCitation).toContain("Example Page");
  });

  it("returns 200 for manual journal requests", async () => {
    const response = await handleCitationApiRequest(
      new Request("https://citationgen.top/api/citations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          style: "chicago",
          sourceType: "manual",
          metadata: journalMetadata
        })
      })
    );

    expect(response.status).toBe(200);
    const payload = (await response.json()) as { fullCitation: string; inTextCitation: string };
    expect(payload.fullCitation).toContain("Science");
    expect(payload.inTextCitation).toContain("Frank");
  });

  it("returns 400 for unsupported styles", async () => {
    const response = await handleCitationApiRequest(
      new Request("https://citationgen.top/api/citations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          style: "not-a-style",
          sourceType: "manual",
          metadata: bookMetadata
        })
      })
    );

    expect(response.status).toBe(400);
  });
});
