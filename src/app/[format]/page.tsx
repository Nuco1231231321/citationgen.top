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

export const dynamic = "force-static";

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
    <main className="format-page">
      <JsonLd data={generatorJsonLd(format)} />
      <Hero format={format.slug} />
      <div className="format-generator-band">
        <GeneratorClient format={format} compact examples={examplesForFormat(format.slug)} />
      </div>
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
    <section className="format-hero">
      <div className="site-shell">
        <nav aria-label="Breadcrumb" className="format-breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{format.label}</li>
          </ol>
        </nav>

        <div className="format-hero-copy">
          <span className="format-update">Updated {format.updatedYear}</span>
          <h1>{format.h1}</h1>
          <p>{format.intro}</p>
        </div>

        <ul className="format-hero-proofs" aria-label={`${format.label} generator highlights`}>
          <li>
            <strong>Free to use</strong>
            <span>No account required</span>
          </li>
          <li>
            <strong>Editable fields</strong>
            <span>Fix missing metadata before copying</span>
          </li>
          <li>
            <strong>Source labels</strong>
            <span>See where citation data came from</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

function InfoSections({ format: slug }: { format: GeneratorSlug }) {
  const format = generatorFormats[slug];
  const depth = formatDepthBySlug[slug];
  const workflow = [
    {
      title: "Paste",
      body: "Use a DOI, ISBN, URL, source title, or manual entry."
    },
    {
      title: "Check",
      body: "Review source labels, missing field warnings, and citation style output."
    },
    {
      title: "Edit",
      body: "Update fields when public metadata is incomplete."
    },
    {
      title: "Copy",
      body: "Use the full citation, in-text citation, or add it to your library."
    }
  ];

  return (
    <section className="format-guide">
      <div className="site-shell format-guide-layout">
        <aside className="format-guide-sidebar" aria-label={`${format.label} style summary`}>
          <div className="format-summary-panel">
            <span>{format.label}</span>
            <h2>{format.edition}</h2>
            <p>{format.audience}</p>
          </div>

          <div className="format-summary-list">
            <h2>Best for</h2>
            <ul>
              {format.disciplines.map((discipline) => (
                <li key={discipline}>{discipline}</li>
              ))}
            </ul>
          </div>

          <div className="format-summary-list">
            <h2>Data sources</h2>
            <p>{format.dataNote}</p>
            <div className="format-source-chips">
              <span>CrossRef</span>
              <span>Google Books</span>
              {["ama", "acs", "cse", "ieee", "vancouver"].includes(format.slug) ? (
                <span>NLM database</span>
              ) : null}
              <span>URL metadata</span>
              <span>Manual entry</span>
            </div>
          </div>

          <a
            href={format.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="format-official-link"
          >
            Official {format.label} guide
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </aside>

        <div className="format-guide-main">
          <section className="format-panel format-workflow">
            <div>
              <h2>How this {format.label} generator works</h2>
              <p>Start with the source detail you have, then check the result before copying.</p>
            </div>
            <ol>
              {workflow.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="format-rule-grid" aria-label={`${format.label} citation rules`}>
            <article>
              <h2>In-text citations</h2>
              <p>{format.inTextRule}</p>
            </article>
            <article>
              <h2>{format.label === "MLA" ? "Works Cited" : "Reference list"} format</h2>
              <p>{format.referenceRule}</p>
            </article>
          </section>

          <section className="format-review-sheet">
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
                  {depth.checks.map((check) => (
                    <li key={check}>
                      <span aria-hidden="true">Check</span>
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
          </section>

          <section className="format-panel">
            <h2>Quick {format.label} rules</h2>
            <ul className="format-note-grid">
              {format.quickRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <section className="format-panel">
            <h2>Common {format.label} mistakes</h2>
            <ul className="format-mistake-list">
              {format.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </section>

          <section className="format-panel format-faq-panel">
            <h2>Frequently asked questions</h2>
            <div>
              {format.faqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="format-panel format-related-panel">
            <h2>Related citation generators</h2>
            <div>
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
                        {related.fullName} - {related.edition}
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
          </section>
        </div>
      </div>
    </section>
  );
}
