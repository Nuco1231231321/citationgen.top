import { afterEach, describe, expect, it, vi } from "vitest";
import { lookupCrossrefDoi, searchCrossrefTitle } from "@/lib/metadata/crossref";
import { lookupGoogleBooksIsbn } from "@/lib/metadata/google-books";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("metadata providers", () => {
  it("normalizes CrossRef DOI metadata", async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
      Response.json({
        status: "ok",
        message: {
          DOI: "10.1021/jacs.5b01053",
          title: ["Conversion of Aldehyde to Alkane"],
          author: [{ given: "Alireza", family: "Shokri" }],
          issued: { "date-parts": [[2015, 6, 24]] },
          "container-title": ["Journal of the American Chemical Society"],
          volume: "137",
          issue: "24",
          page: "7686-7691"
        }
      })
    );
    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    const { metadata } = await lookupCrossrefDoi("10.1021/jacs.5b01053");
    const [url, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(String(url)).not.toContain("metadata@example.com");
    expect(headers["User-Agent"]).not.toContain("metadata@example.com");
    expect(metadata.sourceProvider).toBe("crossref");
    expect(metadata.title).toBe("Conversion of Aldehyde to Alkane");
    expect(metadata.authors[0]).toEqual({ given: "Alireza", family: "Shokri" });
    expect(metadata.issued?.year).toBe(2015);
  });

  it("throws when CrossRef title search has no result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          status: "ok",
          message: { items: [] }
        })
      )
    );

    await expect(searchCrossrefTitle("not a real title")).rejects.toThrow("No CrossRef title result");
  });

  it("normalizes Google Books ISBN metadata", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          totalItems: 1,
          items: [
            {
              volumeInfo: {
                title: "Introduction to Algorithms",
                authors: ["Thomas H. Cormen"],
                publisher: "MIT Press",
                publishedDate: "2022",
                industryIdentifiers: [{ type: "ISBN_13", identifier: "9780262046305" }]
              }
            }
          ]
        })
      )
    );

    const { metadata } = await lookupGoogleBooksIsbn("9780262046305");
    expect(metadata.sourceProvider).toBe("google-books");
    expect(metadata.sourceType).toBe("book");
    expect(metadata.publisher).toBe("MIT Press");
  });
});
