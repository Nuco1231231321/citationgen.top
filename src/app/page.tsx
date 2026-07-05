import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Database,
  Globe,
  ListChecks,
  MagnifyingGlass,
  PencilSimpleLine,
  WarningCircle
} from "@phosphor-icons/react/dist/ssr";
import { GeneratorClient, type CitationExample } from "@/components/GeneratorClient";
import { JsonLd } from "@/components/JsonLd";
import { allGeneratorFormats, generatorFormats, generatorPath } from "@/lib/formats";
import { homeJsonLd } from "@/lib/schema";
import { absoluteUrl, siteConfig } from "@/lib/site";

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

const whyReasons = [
  {
    icon: Database,
    title: "You can see the data source",
    body: "Every result labels where the metadata came from: CrossRef, Google Books, URL metadata, NLM journal data, or manual entry."
  },
  {
    icon: WarningCircle,
    title: "Missing details are not hidden",
    body: "If a source does not expose an author, date, pages, DOI, or URL, the page warns you instead of quietly filling the gap."
  },
  {
    icon: ListChecks,
    title: "Science formats get special care",
    body: "AMA, ACS, CSE, IEEE, and Vancouver sit beside APA, MLA, Chicago, Harvard, and Turabian, with journal abbreviation support where it matters."
  },
  {
    icon: PencilSimpleLine,
    title: "You can fix the source before copying",
    body: "Authors, title, date, journal, publisher, DOI, URL, ISBN, volume, issue, and pages stay editable after lookup."
  }
];

const dataSources = [
  {
    icon: MagnifyingGlass,
    title: "Article lookup",
    body: "DOI and article title searches use CrossRef metadata when a public record is available."
  },
  {
    icon: BookOpen,
    title: "Book lookup",
    body: "ISBN and book title searches use Google Books metadata and keep fields editable."
  },
  {
    icon: Globe,
    title: "Web page lookup",
    body: "URL checks extract public page metadata, canonical links, Open Graph tags, and JSON-LD."
  },
  {
    icon: PencilSimpleLine,
    title: "Manual entry",
    body: "When a source cannot be found, you can enter fields manually and render the same citation."
  }
];

const transparencyLabels = [
  "Data from CrossRef",
  "Data from Google Books",
  "Metadata extracted from URL",
  "Abbreviation from NLM",
  "Manually entered"
];

const sourceTypeGroups = [
  {
    title: "Autofill sources",
    body: "DOI, ISBN, URL, journal title, and book title can use public metadata lookup when a record is available.",
    items: ["Journal article", "Book", "Webpage", "Video URL"]
  },
  {
    title: "Manual source types",
    body: "These open editable fields and still use the same citation generator.",
    items: [
      "Report",
      "Newspaper article",
      "Dataset",
      "Conference paper",
      "Book chapter",
      "Patent",
      "Image",
      "Blog post",
      "Dictionary entry",
      "Encyclopedia entry",
      "Thesis or dissertation",
      "Social media post"
    ]
  }
];

const userScenarios = [
  {
    title: "A chemistry paper needs ACS",
    body: "Paste the article DOI, check the CrossRef record, then confirm the NLM journal abbreviation before copying."
  },
  {
    title: "A book source needs APA",
    body: "Enter an ISBN, review title, authors, publisher, and year from Google Books, then edit any field that looks incomplete."
  },
  {
    title: "A website has thin metadata",
    body: "Paste the URL, see what the page exposes, and fill missing author or date fields manually when the source is incomplete."
  }
];

const homeFaqs = [
  {
    question: "What can I paste into the citation generator?",
    answer:
      "You can paste a DOI, ISBN, URL, article title, book title, or manual source details. The page chooses the public lookup path when possible."
  },
  {
    question: "Will the generator invent missing citation data?",
    answer:
      "No. If a public source does not provide a field, the page shows a warning and lets you edit the metadata before copying."
  },
  {
    question: "Why does the result show data source labels?",
    answer:
      "Citation quality depends on metadata quality. Labels such as CrossRef, Google Books, URL metadata, and NLM help you check where the result came from."
  },
  {
    question: "Can I use this for medical, science, and engineering formats?",
    answer:
      "Yes. The first phase includes AMA, ACS, CSE, IEEE, and Vancouver, alongside APA, MLA, Chicago, Turabian, and Harvard."
  },
  {
    question: "Can I edit a citation after lookup?",
    answer:
      "Yes. Authors, title, date, journal, publisher, DOI, URL, ISBN, volume, issue, and pages remain editable."
  }
];

export default function HomePage() {
  return (
    <main>
      <JsonLd data={homeJsonLd()} />

      <div className="home-hero-stage">
        <section className="site-shell home-hero-grid">
          <div className="hero-copy flex flex-col items-start text-left">
            <h1 className="font-editorial max-w-[18ch] text-balance text-[34px] leading-[1.12] text-ink md:text-[56px]">
              Citation generator with visible source checks
            </h1>
            <p className="mt-4 max-w-[58ch] text-pretty text-[16px] leading-7 text-dim">
              Paste a DOI, ISBN, URL, or title. Check the data trail before you copy.
            </p>
            <ul className="hero-proof-list" aria-label="CitationGen trust checks">
              <li>
                <strong>Source first</strong>
                <span>CrossRef, Google Books, URL metadata, NLM, or manual entry.</span>
              </li>
              <li>
                <strong>Warnings visible</strong>
                <span>Missing author, date, DOI, page, and journal fields stay exposed.</span>
              </li>
              <li>
                <strong>Edit before copy</strong>
                <span>Every generated citation keeps the metadata fields editable.</span>
              </li>
            </ul>
          </div>

          <figure className="home-hero-media" aria-label="Citation generator workspace">
            <Image
              src="/images/home/citation-generator-hero-desk.jpg"
              alt="Warm desk scene showing a citation generator, research books, notes, and a copy-ready citation."
              width={1800}
              height={1012}
              priority
              sizes="(max-width: 760px) calc(100vw - 28px), 520px"
              className="home-hero-image"
            />
          </figure>
        </section>

        <GeneratorClient
          format={generatorFormats.apa}
          formatOptions={allGeneratorFormats}
          compact
          examples={homeExamples}
          introLabel="Start citing"
          introText="Choose a style, paste a source, and generate a citation without leaving this page."
        />
      </div>

      {/* Why section */}
      <section className="site-shell py-12">
        <div className="grid gap-10 md:grid-cols-[0.42fr_0.58fr]">
          <div>
            <h2 className="font-editorial mt-3 text-balance text-[28px] leading-[1.2] text-ink">
              Built for citations you need to trust.
            </h2>
            <p className="mt-3 text-sm leading-6 text-dim">
              A quick draft is useful. A checked citation is better when a grade, paper, or
              submission depends on the details.
            </p>
            <div className="flex flex-wrap gap-2 mt-6" aria-label="Visible source labels">
              {transparencyLabels.map((label) => (
                <span key={label} className="rounded-full bg-subtle px-3 py-1.5 text-xs text-dim">{label}</span>
              ))}
            </div>
          </div>
          <div className="illustrated-panel">
            <div className="grid gap-1">
              {whyReasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <article key={reason.title} className="trust-item">
                    <Icon aria-hidden="true" size={20} className="mt-0.5 text-faint" />
                    <div>
                      <h3 className="font-medium text-ink">{reason.title}</h3>
                      <p className="mt-1">{reason.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell py-12">
        <div className="home-disciplines">
          <div className="scenario-copy">
            <h2 className="font-editorial text-balance text-[28px] leading-[1.2] text-ink">
              Examples that match real citation work.
            </h2>
            <p className="mt-3 text-sm leading-6 text-dim">
              These are the moments the page is designed around: lookup first, check the source,
              edit fields, then copy.
            </p>
          </div>
          <figure className="home-image-card home-disciplines-media">
            <Image
              src="/images/home/citation-disciplines.jpg"
              alt="ACS, AMA, and MLA citation examples shown across chemistry, medical, and humanities study settings."
              width={1360}
              height={752}
              sizes="(max-width: 760px) calc(100vw - 28px), 1120px"
              className="home-media-image"
            />
          </figure>
          <div className="scenario-list">
            {userScenarios.map((scenario) => (
              <article key={scenario.title}>
                <h3>{scenario.title}</h3>
                <p>{scenario.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Source types section */}
      <section className="site-shell py-12">
        <div className="rounded-3xl bg-surface p-8 md:p-10">
          <h2 className="font-editorial mt-3 text-balance text-[28px] leading-[1.2] text-ink">
            Start with lookup when possible, manual fields when needed.
          </h2>
          <div className="grid gap-4 mt-8 md:grid-cols-2">
            {sourceTypeGroups.map((group) => (
              <div key={group.title} className="rounded-2xl bg-subtle p-6">
                <h3 className="text-base font-medium text-ink">{group.title}</h3>
                <p className="mt-2 text-sm leading-6 text-dim">{group.body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-full bg-surface px-3 py-1 text-xs text-dim">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formats list */}
      <section id="formats" className="site-shell py-12">
        <div className="rounded-3xl bg-surface p-8 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
                All generators
              </h2>
              <p className="mt-2 max-w-[52ch] text-sm leading-6 text-dim">
                Browse by format here, or open the citation tools column for grouped science,
                medical, engineering, and humanities styles.
              </p>
            </div>
            <Link
              href="/tools/"
              className="hidden rounded-xl bg-subtle px-4 py-2 text-sm font-medium text-ink no-underline transition-colors hover:bg-line sm:inline-flex"
            >
              Tools column
            </Link>
          </div>
          <div className="mt-8">
            {allGeneratorFormats.map((format) => (
              <Link 
                key={format.slug} 
                href={generatorPath(format.slug)}
                className="format-link group"
              >
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
        </div>
      </section>

      {/* Data sources */}
      <section className="site-shell py-12">
        <div className="rounded-3xl bg-surface p-8 md:p-10">
          <div className="home-source-layout">
            <div>
              <h2 className="font-editorial mt-3 text-balance text-[28px] leading-[1.2] text-ink">
                The result should tell you where it came from.
              </h2>
              <p className="mt-3 max-w-[62ch] text-sm leading-6 text-dim">
                The generator checks public metadata sources, keeps the source labels visible, and
                lets you review the fields before copying.
              </p>
            </div>
            <figure className="home-flow-frame" aria-label="Citation data source flow">
              <Image
                src="/images/home/citation-data-source-flow.jpg"
                alt="Diagram showing DOI, ISBN, and URL input checked against CrossRef, Google Books, and web metadata before a citation is generated."
                width={1800}
                height={1012}
                sizes="(max-width: 760px) 820px, 1040px"
                className="home-flow-image"
              />
            </figure>
          </div>
          <div className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {dataSources.map((source) => (
              <div key={source.title} className="rounded-2xl bg-subtle p-6">
                <source.icon aria-hidden="true" size={20} className="text-faint" />
                <h3 className="mt-4 text-sm font-medium text-ink">{source.title}</h3>
                <p className="mt-2 text-sm leading-6 text-dim">{source.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real example */}
      <section className="site-shell py-12">
        <div className="max-w-[640px] mb-8">
          <h2 className="font-editorial mt-3 text-balance text-[28px] leading-[1.2] text-ink">
            Try a source that has a public record.
          </h2>
          <p className="mt-3 text-sm leading-6 text-dim">
            The example buttons above run the same lookup as your own sources. Pick one and the
            generated citation appears with editable fields, source labels, and warnings.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-[0.4fr_0.6fr]">
          <div className="rounded-3xl bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">Input</p>
            <p className="mt-3 break-all font-mono text-sm text-ink">10.1021/jacs.5b01053</p>
            <div className="mt-6 grid gap-3">
              {[
                "Click one DOI example above",
                "The page asks CrossRef for article metadata",
                "The result shows data labels and editable fields"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-dim">
                  <CheckCircle aria-hidden="true" size={16} className="shrink-0 text-faint" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">After lookup</p>
            <p className="mt-3 text-sm leading-6 text-dim">
              The result panel fills only after the source lookup succeeds. If the public record is
              incomplete, the page shows exactly which fields need your review before copying.
            </p>
            <div className="mt-6 grid gap-4 pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs text-faint">Citation</p>
                <p className="mt-1 text-sm text-ink">Generated after lookup</p>
              </div>
              <div>
                <p className="text-xs text-faint">Source</p>
                <p className="mt-1 text-sm text-ink">Shown under result</p>
              </div>
              <div>
                <p className="text-xs text-faint">Fields</p>
                <p className="mt-1 text-sm text-ink">Editable before copy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell py-12">
        <div className="faq-section">
          <div className="faq-intro">
            <h2 className="font-editorial text-balance text-[28px] leading-[1.2] text-ink">
              Questions before you cite.
            </h2>
            <p className="mt-3 text-sm leading-6 text-dim">
              Short answers for the checks users usually make before copying a citation.
            </p>
          </div>
          <div className="faq-list">
            {homeFaqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
