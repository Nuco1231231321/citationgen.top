import { generatorFormats, generatorPath, type GeneratorSlug } from "./formats";

export const corePages = [
  {
    label: "Blog",
    href: "/blog/",
    description: "Citation guides, tool comparisons, and practical advice for accurate referencing."
  },
  {
    label: "About",
    href: "/about/",
    description: "How the generator uses public metadata, editable fields, and source checks."
  }
] as const;

export const toolClusters: Array<{
  title: string;
  description: string;
  slugs: GeneratorSlug[];
}> = [
  {
    title: "Science and medical",
    description: "Formats where DOI metadata, NLM journal abbreviations, and missing field checks matter most.",
    slugs: ["ama", "acs", "cse", "vancouver"]
  },
  {
    title: "Engineering",
    description: "Numbered citation workflows for engineering, computer science, and conference papers.",
    slugs: ["ieee"]
  },
  {
    title: "Humanities",
    description: "Notes, bibliography, Works Cited, and student-paper citation styles.",
    slugs: ["turabian", "chicago", "mla"]
  },
  {
    title: "Common author-date styles",
    description: "High-use formats for social science, education, business, and international assignments.",
    slugs: ["apa", "harvard"]
  }
];

export function formatLinks(slugs: GeneratorSlug[]) {
  return slugs.map((slug) => ({
    ...generatorFormats[slug],
    href: generatorPath(slug)
  }));
}
