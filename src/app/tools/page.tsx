import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flask, Wrench, BookOpenText, FileText } from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/JsonLd";
import { toolClusters, formatLinks } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Citation Generators: APA, MLA, Chicago & More",
  description:
    "Generate APA, MLA, Chicago, ACS, AMA, IEEE, Vancouver, CSE, Turabian, and Harvard citations with source labels and editable fields.",
  alternates: {
    canonical: absoluteUrl("/tools/")
  },
  openGraph: {
    title: "Citation Generators: APA, MLA, Chicago & More",
    description:
      "Generate citations in 10 styles with metadata source checks and editable fields.",
    url: absoluteUrl("/tools/")
  }
};

const clusterIcons: Record<string, typeof Flask> = {
  "Science and medical": Flask,
  "Engineering": Wrench,
  "Humanities": BookOpenText,
  "Common author-date styles": FileText
};

export default function ToolsPage() {
  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Free Citation Generators",
          description: "10 free citation generators with source labels and editable fields.",
          url: absoluteUrl("/tools/")
        }}
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
            <li className="font-medium text-ink">Citation tools</li>
          </ol>
        </nav>
        <div className="max-w-[780px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Citation tools</p>
          <h1 className="font-editorial mt-3 text-balance text-[34px] leading-[1.12] text-ink md:text-[48px]">
            Free citation generators
          </h1>
          <p className="mt-4 max-w-[64ch] text-pretty text-[16px] leading-7 text-dim">
            Choose a format, paste a source, and get a citation with source labels and editable
            fields. All tools are free and require no registration.
          </p>
        </div>
      </section>

      {toolClusters.map((cluster) => {
        const generators = formatLinks(cluster.slugs);
        const Icon = clusterIcons[cluster.title] ?? FileText;
        return (
          <section key={cluster.title} className="site-shell py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-subtle text-ink">
                <Icon aria-hidden="true" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-ink">{cluster.title}</h2>
                <p className="text-sm text-dim">{cluster.description}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {generators.map((format) => (
                <Link
                  key={format.slug}
                  href={format.href}
                  className="format-link group"
                >
                  <span className="format-code">{format.label}</span>
                  <span className="format-copy">
                    <span className="block text-sm font-semibold text-ink">
                      {format.label} Citation Generator
                    </span>
                    <span className="block text-xs text-dim mt-1">{format.edition}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    size={16}
                    className="text-faint group-hover:text-ink transition-colors"
                  />
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
