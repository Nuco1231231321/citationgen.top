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
    title: "Visible source trail",
    body: "See whether a result came from CrossRef, Google Books, URL metadata, NLM, or manual entry."
  },
  {
    title: "Field warnings stay near the result",
    body: "Review missing author, date, page, DOI, ISBN, and URL details before you copy."
  },
  {
    title: "Edit before you submit",
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
const providerLabels = ["CrossRef", "Google Books", "URL metadata", "NLM", "Manual entry"];
const workflowRoutes = [
  {
    title: "Lab reports and chemistry writing",
    body:
      "Start with a DOI or article title when the source came from a journal database. These workflows usually depend on clean journal metadata and visible abbreviation checks.",
    formats: ["acs", "ama", "cse"] as const,
    note: "Best fit for chemistry, life science, and lab-heavy coursework."
  },
  {
    title: "Essays, reading lists, and humanities papers",
    body:
      "If the assignment centers on books, chapters, archives, or literary criticism, open a style that keeps authorship and publication context easy to review before you copy.",
    formats: ["mla", "chicago", "turabian"] as const,
    note: "Useful for literature, history, theology, and writing seminars."
  },
  {
    title: "Research papers with websites and policy sources",
    body:
      "Use a style that handles mixed source types well when you are citing articles, websites, reports, and organization pages in the same paper.",
    formats: ["apa", "harvard", "vancouver"] as const,
    note: "A good path for social science, education, health, and policy writing."
  },
  {
    title: "Engineering, computing, and technical projects",
    body:
      "Numeric styles work well when your references come from journals, conferences, standards, manuals, and product documentation.",
    formats: ["ieee", "cse", "ama"] as const,
    note: "Common in engineering, computing, applied science, and capstone work."
  }
];

export default function HomePage() {
  const primaryFeature = featureSections[0];
  const secondaryFeatures = featureSections.slice(1);
  const PrimaryFeatureIcon = primaryFeature.icon;

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

        <section className="site-shell home-evidence-band" aria-labelledby="home-evidence-heading">
          <div className="home-evidence-copy">
            <p className="home-kicker">Why it feels safer</p>
            <h2 id="home-evidence-heading" className="font-editorial text-balance text-[30px] leading-[1.12] text-ink md:text-[44px]">
              Check the source trail before the citation leaves your screen.
            </h2>
            <p className="home-evidence-body">
              CitationGen is built for students, lab writers, and researchers who need the result
              fast, but still want to verify what is missing before they paste it into an
              assignment.
            </p>
            <div className="home-evidence-caption">
              <span>Built for papers, lab reports, literature reviews, and journal drafts.</span>
            </div>
          </div>

          <div className="home-evidence-grid">
            <article className="home-evidence-card home-evidence-card--wide">
              <div className="home-evidence-card-head">
                <Database aria-hidden="true" size={18} />
                <strong>Visible data sources</strong>
              </div>
              <p>
                Results stay legible because the source label is part of the workflow, not hidden
                in a tooltip or system log.
              </p>
              <div className="home-provider-row" aria-label="Metadata providers">
                {providerLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </article>

            {heroChecks.map((check) => (
              <article key={check.title} className="home-evidence-card">
                <div className="home-evidence-card-head">
                  <CheckCircle aria-hidden="true" size={18} />
                  <strong>{check.title}</strong>
                </div>
                <p>{check.body}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="site-shell home-style-atlas" aria-labelledby="home-style-atlas-heading">
        <div className="home-style-atlas-copy">
          <h2 id="home-style-atlas-heading" className="font-editorial text-balance text-[28px] leading-[1.14] text-ink md:text-[38px]">
            Start in the style you need most, then switch without losing the workflow.
          </h2>
          <p>
            Open the exact citation format your paper requires and keep the same lookup habit
            across APA, MLA, Chicago, AMA, ACS, and IEEE.
          </p>
        </div>
        <div className="home-style-atlas-rail" aria-label="Popular citation format shortcuts">
          {quickStyleSlugs.map((slug) => {
            const format = generatorFormats[slug];
            return (
              <Link key={slug} href={generatorPath(slug)}>
                <span>{format.label}</span>
                <small>{format.edition}</small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="site-shell home-workflow-stage py-12" aria-labelledby="home-feature-heading">
        <div className="home-section-heading">
          <h2 id="home-feature-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[46px]">
            Keep the lookup fast, but make the review step feel deliberate.
          </h2>
          <p className="mt-3 max-w-[66ch] text-pretty text-sm leading-6 text-dim">
            The page should help users move from raw source details to a checked citation without
            jumping between tools, tabs, or opaque results.
          </p>
        </div>

        <div className="home-workflow-hero">
          <FeatureVisual
            title={primaryFeature.title}
            bullets={primaryFeature.bullets}
            icon={primaryFeature.icon}
            image={primaryFeature.image}
            alt={primaryFeature.alt}
          />

          <div className="home-workflow-copy">
            <div className="home-feature-icon" aria-hidden="true">
              <PrimaryFeatureIcon size={20} />
            </div>
            <h3 className="font-editorial text-balance text-[28px] leading-[1.14] text-ink md:text-[40px]">
              {primaryFeature.title}
            </h3>
            <p className="mt-4 text-pretty text-sm leading-7 text-dim">
              {primaryFeature.body}
            </p>
            <ul className="home-feature-bullets">
              {primaryFeature.bullets.map((bullet) => (
                <li key={bullet}>
                  <CheckCircle aria-hidden="true" size={17} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="home-workflow-grid">
          {secondaryFeatures.map((section) => {
            const Icon = section.icon;
            return (
              <article key={section.title} className="home-workflow-card">
                <FeatureVisual
                  title={section.title}
                  bullets={section.bullets}
                  icon={Icon}
                  image={section.image}
                  alt={section.alt}
                  compact
                />

                <div className="home-workflow-card-copy">
                  <div className="home-feature-icon" aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-editorial text-balance text-[24px] leading-[1.14] text-ink md:text-[30px]">
                    {section.title}
                  </h3>
                  <p>{section.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="site-shell home-route-map py-12" aria-labelledby="home-route-map-heading">
        <div className="home-route-map-head">
          <div>
            <p className="home-kicker">Choose by assignment</p>
            <h2 id="home-route-map-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              If the assignment does not name a style, start from the writing context.
            </h2>
          </div>
          <p className="home-route-map-summary">
            Some users already know they need APA or IEEE. Others only know they are writing a
            lab report, a policy paper, or a book-heavy essay. This section gives both paths.
          </p>
        </div>

        <div className="home-route-map-frame">
          <div className="home-route-map-visual">
            <Image
              src="/images/home/citation-disciplines.jpg"
              alt="Research books, notes, and citation examples organized for different academic writing contexts."
              fill
              sizes="(max-width: 960px) 100vw, 38vw"
              className="home-route-map-photo"
            />
            <div className="home-route-map-scrim" aria-hidden="true" />
            <div className="home-route-map-overlay">
              <strong>Start where your assignment starts.</strong>
              <p>Journal article, lab source, website, or book chapter. Keep the review step visible either way.</p>
            </div>
          </div>

          <div className="home-route-map-grid">
            {workflowRoutes.map((route, index) => (
              <article key={route.title} className="home-route-card">
                <span className="home-route-card-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{route.title}</h3>
                <p>{route.body}</p>
                <div className="home-route-card-links" aria-label={`${route.title} citation styles`}>
                  {route.formats.map((slug) => {
                    const format = generatorFormats[slug];
                    return (
                      <Link key={slug} href={generatorPath(slug)}>
                        <span>{format.label}</span>
                        <ArrowRight aria-hidden="true" size={14} />
                      </Link>
                    );
                  })}
                </div>
                <small>{route.note}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="home-format-directory" aria-labelledby="home-format-directory-heading">
          <div className="home-format-directory-copy">
            <h3 id="home-format-directory-heading">Need a different citation style?</h3>
            <p>Browse the full generator directory without leaving the homepage.</p>
          </div>
          <div className="home-format-directory-grid">
            {allGeneratorFormats.map((format) => (
              <Link key={format.slug} href={generatorPath(format.slug)}>
                <span>{format.label}</span>
                <small>{format.fullName}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeTrustExperience />
    </main>
  );
}

function FeatureVisual({
  title,
  bullets,
  icon: Icon,
  image,
  alt,
  compact = false
}: {
  title: string;
  bullets: string[];
  icon: typeof MagnifyingGlass;
  image: string;
  alt: string;
  compact?: boolean;
}) {
  return (
    <div className={`home-feature-media home-feature-visual ${compact ? "is-compact" : ""}`}>
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
