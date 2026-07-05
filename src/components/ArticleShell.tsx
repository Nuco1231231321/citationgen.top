import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import type { ArticleRecord } from "@/lib/articles";
import { generatorFormats, generatorPath } from "@/lib/formats";

type ArticleShellProps = {
  article: ArticleRecord;
  children: ReactNode;
};

export function ArticleShell({
  article,
  children
}: ArticleShellProps) {
  return (
    <main>
      <section className="site-shell py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-dim">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li>
              <Link href="/blog/" className="hover:text-ink transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li className="font-medium text-ink">{article.category}</li>
          </ol>
        </nav>

        <div className="article-hero">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {article.eyebrow}
            </p>
            <h1 className="font-editorial mt-4 text-balance text-[34px] leading-[1.08] text-ink md:text-[54px]">
              {article.title}
            </h1>
            <p className="mt-5 max-w-[68ch] text-pretty text-[16px] leading-7 text-dim">
              {article.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-faint">
              <span>Updated {formatDisplayDate(article.dateModified)}</span>
              <span aria-hidden="true">/</span>
              <span>{article.readingTime}</span>
            </div>
          </div>
          <div className="article-hero-image">
            <Image
              src={article.heroImage}
              alt={article.heroAlt}
              width={720}
              height={450}
              priority
            />
          </div>
        </div>
      </section>

      <section className="site-shell pb-16 md:pb-20">
        <div className="article-layout">
          <aside className="article-sidebar" aria-label="Article summary">
            <div className="article-side-panel">
              <h2>Use this article to check</h2>
              <ul>
                {article.keyTakeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            </div>
            <div className="article-side-panel">
              <h2>Open a generator</h2>
              <div className="article-generator-links">
                {article.relatedGenerators.map((slug) => {
                  const format = generatorFormats[slug];
                  return (
                    <Link key={slug} href={generatorPath(slug)}>
                      <span>{format.label} Citation Generator</span>
                      <ArrowRight aria-hidden="true" size={15} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <article className="article-body">{children}</article>
        </div>
      </section>

      {article.author ? (
        <AuthorCard article={article} />
      ) : null}

      {article.references?.length ? (
        <ReferencesSection article={article} />
      ) : null}
    </main>
  );
}

function AuthorCard({ article }: { article: ArticleRecord }) {
  if (!article.author) return null;
  return (
    <section className="site-shell pb-10">
      <div className="article-layout">
        <div />
        <div className="rounded-2xl bg-surface p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-base font-semibold text-page">
              {article.author.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{article.author.name}</p>
              <p className="text-xs text-faint">{article.author.role}</p>
              <p className="mt-2 text-sm leading-6 text-dim">{article.author.bio}</p>
              <p className="mt-2 text-xs text-faint">
                Published {formatDisplayDate(article.datePublished)}. Last updated{" "}
                {formatDisplayDate(article.dateModified)}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReferencesSection({ article }: { article: ArticleRecord }) {
  if (!article.references?.length) return null;
  return (
    <section className="site-shell pb-16">
      <div className="article-layout">
        <div />
        <div>
          <h2 className="font-editorial text-[30px] leading-[1.18] text-ink mb-5">
            References &amp; sources
          </h2>
          <ol className="grid gap-3">
            {article.references.map((ref) => (
              <li key={ref.label} className="flex items-start gap-3 text-sm leading-6 text-dim">
                <span className="font-medium text-ink shrink-0">{ref.label}</span>
                <span>
                  {ref.description}{" "}
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-ink underline decoration-accent underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Source
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(value));
}
