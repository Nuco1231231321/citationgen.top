import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { generatorPath } from "@/lib/formats";
import { absoluteUrl } from "@/lib/site";

describe("sitemap", () => {
  it("uses stable content dates for evergreen generator pages", () => {
    const entries = sitemap();
    const secondEntries = sitemap();
    const stableDate = "2026-07-05T00:00:00.000Z";

    const home = entries.find((entry) => entry.url === absoluteUrl("/"));
    const tools = entries.find((entry) => entry.url === absoluteUrl("/tools/"));
    const apa = entries.find((entry) => entry.url === absoluteUrl(generatorPath("apa")));
    const secondHome = secondEntries.find((entry) => entry.url === absoluteUrl("/"));

    expect(home?.lastModified).toEqual(new Date(stableDate));
    expect(tools?.lastModified).toEqual(new Date(stableDate));
    expect(apa?.lastModified).toEqual(new Date(stableDate));
    expect(secondHome?.lastModified).toEqual(home?.lastModified);
  });
});
