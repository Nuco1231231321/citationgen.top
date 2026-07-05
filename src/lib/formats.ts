export const generatorSlugs = [
  "ama",
  "acs",
  "cse",
  "ieee",
  "turabian",
  "chicago",
  "mla",
  "vancouver",
  "harvard",
  "apa"
] as const;

export type GeneratorSlug = (typeof generatorSlugs)[number];

export type FormatVersion = {
  key: string;
  label: string;
  cslFile: string;
};

export type GeneratorFormat = {
  slug: GeneratorSlug;
  label: string;
  fullName: string;
  edition: string;
  primaryKeyword: string;
  searchVolume: string;
  keywordDifficulty: string;
  cslFile: string;
  cslSourceFile: string;
  citationMode: "author-date" | "numeric" | "note";
  versions?: FormatVersion[];
  title: string;
  description: string;
  h1: string;
  intro: string;
  audience: string;
  dataNote: string;
  quickRules: string[];
  faqs: Array<{ question: string; answer: string }>;
  related: GeneratorSlug[];
  officialUrl: string;
  disciplines: string[];
  inTextRule: string;
  referenceRule: string;
  commonMistakes: string[];
  updatedYear: string;
};

export const generatorFormats: Record<GeneratorSlug, GeneratorFormat> = {
  ama: {
    slug: "ama",
    label: "AMA",
    fullName: "American Medical Association",
    edition: "AMA Manual of Style 11th Edition",
    primaryKeyword: "ama citation generator",
    searchVolume: "22,200 US searches",
    keywordDifficulty: "KD 34",
    cslFile: "american-medical-association.csl",
    cslSourceFile: "american-medical-association.csl",
    citationMode: "numeric",
    title: "Free AMA Citation Generator",
    description:
      "Generate AMA 11th edition citations from DOI, ISBN, URL, title, or manual fields. Shows source data, missing fields, and in-text citations.",
    h1: "Free AMA Citation Generator",
    intro:
      "Create AMA references for journal articles, books, websites, and videos with editable fields and visible source labels.",
    audience:
      "AMA is commonly used in medicine, nursing, public health, and biomedical writing.",
    dataNote:
      "Journal metadata can come from CrossRef, book metadata from Google Books, and journal abbreviations from NLM data.",
    quickRules: [
      "AMA uses numbered in-text citations in the order sources appear.",
      "Journal titles should use NLM abbreviations when a trusted match is available.",
      "List enough source details for a reader to find the original work.",
      "Check missing volume, issue, page, and DOI fields before submitting medical writing."
    ],
    faqs: [
      {
        question: "Can I generate AMA citations from a DOI?",
        answer:
          "Yes. Paste a DOI and the generator searches CrossRef, then formats the result in AMA style."
      },
      {
        question: "Does AMA need journal abbreviations?",
        answer:
          "AMA commonly uses NLM journal abbreviations. When the tool finds a local NLM match, it labels that source."
      },
      {
        question: "What happens if metadata is missing?",
        answer:
          "The result is not hidden. The page shows a warning and lets you edit the missing fields before copying."
      },
      {
        question: "Can I enter a source manually?",
        answer:
          "Yes. Manual entries use the same citation rendering path as DOI, ISBN, URL, and title lookups."
      }
    ],
    related: ["vancouver", "acs", "cse", "ieee"],
    officialUrl: "https://www.amamanualofstyle.com",
    disciplines: ["Medicine", "Nursing", "Public Health", "Biomedical Science", "Pharmacology"],
    inTextRule: "AMA uses superscript numbers (¹,²,³) placed after the cited information, numbered in the order they appear.",
    referenceRule: "References are listed numerically at the end of the paper, using NLM-abbreviated journal titles when available.",
    commonMistakes: ["Using author names instead of numbers in text", "Forgetting to abbreviate journal titles", "Missing access dates for online sources"],
    updatedYear: "2026"
  },
  acs: {
    slug: "acs",
    label: "ACS",
    fullName: "American Chemical Society",
    edition: "ACS Guide to Scholarly Communication 2020",
    primaryKeyword: "acs citation generator",
    searchVolume: "12,100 US searches",
    keywordDifficulty: "KD 26",
    cslFile: "american-chemical-society.csl",
    cslSourceFile: "american-chemical-society.csl",
    citationMode: "numeric",
    title: "Free ACS Citation Generator",
    description:
      "Generate ACS citations from DOI, ISBN, URL, title, or manual fields. Includes NLM journal abbreviations, editable fields, and copy-ready output.",
    h1: "Free ACS Citation Generator",
    intro:
      "Create ACS references for chemistry papers with real metadata lookup, journal abbreviation support, and field warnings.",
    audience:
      "ACS is common in chemistry, chemical engineering, materials science, and adjacent lab courses.",
    dataNote:
      "Journal records are checked against local NLM data first, then ACS abbreviation rules are used only as a fallback.",
    quickRules: [
      "ACS reference lists are numbered and ordered by first appearance.",
      "Journal names usually appear as abbreviated titles with periods.",
      "DOI values are important for chemistry articles and should be kept when available.",
      "Article titles, journal title, year, volume, and pages are the core fields to verify."
    ],
    faqs: [
      {
        question: "Does this ACS generator use real article data?",
        answer:
          "Yes. DOI and title searches use CrossRef. The page labels the data source under the result."
      },
      {
        question: "How are ACS journal abbreviations handled?",
        answer:
          "The tool checks NLM journal data and applies ACS punctuation rules when a short title is available."
      },
      {
        question: "Can I cite a book in ACS style?",
        answer:
          "Yes. ISBN and book title searches use Google Books when available, and you can edit the fields."
      },
      {
        question: "Will the tool invent missing citation data?",
        answer:
          "No. Missing fields are shown as warnings so you can confirm or add them manually."
      }
    ],
    related: ["ama", "cse", "vancouver", "apa"],
    officialUrl: "https://pubs.acs.org/doi/10.1021/acsguide",
    disciplines: ["Chemistry", "Chemical Engineering", "Materials Science", "Biochemistry", "Environmental Chemistry"],
    inTextRule: "ACS uses either superscript numbers¹ or italic numbers in parentheses (1), numbered by first appearance.",
    referenceRule: "Journal names appear as abbreviated titles with periods. Author names are listed surname first with semicolons between entries.",
    commonMistakes: ["Missing journal abbreviations with periods", "Wrong author separator (use semicolons, not commas)", "Not including DOI for journal articles"],
    updatedYear: "2026"
  },
  cse: {
    slug: "cse",
    label: "CSE",
    fullName: "Council of Science Editors",
    edition: "CSE Manual 9th Edition",
    primaryKeyword: "cse citation generator",
    searchVolume: "5,400 US searches",
    keywordDifficulty: "KD 28",
    cslFile: "taylor-and-francis-council-of-science-editors-author-date.csl",
    cslSourceFile: "taylor-and-francis-council-of-science-editors-author-date.csl",
    citationMode: "author-date",
    title: "Free CSE Citation Generator",
    description:
      "Generate CSE citations for science sources from DOI, ISBN, URL, title, or manual fields. Includes editable metadata and in-text citations.",
    h1: "Free CSE Citation Generator",
    intro:
      "Create CSE references for biology, environmental science, and technical writing with real lookup and manual correction.",
    audience:
      "CSE is used in life sciences, biology, ecology, and many science writing courses.",
    dataNote:
      "This page uses the CSE author-date variant and keeps the metadata editable for course-specific requirements.",
    quickRules: [
      "CSE has multiple systems. This generator uses the author-date variant for readable in-text citations.",
      "Keep scientific names, subtitles, and journal title fields accurate.",
      "Use DOI metadata when possible for journal articles.",
      "If your instructor requires citation-sequence CSE, confirm the final punctuation before submitting."
    ],
    faqs: [
      {
        question: "Which CSE system does this page use?",
        answer:
          "It uses a CSE author-date style, which is common for science writing. Some courses may require a numeric CSE variant."
      },
      {
        question: "Can I cite biology journal articles?",
        answer:
          "Yes. DOI and title searches use CrossRef, and the result can be edited before copying."
      },
      {
        question: "Does CSE support websites and videos?",
        answer:
          "Yes. URL metadata extraction is used for web pages, and video entries can be completed manually when metadata is thin."
      },
      {
        question: "Why do I see a missing field warning?",
        answer:
          "The source may not expose all fields through a free metadata API. Add the missing information manually before use."
      }
    ],
    related: ["acs", "ama", "ieee", "vancouver"],
    officialUrl: "https://www.scientificstyleandformat.org",
    disciplines: ["Biology", "Ecology", "Environmental Science", "Zoology", "Botany"],
    inTextRule: "CSE author-date uses (Author Year) in text. The citation-sequence variant uses superscript numbers.",
    referenceRule: "References are ordered alphabetically by author (author-date) or by citation order (citation-sequence), depending on the system used.",
    commonMistakes: ["Confusing author-date with citation-sequence system", "Not italicizing scientific names in titles", "Missing access dates for online resources"],
    updatedYear: "2026"
  },
  ieee: {
    slug: "ieee",
    label: "IEEE",
    fullName: "Institute of Electrical and Electronics Engineers",
    edition: "IEEE Editorial Style Manual",
    primaryKeyword: "ieee citation generator",
    searchVolume: "22,200 US searches",
    keywordDifficulty: "KD 37",
    cslFile: "ieee.csl",
    cslSourceFile: "ieee.csl",
    citationMode: "numeric",
    title: "Free IEEE Citation Generator",
    description:
      "Generate IEEE citations from DOI, ISBN, URL, title, or manual fields. Supports journal, book, website, video, and editable entries.",
    h1: "Free IEEE Citation Generator",
    intro:
      "Create IEEE references for engineering and computer science work with numbered citations and copy-ready results.",
    audience:
      "IEEE is common in engineering, computer science, electronics, and technical conference papers.",
    dataNote:
      "DOI lookup uses CrossRef, while books use Google Books and web pages use server-side metadata extraction.",
    quickRules: [
      "IEEE uses bracketed numbers such as [1] for in-text citations.",
      "References are listed in the order they are cited.",
      "Article title, journal or conference title, year, volume, pages, and DOI are important fields.",
      "Check conference and publisher details manually when the free metadata source is incomplete."
    ],
    faqs: [
      {
        question: "Can I use this for IEEE journal articles?",
        answer:
          "Yes. DOI lookup uses CrossRef, then the citation is rendered with IEEE style rules."
      },
      {
        question: "Can I cite a website in IEEE style?",
        answer:
          "Yes. Paste a URL and the server extracts title, canonical URL, site name, dates, and structured metadata when available."
      },
      {
        question: "Does IEEE use in-text author names?",
        answer:
          "No. IEEE uses numbered citations, so the in-text output is usually a bracketed number."
      },
      {
        question: "Can I edit the generated result?",
        answer:
          "You can edit the fields and regenerate the citation, which is safer than editing only the final text."
      }
    ],
    related: ["cse", "acs", "ama", "chicago"],
    officialUrl: "https://ieeeauthorcenter.ieee.org",
    disciplines: ["Electrical Engineering", "Computer Science", "Electronics", "Telecommunications", "Information Technology"],
    inTextRule: "IEEE uses bracketed numbers [1], [2] placed inline, numbered in citation order.",
    referenceRule: "References appear at the end in numerical order. Each reference includes author initials, title in quotation marks, and abbreviated journal/venue names.",
    commonMistakes: ["Using author-year instead of numbered citations", "Missing conference details in proceedings references", "Not including DOI for IEEE Xplore articles"],
    updatedYear: "2026"
  },
  turabian: {
    slug: "turabian",
    label: "Turabian",
    fullName: "Turabian",
    edition: "Turabian 9th Edition",
    primaryKeyword: "turabian citation generator",
    searchVolume: "4,400 US searches",
    keywordDifficulty: "KD 26",
    cslFile: "chicago-notes-bibliography-subsequent-author-title-17th-edition.csl",
    cslSourceFile: "dependent/turabian-notes-bibliography.csl",
    citationMode: "note",
    title: "Free Turabian Citation Generator",
    description:
      "Generate Turabian notes and bibliography citations from DOI, ISBN, URL, title, or manual fields. Includes editable source details.",
    h1: "Free Turabian Citation Generator",
    intro:
      "Create Turabian-style citations for research papers, theses, and humanities courses with editable source details.",
    audience:
      "Turabian is often used by students writing history, theology, humanities, and research methods papers.",
    dataNote:
      "Turabian notes and bibliography is closely tied to Chicago notes, so this generator follows that connected style family.",
    quickRules: [
      "Turabian notes and bibliography style uses footnotes or endnotes plus a bibliography.",
      "Book citations need author, title, publisher, place, year, and edition when relevant.",
      "Website citations should include access date when the page can change.",
      "Instructor requirements can vary, so use field editing to match your class instructions."
    ],
    faqs: [
      {
        question: "Is Turabian the same as Chicago?",
        answer:
          "Turabian is closely related to Chicago style and is often used for student papers. This page uses the notes and bibliography path."
      },
      {
        question: "Can this create footnote-style citations?",
        answer:
          "The in-text area shows the citeproc note output. Confirm your final footnote formatting in your writing software."
      },
      {
        question: "Can I cite books in Turabian style?",
        answer:
          "Yes. ISBN lookup uses Google Books, and the manual fields let you add publisher place or edition."
      },
      {
        question: "Why does the page mention a parent style?",
        answer:
          "Turabian notes and bibliography is built on Chicago-style notes. The page states that relationship so you know which variant is being used."
      }
    ],
    related: ["chicago", "mla", "harvard", "apa"],
    officialUrl: "https://www.chicagomanualofstyle.org/turabian.html",
    disciplines: ["History", "Theology", "Humanities", "Philosophy", "Art History"],
    inTextRule: "Turabian notes-bibliography uses footnotes or endnotes marked with superscript numbers in text.",
    referenceRule: "First footnote gives full citation details. Subsequent citations use shortened form (author surname, shortened title, page). Bibliography lists all sources alphabetically.",
    commonMistakes: ["Using author-date instead of notes-bibliography format", "Forgetting the shortened form for subsequent citations", "Omitting publication city for older books"],
    updatedYear: "2026"
  },
  chicago: {
    slug: "chicago",
    label: "Chicago",
    fullName: "Chicago Manual of Style",
    edition: "Chicago 18th Edition",
    primaryKeyword: "chicago citation generator",
    searchVolume: "18,100 US searches",
    keywordDifficulty: "KD 46",
    cslFile: "chicago-author-date.csl",
    cslSourceFile: "chicago-author-date.csl",
    citationMode: "author-date",
    versions: [
      { key: "chicago-ad", label: "Author-Date", cslFile: "chicago-author-date.csl" },
      { key: "chicago-nb", label: "Notes & Bibliography", cslFile: "chicago-fullnote-bibliography.csl" }
    ],
    title: "Free Chicago Citation Generator",
    description:
      "Generate Chicago citations from DOI, ISBN, URL, title, or manual fields. Supports editable metadata, full references, and in-text citations.",
    h1: "Free Chicago Citation Generator",
    intro:
      "Create Chicago references with real metadata lookup, author-date in-text citations, and field editing before you copy.",
    audience:
      "Chicago is widely used in history, humanities, publishing, and some social science writing.",
    dataNote:
      "This page uses Chicago author-date rules for consistent in-text citations and reference list output.",
    quickRules: [
      "Chicago author-date uses parenthetical citations with author and year.",
      "Bibliography entries should include enough publication detail for the source type.",
      "Access dates can matter for web pages that change over time.",
      "Chicago notes and bibliography requirements differ, so confirm which system your assignment asks for."
    ],
    faqs: [
      {
        question: "Which Chicago system does this generator use?",
        answer:
          "This page uses Chicago author-date so it can provide in-text citations and bibliography output in one workflow."
      },
      {
        question: "Can I use it for Chicago 18?",
        answer:
          "The page is written for current Chicago usage. Always follow your instructor or publisher if they require a specific variant."
      },
      {
        question: "Does it work with URLs?",
        answer:
          "Yes. URL extraction reads title, canonical URL, site name, description, dates, Open Graph tags, and JSON-LD when present."
      },
      {
        question: "Can I switch from Chicago to Turabian?",
        answer:
          "Yes. Use the format links on the page and keep the same source details by copying them into the target page."
      }
    ],
    related: ["turabian", "mla", "harvard", "apa"],
    officialUrl: "https://www.chicagomanualofstyle.org",
    disciplines: ["History", "Humanities", "Publishing", "Art History", "Anthropology"],
    inTextRule: "Chicago author-date places (Author Year, Page) in parentheses. Chicago notes-bibliography uses superscript numbers linking to footnotes or endnotes.",
    referenceRule: "Bibliography entries list author surname first, then full publication details. Author-date reference lists are ordered alphabetically.",
    commonMistakes: ["Mixing author-date and notes-bibliography formatting rules", "Not including access dates for online sources", "Using MLA-style in-text citations instead of Chicago style"],
    updatedYear: "2026"
  },
  mla: {
    slug: "mla",
    label: "MLA",
    fullName: "Modern Language Association",
    edition: "MLA Handbook 9th Edition",
    primaryKeyword: "mla citation generator",
    searchVolume: "301,000 US searches",
    keywordDifficulty: "KD 64",
    cslFile: "modern-language-association.csl",
    cslSourceFile: "modern-language-association.csl",
    citationMode: "author-date",
    versions: [
      { key: "mla-9", label: "MLA 9th Edition", cslFile: "modern-language-association.csl" },
      { key: "mla-8", label: "MLA 8th Edition", cslFile: "modern-language-association-8th-edition.csl" }
    ],
    title: "Free MLA Citation Generator",
    description:
      "Generate MLA 9 citations from DOI, ISBN, URL, title, or manual fields. Includes Works Cited output, in-text citations, and editable fields.",
    h1: "Free MLA Citation Generator",
    intro:
      "Create MLA Works Cited entries and in-text citations for books, articles, websites, and videos.",
    audience:
      "MLA is common in English, literature, language, composition, and many humanities courses.",
    dataNote:
      "Book lookups use Google Books, article lookups use CrossRef, and websites use server-side metadata extraction.",
    quickRules: [
      "MLA in-text citations usually use author and page, when page numbers are available.",
      "Works Cited entries focus on containers such as journals, websites, and platforms.",
      "Access dates are useful for web pages that may change.",
      "If a source has no author, MLA commonly starts with the title."
    ],
    faqs: [
      {
        question: "What is the MLA citation generator for?",
        answer:
          "Use it to create MLA Works Cited entries and parenthetical citations from books, articles, websites, videos, and manual source details."
      },
      {
        question: "Can I cite books in MLA?",
        answer:
          "Yes. Enter an ISBN or book title and the generator searches Google Books for real metadata."
      },
      {
        question: "Can I cite a website in MLA?",
        answer:
          "Yes. Paste a URL and the tool extracts page title, site name, canonical URL, and dates when available."
      },
      {
        question: "Does MLA always need a URL?",
        answer:
          "No. URLs are common for online sources, but print books and many database sources may not need one."
      }
    ],
    related: ["chicago", "turabian", "apa", "harvard"],
    officialUrl: "https://style.mla.org",
    disciplines: ["English", "Literature", "Languages", "Cultural Studies", "Composition"],
    inTextRule: "MLA uses (Author Page) in parentheses with no comma between name and page number, e.g. (Smith 42).",
    referenceRule: "Works Cited entries use the core elements: Author. Title of Source. Title of Container, Other Contributors, Version, Number, Publisher, Publication Date, Location.",
    commonMistakes: ["Inserting a comma between author and page in in-text citations", "Forgetting the hanging indent in Works Cited", "Not including the container title for articles and web pages"],
    updatedYear: "2026"
  },
  vancouver: {
    slug: "vancouver",
    label: "Vancouver",
    fullName: "Vancouver",
    edition: "ICMJE and NLM style family",
    primaryKeyword: "vancouver citation generator",
    searchVolume: "1,000 US searches, 16,000 global searches",
    keywordDifficulty: "KD 30",
    cslFile: "nlm-citation-sequence.csl",
    cslSourceFile: "dependent/vancouver-nlm.csl",
    citationMode: "numeric",
    title: "Free Vancouver Citation Generator",
    description:
      "Generate Vancouver citations from DOI, ISBN, URL, title, or manual fields. Includes NLM journal abbreviations and editable source data.",
    h1: "Free Vancouver Citation Generator",
    intro:
      "Create Vancouver-style references for medical and scientific writing with numbered citations and source transparency.",
    audience:
      "Vancouver is common in medical, biomedical, and global health journals and coursework.",
    dataNote:
      "This page follows the NLM citation-sequence family, and journal abbreviations use local NLM data when available.",
    quickRules: [
      "Vancouver uses numbered citations in the order sources appear.",
      "Journal titles commonly use NLM abbreviations.",
      "DOI, volume, issue, page, and year fields should be checked for journal articles.",
      "Some institutions use local Vancouver variants, so confirm any course-specific punctuation."
    ],
    faqs: [
      {
        question: "Is Vancouver the same as NLM style?",
        answer:
          "Vancouver is closely related to ICMJE and NLM reference practices. This page follows the NLM citation-sequence family."
      },
      {
        question: "Does the generator abbreviate journal names?",
        answer:
          "When a local NLM match is available, the result uses that abbreviation and labels the source."
      },
      {
        question: "Can I cite books in Vancouver style?",
        answer:
          "Yes. ISBN lookup uses Google Books, and manual fields let you add edition and publisher details."
      },
      {
        question: "Does this support PMID?",
        answer:
          "PMID lookup is not available yet. DOI, ISBN, URL, title, and manual input work now."
      }
    ],
    related: ["ama", "acs", "cse", "ieee"],
    officialUrl: "https://www.icmje.org",
    disciplines: ["Medicine", "Biomedical Science", "Clinical Research", "Pharmacology", "Global Health"],
    inTextRule: "Vancouver uses sequential numbers in brackets [1] or parentheses (1), numbered by first citation order.",
    referenceRule: "References list author surnames and initials (no periods), article title, abbreviated journal name, date, volume, issue, and pages. Up to six authors are listed before et al. is used.",
    commonMistakes: ["Using author-year style instead of numeric", "Listing more than required authors before et al.", "Including periods in abbreviated journal names when not required"],
    updatedYear: "2026"
  },
  harvard: {
    slug: "harvard",
    label: "Harvard",
    fullName: "Harvard referencing",
    edition: "Cite Them Right Harvard variant",
    primaryKeyword: "harvard citation generator",
    searchVolume: "1,600 US searches, 28,600 global searches",
    keywordDifficulty: "KD 45",
    cslFile: "harvard-cite-them-right.csl",
    cslSourceFile: "harvard-cite-them-right.csl",
    citationMode: "author-date",
    versions: [
      { key: "harvard-ctr", label: "Cite Them Right", cslFile: "harvard-cite-them-right.csl" },
      { key: "harvard-imperial", label: "Imperial College London", cslFile: "harvard-imperial-college-london.csl" }
    ],
    title: "Free Harvard Citation Generator",
    description:
      "Generate Harvard citations from DOI, ISBN, URL, title, or manual fields. Uses a visible Harvard variant and editable source details.",
    h1: "Free Harvard Citation Generator",
    intro:
      "Create Harvard references with the Cite Them Right variant, real metadata lookup, and editable fields.",
    audience:
      "Harvard referencing is common in UK, Australian, and international university assignments.",
    dataNote:
      "Harvard has local variants, so this page states the selected variant and lets you adjust source fields.",
    quickRules: [
      "Harvard uses author-date in-text citations.",
      "Reference entries vary by institution, so check local rules if your university provides them.",
      "Books need author, title, year, publisher, and place when available.",
      "Web pages should include URL and access date when required by your institution."
    ],
    faqs: [
      {
        question: "Which Harvard style does this use?",
        answer:
          "It uses the Cite Them Right Harvard variant. Harvard is not one single global manual."
      },
      {
        question: "Can I cite websites in Harvard style?",
        answer:
          "Yes. Paste a URL and the server extracts public metadata, then you can edit the fields."
      },
      {
        question: "Can I use this for UK university assignments?",
        answer:
          "Often, yes, but many universities publish local Harvard rules. Compare the final punctuation before submission."
      },
      {
        question: "Does Harvard need page numbers in text?",
        answer:
          "Page numbers are often used for direct quotations. Add page details manually if your assignment needs them."
      }
    ],
    related: ["apa", "mla", "chicago", "turabian"],
    officialUrl: "https://www.citethemrightonline.com",
    disciplines: ["Business", "Law", "Social Sciences", "Education", "UK Higher Education"],
    inTextRule: "Harvard uses (Author, Year, p. Page) in parentheses for direct quotes, or (Author, Year) for paraphrasing.",
    referenceRule: "References are listed alphabetically by author surname. Each entry includes author, year, title, publisher details, and edition when applicable.",
    commonMistakes: ["Applying one university's Harvard variant to another institution's requirements", "Not specifying edition for books beyond the first", "Missing place of publication for older print sources"],
    updatedYear: "2026"
  },
  apa: {
    slug: "apa",
    label: "APA",
    fullName: "American Psychological Association",
    edition: "APA 7th Edition",
    primaryKeyword: "apa citation generator",
    searchVolume: "450,000 US searches",
    keywordDifficulty: "KD 68",
    cslFile: "apa.csl",
    cslSourceFile: "apa.csl",
    citationMode: "author-date",
    versions: [
      { key: "apa-7", label: "APA 7th Edition", cslFile: "apa.csl" },
      { key: "apa-6", label: "APA 6th Edition", cslFile: "apa-6th-edition.csl" }
    ],
    title: "Free APA Citation Generator",
    description:
      "Generate APA 7 citations from DOI, ISBN, URL, title, or manual fields. Includes editable references, in-text citations, and source labels.",
    h1: "Free APA Citation Generator",
    intro:
      "Create APA 7 references and in-text citations for articles, books, websites, and videos with editable metadata.",
    audience:
      "APA is common in psychology, education, nursing, business, and social science writing.",
    dataNote:
      "APA output is generated from source data found through CrossRef, Google Books, URL extraction, or manual entry.",
    quickRules: [
      "APA 7 uses author-date in-text citations.",
      "References use sentence case for many titles and keep journal titles in title case.",
      "DOIs should be formatted as URLs when available.",
      "For missing dates, APA commonly uses n.d. when the date cannot be found."
    ],
    faqs: [
      {
        question: "Does this support APA 7?",
        answer:
          "Yes. The page uses APA 7 style rules for reference and in-text citation output."
      },
      {
        question: "Can I generate APA citations from a DOI?",
        answer:
          "Yes. Paste a DOI and the generator searches CrossRef before rendering the citation."
      },
      {
        question: "What if a website has no author?",
        answer:
          "The tool warns about missing fields. APA may move the title into the author position, but you should verify the source."
      },
      {
        question: "Can I edit APA fields before copying?",
        answer:
          "Yes. Change the source fields and regenerate so the final citation reflects your edits."
      }
    ],
    related: ["mla", "harvard", "chicago", "acs"],
    officialUrl: "https://apastyle.apa.org",
    disciplines: ["Psychology", "Education", "Nursing", "Business", "Social Work"],
    inTextRule: "APA 7th uses (Author, Year) for paraphrasing and (Author, Year, p. X) for direct quotes. For three or more authors, use et al. from the first citation.",
    referenceRule: "Reference list is double-spaced with hanging indent. Author surnames come first, followed by initials. DOIs are formatted as https://doi.org/... links.",
    commonMistakes: ["Using et al. incorrectly for two-author works", "Writing DOIs as plain text instead of URLs", "Forgetting the hanging indent in reference lists"],
    updatedYear: "2026"
  }
};

export const allGeneratorFormats = generatorSlugs.map((slug) => generatorFormats[slug]);

export function isGeneratorSlug(value: string): value is GeneratorSlug {
  return generatorSlugs.includes(value as GeneratorSlug);
}

export function generatorRouteSegment(slug: GeneratorSlug) {
  return `${slug}-citation-generator`;
}

export function generatorPath(slug: GeneratorSlug) {
  return `/${generatorRouteSegment(slug)}/`;
}

export function parseGeneratorRoute(value: string): GeneratorSlug | null {
  const suffix = "-citation-generator";
  if (!value.endsWith(suffix)) return null;

  const maybeSlug = value.slice(0, -suffix.length);
  return isGeneratorSlug(maybeSlug) ? maybeSlug : null;
}
