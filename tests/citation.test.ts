import { describe, expect, it } from "vitest";
import { generatorSlugs } from "@/lib/formats";
import { renderCitation } from "@/lib/citation/csl";
import { lookupJournalAbbreviation } from "@/lib/citation/nlm";
import type { CitationMetadata } from "@/lib/metadata/types";

const article: CitationMetadata = {
  id: "jacs-example",
  sourceType: "journal",
  title:
    "Conversion of Aldehyde to Alkane by a Peroxoiron(III) Complex: A Functional Model for the Cyanobacterial Aldehyde-Deformylating Oxygenase",
  authors: [
    { given: "Alireza", family: "Shokri" },
    { given: "Lawrence", family: "Que" }
  ],
  issued: { year: 2015, month: 6, day: 24 },
  containerTitle: "Journal of the American Chemical Society",
  volume: "137",
  issue: "24",
  page: "7686-7691",
  DOI: "10.1021/jacs.5b01053",
  sourceLabel: "Data from CrossRef",
  sourceProvider: "crossref",
  warnings: []
};

describe("citation rendering", () => {
  it("renders the same metadata across all 10 formats", async () => {
    for (const slug of generatorSlugs) {
      const result = await renderCitation(article, slug);
      expect(result.fullCitation.length).toBeGreaterThan(20);
      expect(result.metadata.title).toBe(article.title);
    }
  });

  it("uses local NLM data or ACS patch for ACS abbreviations", async () => {
    const result = await lookupJournalAbbreviation("Journal of the American Chemical Society", "acs");
    expect(result?.abbreviation).toContain("J.");
    expect(result?.label).toMatch(/Abbreviation from/);
  });

  it("keeps manual metadata in the same rendering path", async () => {
    const result = await renderCitation(
      {
        ...article,
        id: "manual-example",
        sourceLabel: "Manually entered",
        sourceProvider: "manual"
      },
      "apa"
    );
    expect(result.fullCitation).toContain("Shokri");
  });

  it("decodes HTML entities in rendered citations", async () => {
    const result = await renderCitation(article, "apa");
    expect(result.fullCitation).toContain("Shokri, A., & Que, L.");
    expect(result.fullCitation).not.toContain("&#38;");
  });
});
