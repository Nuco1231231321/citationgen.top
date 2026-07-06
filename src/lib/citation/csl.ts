import CSL from "citeproc";
import { generatorFormats, isGeneratorSlug, type GeneratorSlug } from "@/lib/formats";
import { stripHtml } from "@/lib/utils";
import type { CitationMetadata, Contributor, DateParts } from "@/lib/metadata/types";
import { lookupJournalAbbreviation, type D1DatabaseLike } from "./nlm";
import cslData from "./csl-data.json";

type CslName = {
  given?: string;
  family?: string;
  literal?: string;
};

type CslItem = {
  id: string;
  type: string;
  title?: string;
  author?: CslName[];
  editor?: CslName[];
  issued?: { "date-parts": number[][] };
  accessed?: { "date-parts": number[][] };
  "container-title"?: string;
  "container-title-short"?: string;
  volume?: string;
  issue?: string;
  page?: string;
  DOI?: string;
  URL?: string;
  publisher?: string;
  "publisher-place"?: string;
  edition?: string;
  ISBN?: string;
  abstract?: string;
  medium?: string;
};

type CslData = {
  styles: Record<string, string>;
  locale: string;
};

export type RenderedCitation = {
  fullCitation: string;
  inTextCitation: string;
  metadata: CitationMetadata;
};

type RenderCitationOptions = {
  assetOrigin?: string;
  nlmDatabase?: D1DatabaseLike;
  disableJournalAbbreviation?: boolean;
};

const styleCache = new Map<string, string>();
let localeCache: string | undefined;

export async function renderCitation(
  metadata: CitationMetadata,
  styleSlug: string,
  cslFileOverride?: string,
  options: RenderCitationOptions = {}
): Promise<RenderedCitation> {
  const metadataWithAbbreviation = options.disableJournalAbbreviation
    ? metadata
    : await applyJournalAbbreviation(
        metadata,
        isGeneratorSlug(styleSlug) ? styleSlug : "apa",
        options.assetOrigin,
        options.nlmDatabase
      );
  const item = toCslItem(metadataWithAbbreviation);
  const cslFilename = cslFileOverride ?? (
    isGeneratorSlug(styleSlug)
      ? generatorFormats[styleSlug].cslFile
      : "apa.csl"
  );
  const styleXml = readStyle(cslFilename);
  const localeXml = readLocale();
  let citationStrings: { fullCitationHtml: string; inTextCitationHtml: string };
  let renderedMetadata = metadataWithAbbreviation;

  try {
    citationStrings = renderCslStrings(item, styleXml, localeXml);
  } catch (error) {
    if (!item.page || !isCiteprocPageRangeError(error)) throw error;

    const itemWithoutPage = { ...item };
    delete itemWithoutPage.page;
    citationStrings = renderCslStrings(itemWithoutPage, styleXml, localeXml);
    renderedMetadata = {
      ...metadataWithAbbreviation,
      page: undefined,
      warnings: [
        ...metadataWithAbbreviation.warnings,
        "The page range could not be rendered automatically. Add the page range manually before submitting."
      ]
    };
  }

  return {
    metadata: renderedMetadata,
    fullCitation: stripHtml(citationStrings.fullCitationHtml || citationStrings.inTextCitationHtml),
    inTextCitation: stripHtml(citationStrings.inTextCitationHtml)
  };
}

function renderCslStrings(item: CslItem, styleXml: string, localeXml: string) {
  const items: Record<string, CslItem> = {
    [item.id]: item
  };

  const sys = {
    retrieveLocale: () => localeXml,
    retrieveItem: (id: string) => items[id]
  };

  const engine = new CSL.Engine(sys, styleXml, "en-US");
  engine.updateItems([item.id]);
  const bibliographyHtml = renderBibliographyHtml(engine);
  const citationHtml = renderCitationHtml(engine, item.id);

  return {
    fullCitationHtml: bibliographyHtml || citationHtml,
    inTextCitationHtml: citationHtml
  };
}

function renderBibliographyHtml(engine: InstanceType<typeof CSL.Engine>) {
  try {
    const bibliography = engine.makeBibliography();
    if (!Array.isArray(bibliography) || !Array.isArray(bibliography[1])) return "";
    return bibliography[1].join(" ");
  } catch {
    return "";
  }
}

function renderCitationHtml(engine: InstanceType<typeof CSL.Engine>, itemId: string) {
  const citation = {
    citationItems: [{ id: itemId }],
    properties: { noteIndex: 1 }
  };

  try {
    return (
      engine.previewCitationCluster(citation, [], [], "html") ||
      engine.makeCitationCluster([{ id: itemId }]) ||
      ""
    );
  } catch {
    try {
      return engine.makeCitationCluster([{ id: itemId }]) || "";
    } catch {
      return "";
    }
  }
}

function isCiteprocPageRangeError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    error.message.includes("Cannot read properties of null") &&
    (error.stack?.includes("page_mangler") || error.stack?.includes("processNumber"))
  );
}

async function applyJournalAbbreviation(
  metadata: CitationMetadata,
  styleSlug: GeneratorSlug,
  assetOrigin?: string,
  database?: D1DatabaseLike
): Promise<CitationMetadata> {
  if (metadata.sourceType !== "journal" || !metadata.containerTitle) return metadata;

  const lookup = await lookupJournalAbbreviation(metadata.containerTitle, styleSlug, assetOrigin, database);
  if (!lookup) return metadata;

  return {
    ...metadata,
    containerTitleShort: lookup.abbreviation,
    abbreviationLabel: lookup.label,
    abbreviationProvider: lookup.provider
  };
}

export function toCslItem(metadata: CitationMetadata): CslItem {
  const item: CslItem = {
    id: metadata.id,
    type: metadata.cslType ?? toCslType(metadata.sourceType),
    title: metadata.title,
    author: metadata.authors.map(toCslName),
    editor: metadata.editors?.map(toCslName),
    issued: toCslDate(metadata.issued),
    accessed: toCslDate(metadata.accessed),
    "container-title": metadata.containerTitle,
    "container-title-short": metadata.containerTitleShort,
    volume: metadata.volume,
    issue: metadata.issue,
    page: metadata.page,
    DOI: metadata.DOI,
    URL: metadata.URL,
    publisher: metadata.publisher,
    "publisher-place": metadata.publisherPlace,
    edition: metadata.edition,
    ISBN: metadata.ISBN,
    abstract: metadata.abstract,
    medium: metadata.sourceType === "video" ? "Video" : undefined
  };

  return Object.fromEntries(
    Object.entries(item).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== "";
    })
  ) as CslItem;
}

function toCslType(sourceType: CitationMetadata["sourceType"]) {
  if (sourceType === "journal") return "article-journal";
  if (sourceType === "book") return "book";
  if (sourceType === "video") return "motion_picture";
  return "webpage";
}

function toCslName(contributor: Contributor): CslName {
  if (contributor.literal) return { literal: contributor.literal };
  return {
    given: contributor.given,
    family: contributor.family
  };
}

function toCslDate(date?: DateParts) {
  if (!date?.year) return undefined;
  return {
    "date-parts": [[date.year, date.month, date.day].filter(Boolean) as number[]]
  };
}

function readStyle(fileName: string) {
  const cached = styleCache.get(fileName);
  if (cached) return cached;

  const xml = (cslData as CslData).styles[fileName];
  if (!xml) {
    throw new Error(`Missing CSL style ${fileName}. Run npm run download:csl.`);
  }

  styleCache.set(fileName, xml);
  return xml;
}

function readLocale() {
  if (localeCache) return localeCache;
  localeCache = (cslData as CslData).locale;
  if (!localeCache) {
    throw new Error("Missing CSL locale. Run npm run download:csl.");
  }
  return localeCache;
}
