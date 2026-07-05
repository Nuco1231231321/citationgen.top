import { absoluteUrl, siteConfig } from "./site";
import { generatorPath, type GeneratorFormat } from "./formats";
import type { ArticleRecord } from "./articles";

export function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/")}?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    breadcrumbJsonLd([{ name: "Home", url: absoluteUrl("/") }])
  ];
}

export function generatorJsonLd(format: GeneratorFormat) {
  const pageUrl = absoluteUrl(generatorPath(format.slug));
  return [
    breadcrumbJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: `${format.label} Citation Generator`, url: pageUrl }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: format.h1,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: pageUrl,
      description: format.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: format.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    }
  ];
}

export function collectionPageJsonLd(options: {
  name: string;
  description: string;
  path: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  items?: Array<{ name: string; url: string; description?: string }>;
}) {
  const pageUrl = absoluteUrl(options.path);
  const jsonLd: Record<string, unknown>[] = [
    breadcrumbJsonLd(options.breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: options.name,
      description: options.description,
      url: pageUrl
    }
  ];

  if (options.items?.length) {
    jsonLd.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: options.name,
        itemListElement: options.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: item.url,
          name: item.name,
          description: item.description
        }))
      });
  }

  return jsonLd;
}

export function articleJsonLd(
  article: ArticleRecord,
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return [
    breadcrumbJsonLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      url: absoluteUrl(article.path),
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      image: absoluteUrl(article.heroImage),
      author: article.author
        ? {
            "@type": "Person",
            name: article.author.name,
            description: article.author.bio
          }
        : {
            "@type": "Organization",
            name: siteConfig.name,
            url: absoluteUrl("/")
          },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: absoluteUrl("/")
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": absoluteUrl(article.path)
      }
    }
  ];
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
