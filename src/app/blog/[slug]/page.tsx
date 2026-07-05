import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleShell } from "@/components/ArticleShell";
import { JsonLd } from "@/components/JsonLd";
import { articles, articleBySlug } from "@/lib/articles";
import { metadataForArticle, articleBreadcrumbs } from "@/lib/article-page";
import { articleJsonLd } from "@/lib/schema";

type ArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return metadataForArticle(article);
}

export default async function BlogArticlePage({ params }: ArticleRouteProps) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd data={articleJsonLd(article, articleBreadcrumbs(article))} />
      <ArticleShell article={article}>
        <ArticleContent article={article} />
      </ArticleShell>
    </>
  );
}
