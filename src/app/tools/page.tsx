import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Database,
  FileText,
  Flask,
  ListChecks,
  MagnifyingGlass,
  PencilSimpleLine,
  WarningCircle,
  Wrench
} from "@phosphor-icons/react/dist/ssr";
import { JsonLd } from "@/components/JsonLd";
import { toolClusters, formatLinks } from "@/lib/navigation";
import type { GeneratorFormat, GeneratorSlug } from "@/lib/formats";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Citation Generators: APA, MLA, Chicago & More",
  description:
    "Choose the right APA, MLA, Chicago, ACS, AMA, IEEE, Vancouver, CSE, Turabian, or Harvard citation generator with source labels, missing-field warnings, and editable fields.",
  alternates: {
    canonical: absoluteUrl("/tools/")
  },
  openGraph: {
    title: "Citation Generators: APA, MLA, Chicago & More",
    description:
      "Choose a citation style by writing context, then generate citations with source checks and editable fields.",
    url: absoluteUrl("/tools/")
  }
};

const clusterIcons: Record<string, typeof Flask> = {
  "Science and medical": Flask,
  "Engineering": Wrench,
  "Humanities": BookOpenText,
  "Common author-date styles": FileText
};

const clusterCopy: Record<string, { title: string; description: string }> = {
  "Science and medical": {
    title: "Science and medical writing",
    description: "For journal articles, lab reports, medical coursework, DOI checks, and NLM journal abbreviation workflows."
  },
  Engineering: {
    title: "Engineering and computer science",
    description: "For numbered citations, conference papers, technical reports, and engineering coursework."
  },
  Humanities: {
    title: "Humanities and student papers",
    description: "For Works Cited pages, notes, bibliographies, and sources where container details matter."
  },
  "Common author-date styles": {
    title: "Common author-date styles",
    description: "For social science, education, business, and international assignments that use author-date references."
  }
};

const quickStyles = formatLinks(["apa", "mla", "chicago", "acs", "ama", "ieee"]);

const citationModeLabels: Record<GeneratorFormat["citationMode"], string> = {
  "author-date": "Author-date",
  numeric: "Numeric",
  note: "Notes"
};

const formatUseCases: Record<GeneratorSlug, string> = {
  ama: "Common in medicine, nursing, public health, and biomedical writing.",
  acs: "Common in chemistry, materials science, lab reports, and journal articles.",
  cse: "Common in biology, ecology, environmental science, and science writing courses.",
  ieee: "Common in engineering, computer science, conference papers, and technical documentation.",
  turabian: "Common in history, humanities coursework, and student-paper note systems.",
  chicago: "Common in humanities, publishing, and papers that use author-date or notes.",
  mla: "Common in literature, language, writing courses, and Works Cited pages.",
  vancouver: "Common in medical journals, clinical sources, and compact numeric references.",
  harvard: "Common in social science, business, education, and international university assignments.",
  apa: "Common in psychology, education, social science, and author-date research papers."
};

const trustChecks = [
  {
    title: "Source labels",
    body: "CrossRef, Google Books, URL metadata, NLM, or manual entry stays visible beside the result.",
    icon: Database
  },
  {
    title: "Missing-field warnings",
    body: "Author, date, page, DOI, ISBN, or URL gaps are shown before you copy the citation.",
    icon: WarningCircle
  },
  {
    title: "Editable metadata",
    body: "Fix title, author, date, volume, issue, page, URL, or DOI fields before regenerating.",
    icon: PencilSimpleLine
  },
  {
    title: "No signup required",
    body: "Core generation, manual entry, editing, and copying are available for quick coursework and research tasks.",
    icon: ListChecks
  }
];

const workflowSteps = [
  "Choose a style",
  "Paste a DOI, ISBN, URL, or title",
  "Review source labels and warnings",
  "Edit, regenerate, and copy"
];

const toolFaqs = [
  {
    question: "Which citation generator should I choose?",
    answer:
      "Start with the format named in your assignment, journal, or style guide. If the requirement is unclear, APA is common in social science and education, MLA in literature and writing courses, Chicago or Turabian in humanities, AMA or Vancouver in medical writing, ACS in chemistry, and IEEE in engineering or computer science."
  },
  {
    question: "Do these tools invent missing citation data?",
    answer:
      "No. The tools use public metadata sources when available. If author, date, page, DOI, or other important fields are missing, the page shows a warning so you can confirm or add the details manually."
  },
  {
    question: "Can I edit a citation after lookup?",
    answer:
      "Yes. Each generator keeps the citation fields editable, so you can fix title casing, author order, publication date, volume, issue, pages, URL, or DOI before copying."
  },
  {
    question: "Which formats work best for science, medical, or engineering sources?",
    answer:
      "Medical and public health writing often starts with AMA or Vancouver. Chemistry and materials science usually use ACS. Biology and environmental science may use CSE. Engineering, computer science, and conference papers often use IEEE."
  },
  {
    question: "Are the citation tools free?",
    answer:
      "Yes. The common citation formats, metadata lookup, manual entry, result editing, and citation copying can be used directly without creating an account."
  }
];

export default function ToolsPage() {
  const toolCount = toolClusters.reduce((count, cluster) => count + cluster.slugs.length, 0);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Free Citation Generator Tools",
          description: `${toolCount} free citation generators with source labels, missing-field warnings, and editable fields.`,
          url: absoluteUrl("/tools/")
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: toolFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
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
        <div className="tools-hero">
          <div className="tools-hero-copy">
            <p className="home-kicker">Citation tools</p>
            <h1 className="font-editorial mt-3 text-balance text-[34px] leading-[1.12] text-ink md:text-[52px]">
              Choose the right citation generator
            </h1>
            <p className="mt-4 max-w-[64ch] text-pretty text-[16px] leading-7 text-dim">
              Start with APA, MLA, Chicago, ACS, AMA, IEEE, or another required style. Paste a source, then generate an editable citation with visible data sources, field warnings, and copy-ready output.
            </p>
            <div className="hero-action-row">
              <Link href="/apa-citation-generator/" className="action-primary">
                Start with APA
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <a href="#style-picker" className="action-secondary">
                See all formats
              </a>
            </div>
          </div>
          <aside className="tools-hero-panel" aria-label="Citation generation workflow">
            <div className="tools-panel-top">
              <span className="tools-panel-icon" aria-hidden="true">
                <MagnifyingGlass size={21} />
              </span>
              <div>
                <p>Fastest path</p>
                <strong>Choose style first, then review evidence</strong>
              </div>
            </div>
            <ol className="tools-flow-list">
              {workflowSteps.map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
            <div className="tools-panel-note">
              <span>{toolCount} styles</span>
              <p>Built for coursework, lab reports, paper drafts, and research source cleanup.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="style-picker" className="site-shell tools-section" aria-labelledby="quick-style-heading">
        <div className="tools-section-header">
          <div>
            <p className="home-kicker">Quick style picker</p>
            <h2 id="quick-style-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              Keep common formats close.
            </h2>
          </div>
          <p>
            If you already know the required style, open the exact generator. If you are not sure, use the writing-context groups below to narrow the choice.
          </p>
        </div>
        <div className="tools-quick-grid">
          {quickStyles.map((format) => (
            <Link key={format.slug} href={format.href} className="tools-quick-card group">
              <span className="tools-quick-code">{format.label}</span>
              <span>
                <strong>{format.label} Citation Generator</strong>
                <small>{formatUseCases[format.slug]}</small>
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

      <section className="site-shell tools-trust-section" aria-labelledby="tools-trust-heading">
        <div className="tools-trust-copy">
          <p className="home-kicker">Trust checks</p>
          <h2 id="tools-trust-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
            Do not just copy an answer. See where the citation data came from.
          </h2>
        </div>
        <div className="tools-trust-grid">
          {trustChecks.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="tools-trust-card">
                <span aria-hidden="true">
                  <Icon size={20} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="site-shell tools-section" aria-labelledby="tools-clusters-heading">
        <div className="tools-section-header">
          <div>
            <p className="home-kicker">Choose by writing context</p>
            <h2 id="tools-clusters-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              Choose a citation style by writing context.
            </h2>
          </div>
          <p>
            Citation formats are only useful when they match your course, discipline, or submission requirement. Start by context, then open the exact generator.
          </p>
        </div>

        {toolClusters.map((cluster) => {
          const generators = formatLinks(cluster.slugs);
          const Icon = clusterIcons[cluster.title] ?? FileText;
          const display = clusterCopy[cluster.title] ?? {
            title: cluster.title,
            description: cluster.description
          };
          return (
            <article key={cluster.title} className="tools-cluster">
              <div className="tools-cluster-header">
                <div className="tools-cluster-icon">
                  <Icon aria-hidden="true" size={20} />
                </div>
                <div>
                  <h3>{display.title}</h3>
                  <p>{display.description}</p>
                </div>
              </div>
              <div className="tools-format-grid">
                {generators.map((format) => (
                  <Link
                    key={format.slug}
                    href={format.href}
                    className="tools-format-card group"
                  >
                    <span className="tools-format-topline">
                      <span className="tools-format-code">{format.label}</span>
                      <span>{citationModeLabels[format.citationMode]}</span>
                    </span>
                    <strong>{format.label} Citation Generator</strong>
                    <small>{format.edition}</small>
                    <p>{formatUseCases[format.slug]}</p>
                    <span className="tools-format-footer">
                      Open tool
                      <ArrowRight
                        aria-hidden="true"
                        size={16}
                        className="text-faint group-hover:text-ink transition-colors"
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="site-shell tools-faq-section" aria-labelledby="tools-faq-heading">
        <div className="tools-faq-copy">
          <p className="home-kicker">FAQ</p>
          <h2 id="tools-faq-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
            Common questions before choosing a citation tool.
          </h2>
          <p>
            Resolve the three decisions that matter most: format choice, data trust, and whether the result can be edited before copying.
          </p>
        </div>
        <div className="tools-faq-list">
          {toolFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                <span>{faq.question}</span>
                <ArrowRight
                  aria-hidden="true"
                  size={18}
                />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
