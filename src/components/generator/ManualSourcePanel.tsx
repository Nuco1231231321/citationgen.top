"use client";

import type { CitationMetadata, ResolvedSourceType } from "@/lib/metadata/types";

export type ManualSourceTemplate = {
  label: string;
  helper: string;
  sourceType: ResolvedSourceType;
  cslType: string;
  featured?: boolean;
};

export const manualSourceTemplates: ManualSourceTemplate[] = [
  {
    label: "Webpage",
    helper: "A specific page from a website",
    sourceType: "website",
    cslType: "webpage",
    featured: true
  },
  {
    label: "Journal article",
    helper: "An article from an academic journal",
    sourceType: "journal",
    cslType: "article-journal",
    featured: true
  },
  {
    label: "Book",
    helper: "A book, e-book, or online book",
    sourceType: "book",
    cslType: "book",
    featured: true
  },
  {
    label: "Report",
    helper: "A report from an organization or agency",
    sourceType: "website",
    cslType: "report",
    featured: true
  },
  {
    label: "Video",
    helper: "A video from YouTube, Vimeo, or another site",
    sourceType: "video",
    cslType: "motion_picture",
    featured: true
  },
  {
    label: "Newspaper article",
    helper: "An online or print newspaper article",
    sourceType: "website",
    cslType: "article-newspaper",
    featured: true
  },
  { label: "Artwork", helper: "A painting, photo, sculpture, or installation", sourceType: "website", cslType: "graphic" },
  { label: "Blog post", helper: "A post from a blog", sourceType: "website", cslType: "post-weblog" },
  { label: "Book chapter", helper: "A chapter from an edited book", sourceType: "book", cslType: "chapter" },
  { label: "Conference paper", helper: "A conference paper or proceeding", sourceType: "journal", cslType: "paper-conference" },
  { label: "Dataset", helper: "A published dataset or raw data source", sourceType: "website", cslType: "dataset" },
  { label: "Dictionary entry", helper: "An online or print dictionary entry", sourceType: "website", cslType: "entry-dictionary" },
  { label: "Encyclopedia entry", helper: "An online or print encyclopedia entry", sourceType: "website", cslType: "entry-encyclopedia" },
  { label: "Film", helper: "A film or movie", sourceType: "video", cslType: "motion_picture" },
  { label: "Forum post", helper: "A forum post or message-board thread", sourceType: "website", cslType: "post" },
  { label: "Image", helper: "An online or print image", sourceType: "website", cslType: "graphic" },
  { label: "Magazine article", helper: "An online or print magazine article", sourceType: "website", cslType: "article-magazine" },
  { label: "Patent", helper: "A patent from a legal authority", sourceType: "website", cslType: "patent" },
  { label: "Podcast episode", helper: "A single podcast episode", sourceType: "website", cslType: "song" },
  { label: "Presentation slides", helper: "Slides viewed online or in person", sourceType: "website", cslType: "speech" },
  { label: "Press release", helper: "A press release from an organization", sourceType: "website", cslType: "webpage" },
  { label: "Social media post", helper: "A post from a social platform", sourceType: "website", cslType: "post" },
  { label: "Software", helper: "Software used in your research", sourceType: "website", cslType: "software" },
  { label: "Thesis or dissertation", helper: "A thesis, dissertation, or student paper", sourceType: "book", cslType: "thesis" },
  { label: "Wiki entry", helper: "A Wikipedia article or another wiki page", sourceType: "website", cslType: "entry-encyclopedia" }
];

type ManualSourcePanelProps = {
  onChoose: (template: ManualSourceTemplate) => void;
};

export function ManualSourcePanel({ onChoose }: ManualSourcePanelProps) {
  const featured = manualSourceTemplates.filter((template) => template.featured);
  const all = manualSourceTemplates.filter((template) => !template.featured);

  return (
    <div className="mt-5 rounded-3xl bg-surface border border-line p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.3fr_0.7fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Source types</p>
          <h2 className="font-editorial mt-3 text-[24px] leading-[1.2] text-ink">
            Start from the source you have.
          </h2>
          <p className="mt-3 text-pretty text-sm leading-6 text-dim">
            Common sources can be looked up automatically. The rest open editable fields.
          </p>
        </div>
        <div className="grid gap-5">
          <div>
            <p className="mb-3 text-sm font-medium text-ink">Most used</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => onChoose(template)}
                  className="manual-source-card rounded-2xl p-4 text-left"
                >
                  <strong className="text-sm text-ink">{template.label}</strong>
                  <small className="block text-xs text-faint mt-1">{template.helper}</small>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-ink">More source types</p>
            <div className="flex flex-wrap gap-2">
              {all.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => onChoose(template)}
                  className="manual-source-chip px-3.5 py-1.5 text-xs"
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
