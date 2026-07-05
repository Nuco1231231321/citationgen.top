import type { Metadata } from "next";
import Link from "next/link";
import { ContentHubClient } from "@/components/ContentHubClient";
import { JsonLd } from "@/components/JsonLd";
import { articles, articleCategories, hubCopy } from "@/lib/articles";
import { collectionPageJsonLd } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const pageTitle = hubCopy.blog.title;
const pageDescription = hubCopy.blog.description;
const allCategories = articleCategories();

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: absoluteUrl("/blog/")
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/blog/"),
    type: "website"
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription
  }
};

export default function BlogPage() {
  return (
    <main>
      <JsonLd
        data={collectionPageJsonLd({
          name: pageTitle,
          description: pageDescription,
          path: "/blog/",
          breadcrumbs: [
            { name: "Home", url: absoluteUrl("/") },
            { name: "Blog", url: absoluteUrl("/blog/") }
          ],
          items: articles.map((article) => ({
            name: article.title,
            url: absoluteUrl(article.path),
            description: article.description
          }))
        })}
      />

      <section className="site-shell py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-dim">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li className="font-medium text-ink">Blog</li>
          </ol>
        </nav>
        <div className="content-hub-hero">
          <p className="text-sm font-semibold text-accent">{hubCopy.blog.eyebrow}</p>
          <h1 className="font-editorial text-balance text-[34px] leading-[1.12] text-ink md:text-[52px]">
            {hubCopy.blog.title}
          </h1>
          <p className="mt-4 max-w-[64ch] text-pretty text-[16px] leading-7 text-dim">
            {hubCopy.blog.description}
          </p>
        </div>
      </section>

      <ContentHubClient
        articles={articles}
        categories={allCategories}
        searchPlaceholder={hubCopy.blog.searchPlaceholder}
      />
    </main>
  );
}
