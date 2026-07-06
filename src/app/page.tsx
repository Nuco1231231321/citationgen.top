import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Database,
  ListChecks,
  MagnifyingGlass
} from "@phosphor-icons/react/dist/ssr";
import { GeneratorClient, type CitationExample } from "@/components/GeneratorClient";
import { HomeTrustExperience } from "@/components/HomeTrustExperience";
import { JsonLd } from "@/components/JsonLd";
import { allGeneratorFormats, generatorFormats, generatorPath } from "@/lib/formats";
import { homeJsonLd } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Citation Generator With Source Checks",
  description:
    "Generate citations from DOI, ISBN, URL, title, or manual fields with source labels, editable metadata, and missing-field warnings.",
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: "Free Citation Generator With Source Checks",
    description:
      "Generate citations with real metadata lookup, editable fields, source labels, and copy-ready output.",
    url: absoluteUrl("/")
  }
};

const homeExamples: CitationExample[] = [
  {
    label: "ACS chemistry DOI",
    detail: "Live CrossRef record",
    input: "10.1021/jacs.5b01053",
    sourceType: "auto",
    formatSlug: "acs"
  },
  {
    label: "APA science DOI",
    detail: "Live CrossRef record",
    input: "10.1126/science.169.3946.635",
    sourceType: "auto",
    formatSlug: "apa"
  },
  {
    label: "MLA journal DOI",
    detail: "Live CrossRef record",
    input: "10.1126/science.169.3946.635",
    sourceType: "auto",
    formatSlug: "mla"
  }
];

const heroChecks = [
  {
    title: "Source labels",
    body: "See whether a result came from CrossRef, Google Books, URL metadata, NLM, or manual entry."
  },
  {
    title: "Missing-field warnings",
    body: "Review missing author, date, page, DOI, ISBN, and URL details before you copy."
  },
  {
    title: "Editable metadata",
    body: "Correct source details, regenerate the citation, then copy it or save it to your library."
  }
];

const featureSections = [
  {
    eyebrow: "Start with any source",
    title: "Paste the source you already have.",
    body:
      "Start with a DOI, ISBN, URL, title, or rough source note. CitationGen searches public metadata first, then keeps the result editable.",
    image: "/images/home/citation-generator-hero-desk.jpg",
    alt: "Warm study desk with a citation generator interface, research notes, books, and copy-ready citation output.",
    icon: MagnifyingGlass,
    bullets: ["DOI, ISBN, URL, or title input", "APA, MLA, Chicago, AMA, ACS, IEEE, and more", "Examples that run the same lookup flow"],
    reverse: false
  },
  {
    eyebrow: "Check source data",
    title: "Show where the citation data came from.",
    body:
      "Check the source label under each result so you know whether the metadata came from CrossRef, Google Books, URL metadata, NLM, or manual entry.",
    image: "/images/home/citation-data-source-flow.jpg",
    alt: "Citation data source flow showing DOI, ISBN, and URL lookup through CrossRef, Google Books, URL metadata, and editable fields.",
    icon: Database,
    bullets: ["CrossRef and Google Books lookup", "URL metadata and canonical links", "NLM support for journal abbreviation workflows"],
    reverse: true
  },
  {
    eyebrow: "Review and copy",
    title: "Make the last step feel controlled.",
    body:
      "Review warnings, edit incomplete fields, and copy the final citation only after the source details match your assignment or journal requirements.",
    image: "/images/home/citation-disciplines.jpg",
    alt: "Academic citation examples arranged for chemistry, medical, engineering, and humanities writing contexts.",
    icon: ListChecks,
    bullets: ["Warnings stay near the result", "Fields remain editable after lookup", "Reference library supports repeated citation work"],
    reverse: false
  }
];

const quickStyleSlugs = ["apa", "mla", "chicago", "ama", "acs", "ieee"] as const;

export default function HomePage() {
  return (
    <main className="citationgen-page">
      <JsonLd data={homeJsonLd()} />

      <section className="home-hero-scribbr" aria-labelledby="home-hero-heading">
        <div className="site-shell home-hero-center">
          <h1 id="home-hero-heading" className="home-hero-title">
            Generate citations you can check before you trust.
          </h1>
          <p className="home-hero-subtitle">
            Paste a DOI, ISBN, URL, or title. CitationGen looks up public metadata, shows the
            source trail, flags missing fields, and keeps every result editable before you copy.
          </p>
        </div>

        <GeneratorClient
          format={generatorFormats.apa}
          formatOptions={allGeneratorFormats}
          compact
          examples={homeExamples}
          introLabel="Start citing"
          introText="Choose a style, paste a source, and generate a citation without leaving this page."
        />

        <div className="site-shell home-review-row" aria-label="CitationGen trust checks">
          <div className="review-summary-card">
            <strong>Source checks</strong>
            <StarBoxes />
            <span>Check source labels, warnings, and editable fields before you copy.</span>
          </div>
          {heroChecks.map((check) => (
            <article key={check.title} className="review-proof-card">
              <StarBoxes compact />
              <strong>{check.title}</strong>
              <p>{check.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="site-shell quick-format-strip citation-style-strip" aria-label="Popular citation format shortcuts">
          <span>Popular styles</span>
          <div>
            {quickStyleSlugs.map((slug) => {
              const format = generatorFormats[slug];
              return (
                <Link key={slug} href={generatorPath(slug)}>
                  {format.label}
                </Link>
              );
            })}
          </div>
      </div>

      <section className="site-shell home-feature-stack py-12" aria-labelledby="home-feature-heading">
        <div className="home-section-heading">
          <p className="home-kicker">Source checks</p>
          <h2 id="home-feature-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[46px]">
            See the citation data before you copy.
          </h2>
          <p className="mt-3 max-w-[66ch] text-pretty text-sm leading-6 text-dim">
            Generate references quickly, then inspect the metadata source, missing-field warnings,
            and editable details in the same workflow.
          </p>
        </div>

        <div className="home-feature-list">
          {featureSections.map((section) => {
            const Icon = section.icon;
            return (
              <article
                key={section.title}
                className={`home-feature-row ${section.reverse ? "is-reverse" : ""}`}
              >
                <FeatureVisual
                  title={section.title}
                  bullets={section.bullets}
                  icon={Icon}
                  image={section.image}
                  alt={section.alt}
                />

                <div className="home-feature-copy">
                  <div className="home-feature-icon" aria-hidden="true">
                    <Icon size={20} />
                  </div>
                  <p className="home-kicker">{section.eyebrow}</p>
                  <h3 className="font-editorial text-balance text-[28px] leading-[1.14] text-ink md:text-[38px]">
                    {section.title}
                  </h3>
                  <p className="mt-4 text-pretty text-sm leading-7 text-dim">
                    {section.body}
                  </p>
                  <ul className="home-feature-bullets">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>
                        <CheckCircle aria-hidden="true" size={17} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="site-shell home-style-panel py-12" aria-labelledby="home-style-heading">
        <div>
          <p className="home-kicker">Citation formats</p>
          <h2 id="home-style-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
            Open the exact style your paper requires.
          </h2>
          <p className="mt-3 max-w-[58ch] text-pretty text-sm leading-6 text-dim">
            Choose APA, MLA, Chicago, AMA, ACS, IEEE, and other common academic formats for
            papers, lab reports, journal articles, and coursework.
          </p>
        </div>
        <div className="home-style-grid">
          {allGeneratorFormats.map((format) => (
            <Link key={format.slug} href={generatorPath(format.slug)} className="format-link group">
              <span className="format-code">{format.label}</span>
              <span className="format-copy">
                <span className="block text-sm font-medium text-ink">
                  {format.label} Citation Generator
                </span>
                <span className="block text-xs text-faint mt-0.5">
                  {format.fullName} · {format.edition}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                size={18}
                className="text-faint group-hover:text-ink transition-colors"
              />
            </Link>
          ))}
        </div>
      </section>

      <HomeTrustExperience />
    </main>
  );
}

function StarBoxes({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "review-stars is-compact" : "review-stars"} aria-label="Five check marks">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

function FeatureVisual({
  title,
  bullets,
  icon: Icon,
  image,
  alt
}: {
  title: string;
  bullets: string[];
  icon: typeof MagnifyingGlass;
  image: string;
  alt: string;
}) {
  return (
    <div className="home-feature-media home-feature-visual">
      <Image src={image} alt={alt} fill sizes="(max-width: 1100px) 100vw, 46vw" className="home-feature-photo" />
      <div className="home-feature-visual-scrim" aria-hidden="true" />
      <div className="home-feature-glass">
        <div className="feature-diagram-icon" aria-hidden="true">
          <Icon size={24} />
        </div>
        <strong>{title}</strong>
      </div>
      <div className="feature-scan-line" aria-hidden="true" />
      <div className="feature-diagram-list" aria-label={`${title} highlights`}>
        {bullets.map((bullet) => (
          <span key={bullet}>{bullet}</span>
        ))}
      </div>
    </div>
  );
}
