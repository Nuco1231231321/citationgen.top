import type { GeneratorSlug } from "./formats";

export type ArticleRecord = {
  slug: string;
  path: string;
  eyebrow: string;
  category: string;
  title: string;
  seoTitle?: string;
  description: string;
  excerpt: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  heroImage: string;
  heroAlt: string;
  tags: string[];
  relatedGenerators: GeneratorSlug[];
  keyTakeaways: string[];
  author?: {
    name: string;
    role: string;
    bio: string;
    initials: string;
  };
  references?: Array<{
    label: string;
    url: string;
    description: string;
  }>;
};

export const hubCopy = {
  blog: {
    eyebrow: "Blog",
    title: "Citation guides, tool comparisons, and practical advice",
    description:
      "Read citation guides, style comparisons, and tool reviews based on real metadata tests and official style manuals.",
    searchPlaceholder: "Search articles...",
    canonicalPath: "/blog/"
  }
};

export const articles: ArticleRecord[] = [
  {
    slug: "best-free-citation-generator-2026",
    path: "/blog/best-free-citation-generator-2026/",
    eyebrow: "Tool comparison",
    category: "Tool reviews",
    title: "Best free citation generator 2026: 5 tools tested with source checks",
    seoTitle: "Best free citation generator 2026: 5 tools tested",
    description:
      "We tested five free citation generators with the same DOI, ISBN, and URL to compare source labels, editable fields, and missing-field warnings.",
    excerpt:
      "Most citation generators produce the same output from the same metadata. The real difference is whether they tell you where the data came from and let you fix errors before copying.",
    datePublished: "2026-07-04",
    dateModified: "2026-07-05",
    readingTime: "11 min read",
    heroImage: "/illustrations/article-tool-comparison.svg",
    heroAlt: "Line illustration of five citation tools being compared side by side.",
    tags: ["Tool comparison", "Citation Machine", "MyBib", "ZoteroBib", "Source checks"],
    relatedGenerators: ["apa", "mla", "chicago", "acs", "ama"],
    keyTakeaways: [
      "Most citation tools hide where their metadata came from — only one tool in our test showed source labels.",
      "Free tools like ZoteroBib and MyBib match paid tools in output accuracy but lack editable fields and missing-field warnings.",
      "Paid tools add editing and plagiarism checks but don't guarantee better metadata accuracy.",
      "If you work in science or medicine, journal abbreviation support and DOI accuracy separate good tools from the rest."
    ],
    author: {
      name: "Editorial Team",
      role: "Citation tool testing & metadata quality review",
      bio: "We test citation generators against real metadata sources — CrossRef, Google Books, NLM, and URL metadata — using the same DOI, ISBN, and URL across every tool. No sponsored rankings. No affiliate links. Every comparison is based on hands-on testing in July 2026.",
      initials: "CT"
    },
    references: [
      {
        label: "J Med Libr Assoc (2019)",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6774549/",
        description: "Audit of 1,200 biomedical references found 25.4% citation error rate."
      },
      {
        label: "ZoteroBib source code",
        url: "https://github.com/zotero/zotero-bib",
        description: "Open-source repository confirming citeproc-js engine and metadata sources."
      },
      {
        label: "Publication Manual of the APA, 7th ed. (2020)",
        url: "https://apastyle.apa.org/products/publication-manual-7th-edition",
        description: "Official APA style manual used to verify formatting."
      },
      {
        label: "MLA Handbook, 9th ed. (2021)",
        url: "https://style.mla.org/mla-handbook-9th-edition/",
        description: "Official MLA style manual used to verify formatting."
      }
    ]
  },
  {
    slug: "when-to-use-apa-vs-mla",
    path: "/blog/when-to-use-apa-vs-mla/",
    eyebrow: "Style decision",
    category: "Style choice",
    title: "APA vs MLA: which should you use for your paper?",
    description:
      "A practical APA vs MLA guide covering disciplines, in-text rules, reference formatting, and what to check before submitting a paper.",
    excerpt:
      "Use this when your syllabus says APA or MLA and you want to understand why one style fits your subject and what changes when you switch between them.",
    datePublished: "2026-07-05",
    dateModified: "2026-07-05",
    readingTime: "8 min read",
    heroImage: "/illustrations/article-apa-vs-mla.svg",
    heroAlt: "Line illustration comparing two citation cards labeled APA and MLA.",
    tags: ["APA", "MLA", "Style choice", "Student guide"],
    relatedGenerators: ["apa", "mla"],
    keyTakeaways: [
      "APA is standard in psychology, education, nursing, and social sciences. MLA is standard in English, literature, languages, and humanities.",
      "APA in-text uses (Author, Year). MLA in-text uses (Author Page). This single difference cascades into every reference entry.",
      "APA references emphasize recency. MLA works cited emphasize the container and version.",
      "When you switch from APA to MLA, check: in-text format, reference list title, author name rules, and title capitalization."
    ],
    author: {
      name: "Editorial Team",
      role: "Citation research & style manual verification",
      bio: "Our articles are written by verifying style rules against the official APA Publication Manual (7th ed.) and MLA Handbook (9th ed.). Every claim is cross-checked against the current edition.",
      initials: "CT"
    },
    references: [
      {
        label: "APA Publication Manual, 7th ed.",
        url: "https://apastyle.apa.org/products/publication-manual-7th-edition",
        description: "Official APA style guide covering all formatting and citation rules."
      },
      {
        label: "MLA Handbook, 9th ed.",
        url: "https://style.mla.org/mla-handbook-9th-edition/",
        description: "Official MLA style guide covering works cited and in-text citation rules."
      }
    ]
  },
  {
    slug: "free-vs-paid-citation-generators",
    path: "/blog/free-vs-paid-citation-generators/",
    eyebrow: "Value guide",
    category: "Tool reviews",
    title: "Free vs paid citation generators: what you actually get for your money",
    seoTitle: "Free vs paid citation generators: what you get",
    description:
      "Compare free and paid citation generators, including what subscriptions add and which citation features stay free.",
    excerpt:
      "Use this before paying for a citation tool. Most paid features are about convenience (ad-free, editing), not accuracy. The underlying data sources are the same.",
    datePublished: "2026-07-05",
    dateModified: "2026-07-05",
    readingTime: "9 min read",
    heroImage: "/illustrations/article-free-vs-paid.svg",
    heroAlt: "Line illustration of free and paid citation tools on a balance scale.",
    tags: ["Free tools", "Paid tools", "Citation Machine", "MyBib", "Value comparison"],
    relatedGenerators: ["apa", "mla", "chicago"],
    keyTakeaways: [
      "Paid citation tools unlock editing, plagiarism checks, and writing suggestions — none of which improve metadata accuracy.",
      "The free ZoteroBib and MyBib engines are identical to paid tools — they use the same citeproc-js library.",
      "If you only need citations, a paid subscription is unnecessary. If you want an all-in-one writing suite, the cost may be justified.",
      "Our tool is free with source labels, editable fields, and missing-field warnings — features that paid tools do not offer."
    ],
    author: {
      name: "Editorial Team",
      role: "Citation tool pricing research & feature testing",
      bio: "We verified all pricing and feature claims by testing each tool's free and paid tiers in July 2026. Pricing was confirmed from each tool's official pricing page on the date of testing.",
      initials: "CT"
    },
    references: [
      {
        label: "Citation Machine pricing (July 2026)",
        url: "https://www.citationmachine.net/upgrade",
        description: "Official pricing page accessed July 5, 2026."
      },
      {
        label: "MyBib (free tool)",
        url: "https://www.mybib.com/",
        description: "100% free citation generator using citeproc-js engine."
      },
      {
        label: "ZoteroBib (free, open source)",
        url: "https://zbib.org/",
        description: "Free citation tool from the Zotero team at Corporation for Digital Scholarship."
      }
    ]
  },
  {
    slug: "academic-integrity-and-citations",
    path: "/blog/academic-integrity-and-citations/",
    eyebrow: "Student guide",
    category: "Academic skills",
    title: "Citation and academic integrity: a practical guide for students",
    seoTitle: "Citation and academic integrity: student guide",
    description:
      "Learn what to cite, when to cite, common plagiarism traps, and how citation generators fit into honest academic work.",
    excerpt:
      "Use this when you want to understand why citations matter beyond the grade — and how to build them into your writing workflow without last-minute panic.",
    datePublished: "2026-07-05",
    dateModified: "2026-07-05",
    readingTime: "10 min read",
    heroImage: "/illustrations/article-integrity.svg",
    heroAlt: "Line illustration of a student paper with citation markers and a checklist.",
    tags: ["Academic integrity", "Plagiarism", "Student guide", "Citation basics"],
    relatedGenerators: ["apa", "mla", "chicago", "harvard"],
    keyTakeaways: [
      "A citation is a breadcrumb trail: it lets your reader find the exact source you used. Formatting rules exist to make that trail consistent.",
      "Common knowledge in your field does not need a citation. Specific data, direct quotes, paraphrased arguments, and images always need one.",
      "A citation generator saves time but does not replace checking. Always verify author names, dates, and DOIs against the original source.",
      "Accidental plagiarism often comes from poor note-taking, not intent. Keep a working bibliography from the start of your research."
    ],
    author: {
      name: "Editorial Team",
      role: "Academic writing & citation integrity research",
      bio: "Our articles on academic integrity are informed by university honor codes, the International Center for Academic Integrity (ICAI) guidelines, and direct testing of citation workflows. We cite our sources so you can verify every claim.",
      initials: "CT"
    },
    references: [
      {
        label: "ICAI Fundamental Values",
        url: "https://academicintegrity.org/resources/fundamental-values",
        description: "International Center for Academic Integrity's foundational principles for academic honesty."
      },
      {
        label: "Purdue OWL: Avoiding Plagiarism",
        url: "https://owl.purdue.edu/owl/avoiding_plagiarism/index.html",
        description: "Comprehensive guide to plagiarism prevention from Purdue University's writing lab."
      },
      {
        label: "APA Style: Plagiarism",
        url: "https://apastyle.apa.org/style-grammar-guidelines/citations/plagiarism",
        description: "APA's official guidance on citation and plagiarism prevention."
      }
    ]
  }
];

export function articleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function articleCategories() {
  return Array.from(new Set(articles.map((a) => a.category)));
}
