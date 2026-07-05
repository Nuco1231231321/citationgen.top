import type { MetadataRoute } from "next";
import { allGeneratorFormats, generatorPath } from "@/lib/formats";
import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/tools/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: absoluteUrl("/blog/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: absoluteUrl("/about/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6
    },
    ...allGeneratorFormats.map((format) => ({
      url: absoluteUrl(generatorPath(format.slug)),
      lastModified: now,
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
