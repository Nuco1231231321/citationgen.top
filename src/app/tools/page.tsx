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
  title: "Free Citation Generators by Style",
  description:
    "Find the APA, MLA, Chicago, ACS, AMA, IEEE, Vancouver, CSE, Turabian, or Harvard citation generator your paper needs.",
  alternates: {
    canonical: absoluteUrl("/tools/")
  },
  openGraph: {
    title: "Free Citation Generators by Style",
    description:
      "Open the citation generator that matches your assignment, subject, or journal requirement.",
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
    description: "Use these styles for lab reports, medical papers, journal articles, biology courses, and chemistry assignments."
  },
  Engineering: {
    title: "Engineering and computer science",
    description: "Use IEEE when your source list needs numbered references for engineering, computing, or conference papers."
  },
  Humanities: {
    title: "Humanities and student papers",
    description: "Use these styles for history, literature, writing courses, footnotes, bibliographies, and Works Cited pages."
  },
  "Common author-date styles": {
    title: "Common author-date styles",
    description: "Use these styles when your assignment expects author-date citations in social science, education, or business."
  }
};

const quickStyles = formatLinks(["apa", "mla", "chicago", "acs", "ama", "ieee"]);

const citationModeLabels: Record<GeneratorFormat["citationMode"], string> = {
  "author-date": "Author-date in text",
  numeric: "Numbered in text",
  note: "Footnotes or notes"
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
    title: "Start from the requirement",
    body: "If your instructor or journal names a style, open that generator first.",
    icon: ListChecks
  },
  {
    title: "Use the source you have",
    body: "Paste a DOI, ISBN, URL, title, or enter the source by hand when search does not find enough details.",
    icon: Database
  },
  {
    title: "Fix details before copying",
    body: "Check author names, dates, page ranges, DOI, URL, and titles before you paste into your paper.",
    icon: WarningCircle
  },
  {
    title: "Edit the result",
    body: "Adjust fields on the citation page instead of rewriting the whole reference from scratch.",
    icon: PencilSimpleLine
  },
  {
    title: "No signup required",
    body: "Create and copy citations directly for homework, drafts, lab reports, and research notes.",
    icon: MagnifyingGlass
  }
];

const workflowSteps = [
  "Find the style named in your instructions",
  "Choose a generator by subject if no style is named",
  "Paste the source information you have",
  "Review, edit, and copy the citation"
];

const toolFaqs = [
  {
    question: "Which citation generator should I choose?",
    answer:
      "Use the format named in your assignment, syllabus, journal instructions, or style guide. If no style is named, choose by subject: APA for many social science papers, MLA for literature and writing courses, Chicago or Turabian for humanities, AMA or Vancouver for medical writing, ACS for chemistry, and IEEE for engineering or computer science."
  },
  {
    question: "What if my citation is missing details?",
    answer:
      "Do not copy it blindly. Open the result, add the missing author, date, page range, publisher, DOI, or URL if you can find it on the source, then copy the citation."
  },
  {
    question: "Can I change a citation before I copy it?",
    answer:
      "Yes. After the generator finds a source, you can adjust title casing, author order, publication date, volume, issue, pages, URL, DOI, and other source details before copying."
  },
  {
    question: "Which formats work best for science, medical, or engineering sources?",
    answer:
      "Medical and public health writing often starts with AMA or Vancouver. Chemistry and materials science usually use ACS. Biology and environmental science may use CSE. Engineering, computer science, and conference papers often use IEEE."
  },
  {
    question: "Are the citation tools free?",
    answer:
      "Yes. You can open a generator, enter source information, edit the citation, and copy the result without creating an account."
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
          name: "Free Citation Generators by Style",
          description: `${toolCount} citation generators for students, researchers, lab reports, journal articles, websites, books, and class assignments.`,
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
              Find the citation generator your paper needs
            </h1>
            <p className="mt-4 max-w-[64ch] text-pretty text-[16px] leading-7 text-dim">
              Start with the style named in your assignment, syllabus, or journal instructions. Then cite a book, article, website, DOI, ISBN, or source you enter by hand.
            </p>
            <div className="hero-action-row">
              <Link href="/apa-citation-generator/" className="action-primary">
                Open APA generator
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <a href="#style-picker" className="action-secondary">
                See all formats
              </a>
            </div>
          </div>
          <aside className="tools-hero-panel" aria-label="How to choose a citation generator">
            <div className="tools-panel-top">
              <span className="tools-panel-icon" aria-hidden="true">
                <MagnifyingGlass size={21} />
              </span>
              <div>
                <p>Not sure where to start?</p>
                <strong>Use the style named by your class, subject, or journal.</strong>
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
              <p>If your instructions say "use APA 7" or "use IEEE," go straight to that generator.</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="style-picker" className="site-shell tools-section" aria-labelledby="quick-style-heading">
        <div className="tools-section-header">
          <div>
            <p className="home-kicker">Quick style picker</p>
            <h2 id="quick-style-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              Popular citation generators.
            </h2>
          </div>
          <p>
            Most students need one of these formats. Open the style your assignment asks for, then enter the source you want to cite.
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
          <p className="home-kicker">Before you copy</p>
          <h2 id="tools-trust-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
            Make the citation fit your source, not just the format.
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
            <p className="home-kicker">Choose by subject</p>
            <h2 id="tools-clusters-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              Match the style to your class or field.
            </h2>
          </div>
          <p>
            Use this section when your assignment does not clearly name a style. Pick the group closest to your course, then open the generator that matches the requirement.
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
                      Open generator
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
            Common questions before choosing a generator.
          </h2>
          <p>
            If your instructions are unclear, start here before opening a style-specific generator.
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
