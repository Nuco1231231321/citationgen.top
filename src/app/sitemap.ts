import type { MetadataRoute } from "next";
import { allGeneratorFormats, generatorPath } from "@/lib/formats";
import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const contentLastModified = new Date("2026-07-05T00:00:00.000Z");
  return [
    {
      url: absoluteUrl("/"),
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/tools/"),
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: absoluteUrl("/blog/"),
      lastModified: contentLastModified,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: absoluteUrl("/about/"),
      lastModified: contentLastModified,
      changeFrequency: "monthly",
      priority: 0.6
    },
    ...allGeneratorFormats.map((format) => ({
      url: absoluteUrl(generatorPath(format.slug)),
      lastModified: contentLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(article.path),
      lastModified: new Date(article.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.75
    }))
  ];
}
