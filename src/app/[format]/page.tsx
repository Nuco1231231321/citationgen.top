import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { GeneratorClient, type CitationExample } from "@/components/GeneratorClient";
import { JsonLd } from "@/components/JsonLd";
import {
  generatorPath,
  generatorFormats,
  generatorRouteSegment,
  generatorSlugs,
  parseGeneratorRoute,
  type GeneratorSlug
} from "@/lib/formats";
import { generatorJsonLd } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

type GeneratorPageProps = {
  params: Promise<{ format: string }>;
};

type FormatDepth = {
  title: string;
  intro: string;
  checks: string[];
  sourceExamples: Array<{
    source: string;
    userTask: string;
    review: string;
  }>;
};

const formatDepthBySlug: Record<GeneratorSlug, FormatDepth> = {
  ama: {
    title: "AMA checks for medical references",
    intro:
      "AMA citations are usually reviewed for numbered order, NLM journal abbreviations, and complete article details.",
    checks: [
      "Confirm the reference number matches first citation order.",
      "Check journal abbreviations against NLM when available.",
      "Review volume, issue, page range, DOI, and publication year before copying."
    ],
    sourceExamples: [
      { source: "Journal article", userTask: "Cite a biomedical DOI", review: "NLM title, DOI, volume, issue, pages" },
      { source: "Medical website", userTask: "Cite a health information page", review: "Organization author, date, access date" },
      { source: "Book chapter", userTask: "Cite a clinical handbook section", review: "Editors, chapter title, edition, publisher" }
    ]
  },
  acs: {
    title: "ACS checks for chemistry sources",
    intro:
      "ACS references are sensitive to author punctuation, abbreviated journal titles, DOI presence, and page ranges.",
    checks: [
      "Use semicolons between authors where the style requires them.",
      "Prefer NLM journal abbreviations, then apply ACS punctuation carefully.",
      "Keep DOI values for journal articles when CrossRef provides them."
    ],
    sourceExamples: [
      { source: "Chemistry article", userTask: "Cite a DOI from a journal", review: "Abbreviated journal title, year, volume, pages, DOI" },
      { source: "Lab manual", userTask: "Enter source details manually", review: "Institution, title, version, year" },
      { source: "Book", userTask: "Look up an ISBN", review: "Authors, title, publisher, edition, year" }
    ]
  },
  cse: {
    title: "CSE checks for science writing",
    intro:
      "CSE has more than one system, so the first check is whether your course expects author-date or citation-sequence.",
    checks: [
      "Confirm whether your instructor wants author-date or citation-sequence.",
      "Keep scientific names and subtitles exactly as the source presents them.",
      "Review article title, journal title, year, volume, issue, and pages."
    ],
    sourceExamples: [
      { source: "Biology article", userTask: "Cite a DOI", review: "Author-date output, journal details, DOI" },
      { source: "Dataset", userTask: "Enter source details manually", review: "Creator, title, repository, access date" },
      { source: "Website", userTask: "Cite an ecology resource", review: "Organization author, date, URL" }
    ]
  },
  ieee: {
    title: "IEEE checks for engineering citations",
    intro:
      "IEEE uses numbered citations, so source order and conference details are just as important as article metadata.",
    checks: [
      "Use bracketed numbers in the order sources appear.",
      "Review conference name, publisher, page range, year, and DOI.",
      "Do not switch to author-date wording in the text."
    ],
    sourceExamples: [
      { source: "Conference paper", userTask: "Cite an ACM or IEEE DOI", review: "Conference title, pages, publisher, DOI" },
      { source: "Journal article", userTask: "Cite an engineering article", review: "Article title, abbreviated venue, volume, issue" },
      { source: "Technical website", userTask: "Cite online documentation", review: "Page title, site name, date, URL" }
    ]
  },
  turabian: {
    title: "Turabian checks for student papers",
    intro:
      "Turabian notes-bibliography work depends on footnotes, shortened notes, and a bibliography that matches student-paper requirements.",
    checks: [
      "Confirm your assignment asks for notes-bibliography, not author-date.",
      "Use full details in the first note and shortened form later.",
      "Check book publisher place, edition, and page numbers when your instructor requires them."
    ],
    sourceExamples: [
      { source: "Book", userTask: "Cite a history monograph", review: "Author, title, publisher place, publisher, year" },
      { source: "Journal article", userTask: "Cite a DOI in a footnote", review: "First note, shortened note, bibliography entry" },
      { source: "Primary source website", userTask: "Cite an archive page", review: "Collection, page title, URL, access date" }
    ]
  },
  chicago: {
    title: "Chicago checks for author-date and notes",
    intro:
      "Chicago has two common systems. The page can generate author-date output, while the version selector supports notes and bibliography.",
    checks: [
      "Choose author-date or notes and bibliography before copying.",
      "Check access dates for web pages that can change.",
      "Review whether your publisher or instructor expects Chicago 18 details."
    ],
    sourceExamples: [
      { source: "Book", userTask: "Cite a humanities source", review: "Publisher, place, edition, year" },
      { source: "Journal article", userTask: "Cite a DOI", review: "Author-date reference and DOI URL" },
      { source: "Website", userTask: "Cite a public page", review: "Author, page title, site name, date, URL" }
    ]
  },
  mla: {
    title: "MLA checks for Works Cited entries",
    intro:
      "MLA focuses on containers, authors, titles, and location. The Works Cited entry often changes when a source sits inside a larger container.",
    checks: [
      "Check the container title for journals, websites, databases, and platforms.",
      "Use author-page in-text citations when page numbers are available.",
      "If no author is present, verify whether the title should lead the entry."
    ],
    sourceExamples: [
      { source: "Journal article", userTask: "Cite an article from a database", review: "Article title, journal container, volume, issue, pages" },
      { source: "Website", userTask: "Cite a web page", review: "Page title, site name, publisher, URL, access date" },
      { source: "Video", userTask: "Cite a video source", review: "Creator, title, platform, upload date, URL" }
    ]
  },
  vancouver: {
    title: "Vancouver checks for medical journals",
    intro:
      "Vancouver references are numeric and compact, with strong emphasis on NLM journal abbreviations and author initials.",
    checks: [
      "Number references by first appearance.",
      "Use NLM journal abbreviations when available.",
      "Review author limits, initials, volume, issue, page range, and DOI."
    ],
    sourceExamples: [
      { source: "Clinical article", userTask: "Cite a medical DOI", review: "NLM title, author initials, pages, DOI" },
      { source: "Book", userTask: "Cite a medical textbook", review: "Edition, place, publisher, year" },
      { source: "Guideline page", userTask: "Cite an organization website", review: "Organization author, date, access date" }
    ]
  },
  harvard: {
    title: "Harvard checks for local variants",
    intro:
      "Harvard is a style family rather than one universal manual, so you should compare the output with your university's local rules.",
    checks: [
      "Confirm whether your institution follows Cite Them Right or another Harvard variant.",
      "Add page numbers for direct quotations when required.",
      "Review publisher place and edition for books."
    ],
    sourceExamples: [
      { source: "Book", userTask: "Cite a course text", review: "Author, year, title, edition, publisher" },
      { source: "Website", userTask: "Cite a public page", review: "Author, year, title, URL, access date" },
      { source: "Report", userTask: "Enter fields manually", review: "Organization, report title, publication year" }
    ]
  },
  apa: {
    title: "APA checks for author-date references",
    intro:
      "APA 7 is strict about author names, dates, sentence case titles, DOI URLs, and how missing information is handled.",
    checks: [
      "Use DOI URLs when a DOI is available.",
      "Check title case for journals and sentence case for article titles.",
      "For missing dates, review whether n.d. is appropriate."
    ],
    sourceExamples: [
      { source: "Journal article", userTask: "Cite a psychology DOI", review: "Authors, year, article title, journal title, DOI URL" },
      { source: "Website", userTask: "Cite a page with no author", review: "Title position, date, site name, URL" },
      { source: "Book", userTask: "Look up an ISBN", review: "Authors, year, title, publisher, DOI or URL" }
    ]
  }
};

export function generateStaticParams() {
  return generatorSlugs.map((format) => ({ format: generatorRouteSegment(format) }));
}

export async function generateMetadata({ params }: GeneratorPageProps): Promise<Metadata> {
  const { format: rawFormat } = await params;
  const slug = parseGeneratorRoute(rawFormat);
  if (!slug) return {};
  const format = generatorFormats[slug];
  const canonical = absoluteUrl(generatorPath(format.slug));

  return {
    title: format.title,
    description: format.description,
    alternates: {
      canonical
    },
    openGraph: {
      title: format.title,
      description: format.description,
      url: canonical,
      type: "website"
    },
    twitter: {
      card: "summary",
      title: format.title,
      description: format.description
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function GeneratorPage({ params }: GeneratorPageProps) {
  const { format: rawFormat } = await params;
  const slug = parseGeneratorRoute(rawFormat);
  if (!slug) notFound();

  const format = generatorFormats[slug];

  return (
    <main>
      <JsonLd data={generatorJsonLd(format)} />
      <Hero format={format.slug} />
      <GeneratorClient format={format} compact examples={examplesForFormat(format.slug)} />
      <InfoSections format={format.slug} />
    </main>
  );
}

function examplesForFormat(slug: GeneratorSlug): CitationExample[] {
  const format = generatorFormats[slug];
  return [
    {
      label: `${format.label} chemistry DOI`,
      detail: "Live CrossRef record",
      input: "10.1021/jacs.5b01053",
      sourceType: "auto",
      formatSlug: slug
    },
    {
      label: `${format.label} science DOI`,
      detail: "Live CrossRef record",
      input: "10.1126/science.169.3946.635",
      sourceType: "auto",
      formatSlug: slug
    },
    {
      label: `${format.label} software DOI`,
      detail: "Live CrossRef record",
      input: "10.1145/3377811.3380330",
      sourceType: "auto",
      formatSlug: slug
    }
  ];
}

function Hero({ format: slug }: { format: GeneratorSlug }) {
  const format = generatorFormats[slug];
  return (
    <section className="site-shell pb-0 pt-8 md:pt-10">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-dim">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-faint">/</li>
          <li className="text-ink font-medium">{format.label}</li>
        </ol>
      </nav>

      <div className="max-w-[720px]">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            Updated {format.updatedYear}
          </span>
        </div>
        <h1 className="font-editorial text-balance text-[32px] leading-[1.15] text-ink md:text-[40px]">
          {format.h1}
        </h1>
        <p className="mt-4 max-w-[62ch] text-pretty text-[15px] leading-7 text-dim">
          {format.intro}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {format.disciplines.map((d) => (
            <span key={d} className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-dim">
              {d}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoSections({ format: slug }: { format: GeneratorSlug }) {
  const format = generatorFormats[slug];
  const depth = formatDepthBySlug[slug];
  return (
    <>
      {/* How it works */}
      <section className="site-shell py-12">
        <div className="grid gap-8 md:grid-cols-[0.38fr_0.62fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">How it works</p>
            <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
              How this {format.label} generator works
            </h2>
            <p className="mt-4 max-w-[52ch] text-pretty text-sm leading-6 text-dim">
              {format.dataNote}
            </p>
            <p className="mt-3 max-w-[52ch] text-pretty text-sm leading-6 text-dim">
              {format.audience}
            </p>
          </div>
          <ol className="rounded-3xl bg-surface p-6 md:p-8">
            {[
              "Paste a DOI, ISBN, URL, or source title.",
              "Review the metadata source label and any missing field warnings.",
              "Edit source fields if the free lookup missed something.",
              "Copy the full citation or in-text citation."
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-4 py-4 text-sm text-dim border-b border-line/50 last:border-b-0"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-page">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Citation rules */}
      <section className="site-shell py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-surface p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">Citation rules</p>
            <h2 className="font-editorial mt-3 text-[24px] leading-[1.2] text-ink">
              In-text citations
            </h2>
            <p className="mt-4 max-w-[52ch] text-pretty text-sm leading-6 text-dim">
              {format.inTextRule}
            </p>
          </div>
          <div className="rounded-3xl bg-surface p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-faint">Reference list</p>
            <h2 className="font-editorial mt-3 text-[24px] leading-[1.2] text-ink">
              {format.label === "MLA" ? "Works Cited" : "Reference list"} format
            </h2>
            <p className="mt-4 max-w-[52ch] text-pretty text-sm leading-6 text-dim">
              {format.referenceRule}
            </p>
          </div>
        </div>
      </section>

      {/* Format-specific checks */}
      <section className="site-shell py-12">
        <div className="format-review-sheet">
          <div className="format-review-header">
            <div className="format-review-mark" aria-hidden="true">
              {format.label}
            </div>
            <div>
              <p className="format-review-kicker">{format.label} review sheet</p>
              <h2 className="font-editorial text-balance text-[26px] leading-[1.16] text-ink md:text-[32px]">
                {depth.title}
              </h2>
              <p className="mt-3 max-w-[62ch] text-pretty text-sm leading-6 text-dim">
                {depth.intro}
              </p>
            </div>
          </div>

          <div className="format-review-body">
            <div className="format-review-checks">
              <h3>Before you copy</h3>
              <ol>
                {depth.checks.map((check, index) => (
                  <li key={check}>
                    <span className="tabular-nums" aria-hidden="true">
                      {index + 1}
                    </span>
                    <p>{check}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="format-source-review">
              <div className="format-source-heading">
                <h3>Source examples to review</h3>
                <p>Match the source type, then check the fields that usually cause mistakes.</p>
              </div>
              <ul aria-label={`${format.label} source examples and review fields`}>
                {depth.sourceExamples.map((example) => (
                  <li key={`${example.source}-${example.userTask}`}>
                    <div>
                      <h4>{example.source}</h4>
                      <p>{example.userTask}</p>
                    </div>
                    <dl>
                      <dt>Check</dt>
                      <dd>{example.review}</dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick rules */}
      <section className="site-shell py-12">
        <div className="rounded-3xl bg-surface p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Style notes</p>
          <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
            Quick {format.label} rules
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {format.quickRules.map((rule) => (
              <li key={rule} className="rounded-2xl bg-subtle p-5 text-sm leading-6 text-dim">
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Common mistakes */}
      <section className="site-shell py-12">
        <div className="max-w-[640px] mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Avoid errors</p>
          <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
            Common {format.label} mistakes
          </h2>
        </div>
        <div className="rounded-3xl bg-surface p-6 md:p-8">
          {format.commonMistakes.map((mistake, index) => (
            <div key={mistake} className="flex items-start gap-4 py-5 border-b border-line/50 last:border-b-0">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-dim">{mistake}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Official guide */}
      <section className="site-shell py-12">
        <div className="rounded-3xl bg-surface p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[0.4fr_0.6fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-faint">Learn more</p>
              <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
                Official {format.label} style guide
              </h2>
              <p className="mt-4 max-w-[48ch] text-pretty text-sm leading-6 text-dim">
                This generator applies {format.edition} rules. For full formatting requirements
                and examples, consult the official style manual.
              </p>
              <a
                href={format.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-page text-sm font-semibold hover:bg-[#2a2a25] transition-colors"
              >
                Visit official guide
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </div>
            <div className="hidden md:block">
              <div className="rounded-2xl bg-subtle flex h-full min-h-[160px] items-center justify-center">
                <ArrowRight
                  aria-hidden="true"
                  size={24}
                  className="text-faint"
                  style={{ transform: "rotate(-45deg)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="site-shell py-12">
        <div className="rounded-3xl bg-surface p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Why trust this</p>
          <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
            Data sources
          </h2>
          <p className="mt-4 max-w-[64ch] text-pretty text-sm leading-6 text-dim">
            The {format.label} citation output is built from real metadata sources, not invented
            data. Each result labels where the information came from:
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="rounded-full bg-subtle px-3.5 py-1.5 text-xs font-medium text-dim">CrossRef</span>
            <span className="rounded-full bg-subtle px-3.5 py-1.5 text-xs font-medium text-dim">Google Books</span>
            {["ama", "acs", "cse", "ieee", "vancouver"].includes(format.slug) ? (
              <span className="rounded-full bg-subtle px-3.5 py-1.5 text-xs font-medium text-dim">NLM database</span>
            ) : null}
            <span className="rounded-full bg-subtle px-3.5 py-1.5 text-xs font-medium text-dim">URL metadata</span>
            <span className="rounded-full bg-subtle px-3.5 py-1.5 text-xs font-medium text-dim">Manual entry</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="site-shell py-12">
        <div className="max-w-[640px] mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Questions</p>
          <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
            Frequently asked questions
          </h2>
        </div>
        <div className="rounded-3xl bg-surface p-6 md:p-8">
          {format.faqs.map((faq) => (
            <article key={faq.question} className="py-5 border-b border-line/50 last:border-b-0">
              <h3 className="text-base font-medium text-ink">{faq.question}</h3>
              <p className="mt-2 max-w-[74ch] text-pretty text-sm leading-6 text-dim">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Related formats */}
      <section className="site-shell py-12">
        <div className="rounded-3xl bg-surface p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">More formats</p>
          <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
            Related citation generators
          </h2>
          <div className="mt-6">
            {format.related.map((relatedSlug) => {
              const related = generatorFormats[relatedSlug];
              return (
                <Link
                  key={related.slug}
                  href={generatorPath(related.slug)}
                  className="format-link group"
                >
                  <span className="format-code">{related.label}</span>
                  <span className="format-copy">
                    <span className="block text-sm font-medium text-ink">
                      {related.label} Citation Generator
                    </span>
                    <span className="block text-xs text-faint mt-0.5">
                      {related.fullName} · {related.edition}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    className="text-faint group-hover:text-ink transition-colors"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
