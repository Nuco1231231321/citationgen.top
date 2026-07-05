import type { Metadata } from "next";
import type { ArticleRecord } from "./articles";
import { absoluteUrl } from "./site";

export function metadataForArticle(article: ArticleRecord): Metadata {
  const canonical = absoluteUrl(article.path);
  const title = article.seoTitle ?? article.title;

  return {
    title,
    description: article.description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description: article.description,
      url: canonical,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      images: [
        {
          url: absoluteUrl(article.heroImage),
          width: 1200,
          height: 750,
          alt: article.heroAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.description,
      images: [absoluteUrl(article.heroImage)]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export function articleBreadcrumbs(article: ArticleRecord) {
  return [
    { name: "Home", url: absoluteUrl("/") },
    { name: "Blog", url: absoluteUrl("/blog/") },
    { name: article.title, url: absoluteUrl(article.path) }
  ];
}
