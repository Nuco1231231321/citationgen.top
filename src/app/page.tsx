import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Database,
  ListChecks,
  MagnifyingGlass,
  PencilSimpleLine,
  WarningCircle
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
    body: "CrossRef, Google Books, URL metadata, NLM, or manual entry stays visible."
  },
  {
    title: "Missing-field warnings",
    body: "Author, date, page, DOI, ISBN, and URL gaps are shown before you copy."
  },
  {
    title: "Editable metadata",
    body: "Fix source details, regenerate, then copy the citation or save it to your library."
  }
];

const featureSections = [
  {
    eyebrow: "01 · Fast start",
    title: "Paste the source you already have.",
    body:
      "Students and researchers usually arrive with a DOI, ISBN, URL, title, or a messy source note. The homepage keeps the generator above the fold so the first useful action is obvious.",
    image: "/images/home/citation-generator-hero-desk.jpg",
    alt: "Warm study desk with a citation generator interface, research notes, books, and copy-ready citation output.",
    icon: MagnifyingGlass,
    bullets: ["DOI, ISBN, URL, or title input", "APA, MLA, Chicago, AMA, ACS, IEEE, and more", "Examples that run the same lookup flow"],
    reverse: false
  },
  {
    eyebrow: "02 · Visible evidence",
    title: "Show where the citation data came from.",
    body:
      "Trust comes from traceability. CitationGen should not feel like a black box: it labels metadata providers and keeps incomplete public records visible instead of hiding the problem.",
    image: "/images/home/citation-data-source-flow.jpg",
    alt: "Citation data source flow showing DOI, ISBN, and URL lookup through CrossRef, Google Books, URL metadata, and editable fields.",
    icon: Database,
    bullets: ["CrossRef and Google Books lookup", "URL metadata and canonical links", "NLM support for journal abbreviation workflows"],
    reverse: true
  },
  {
    eyebrow: "03 · Review before copy",
    title: "Make the last step feel controlled.",
    body:
      "The audience is careful: students, academic writers, lab report authors, medical coursework users, and technical researchers. The interface needs to make correction and copying feel calm, not rushed.",
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
    <main>
      <JsonLd data={homeJsonLd()} />

      <section className="site-shell home-hero-simple" aria-labelledby="home-hero-heading">
        <p className="home-kicker">Free citation generator</p>
        <h1 id="home-hero-heading" className="font-editorial text-balance text-[40px] leading-[1.08] text-ink md:text-[68px]">
          Generate citations you can check before you trust.
        </h1>
        <p className="mt-5 max-w-[66ch] text-pretty text-[17px] leading-8 text-dim md:text-[19px]">
          Paste a DOI, ISBN, URL, or title. CitationGen looks up public metadata, shows the
          source trail, flags missing fields, and keeps every result editable before you copy.
        </p>
        <div className="hero-action-row">
          <a href="#generator" className="btn inline-flex">
            Start citing
          </a>
          <Link href="/tools/" className="action-secondary">
            Browse citation tools
          </Link>
        </div>
        <ul className="hero-proof-list" aria-label="CitationGen trust checks">
          {heroChecks.map((check) => (
            <li key={check.title}>
              <strong>{check.title}</strong>
              <span>{check.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-generator-stage" aria-labelledby="home-generator-heading">
        <div className="site-shell home-generator-heading">
          <p className="home-kicker">Main function</p>
          <h2 id="home-generator-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[44px]">
            The fastest path is still the most important path.
          </h2>
          <p className="mt-3 max-w-[62ch] text-pretty text-sm leading-6 text-dim">
            The page should answer one question immediately: can I generate a usable citation
            right now and verify the fields before submitting it?
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

        <div className="site-shell quick-format-strip" aria-label="Popular citation format shortcuts">
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
      </section>

      <section className="site-shell home-feature-stack py-12" aria-labelledby="home-feature-heading">
        <div className="home-section-heading">
          <p className="home-kicker">How it earns trust</p>
          <h2 id="home-feature-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[46px]">
            A citation tool should be fast, but never opaque.
          </h2>
          <p className="mt-3 max-w-[66ch] text-pretty text-sm leading-6 text-dim">
            The visual rhythm is warmer and more editorial, but the product logic stays practical:
            input, lookup, warning, edit, copy.
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
                <figure className="home-feature-media">
                  <Image
                    src={section.image}
                    alt={section.alt}
                    width={1800}
                    height={1012}
                    sizes="(max-width: 760px) calc(100vw - 28px), 520px"
                    className="home-feature-image"
                  />
                </figure>

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
            Format pages stay available for search users, while the homepage keeps the core
            generator close enough for quick use.
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
