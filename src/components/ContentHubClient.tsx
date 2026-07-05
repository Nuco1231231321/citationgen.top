"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import type { ArticleRecord } from "@/lib/articles";

type ContentHubClientProps = {
  articles: ArticleRecord[];
  categories: string[];
  searchPlaceholder: string;
};

export function ContentHubClient({
  articles,
  categories,
  searchPlaceholder
}: ContentHubClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const visibleArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        article.title,
        article.description,
        article.excerpt,
        article.category,
        ...article.tags
      ].join(" ").toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [activeCategory, articles, query]);

  return (
    <section className="site-shell pb-16 md:pb-20">
      <div className="content-hub-controls">
        <label className="hub-search" aria-label="Search articles">
          <MagnifyingGlass aria-hidden="true" size={22} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
          />
        </label>
        <div className="content-tabs" aria-label="Article categories">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? "is-active" : undefined}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {visibleArticles.length ? (
        <div className="article-card-grid">
          {visibleArticles.map((article) => (
            <Link key={article.path} href={article.path} className="article-card group">
              <span className="article-card-figure">
                <Image
                  src={article.heroImage}
                  alt={article.heroAlt}
                  width={720}
                  height={450}
                  className="article-card-img"
                  priority={false}
                />
              </span>
              <span className="article-card-body">
                <span className="article-card-meta">
                  <span>{article.category}</span>
                  <span aria-hidden="true">/</span>
                  <span>{article.readingTime}</span>
                </span>
                <span className="article-card-title">{article.title}</span>
                <span className="article-card-excerpt">{article.excerpt}</span>
                <span className="article-card-tags">
                  {article.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </span>
                <span className="article-card-link">
                  Read article
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="content-empty">
          <h2>No matching article in this library yet</h2>
          <p>Try a broader search term or switch back to All.</p>
        </div>
      )}
    </section>
  );
}
