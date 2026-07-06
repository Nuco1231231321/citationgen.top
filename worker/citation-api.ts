import { renderCitation } from "../src/lib/citation/csl";
import type { D1DatabaseLike } from "../src/lib/citation/nlm";
import { generatorSlugs, isGeneratorSlug, type GeneratorSlug } from "../src/lib/formats";
import { resolveCitationMetadata } from "../src/lib/metadata/resolve";
import {
  MetadataError,
  type CitationMetadata,
  type CitationRequest,
  type Contributor,
  type SourceType
} from "../src/lib/metadata/types";

const sourceTypes: SourceType[] = ["auto", "journal", "book", "website", "video", "manual"];

type WorkerCitationEnv = {
  NLM_DB?: D1DatabaseLike;
};

export async function handleCitationApiRequest(request: Request, env?: WorkerCitationEnv) {
  try {
    const body = (await request.json()) as CitationRequest;
    if (!isGeneratorSlug(body.style) && !body.cslFile) {
      return json(
        {
          error: `Choose a supported citation style: ${generatorSlugs.join(", ")}.`
        },
        400
      );
    }

    if (!sourceTypes.includes(body.sourceType)) {
      return json(
        {
          error: "Choose a supported source type."
        },
        400
      );
    }

    const { metadata } = await resolveCitationMetadata({
      input: body.input,
      sourceType: body.sourceType,
      metadata: body.metadata
    });
    const rendered =
      isGeneratorSlug(body.style) && metadata.sourceType === "journal"
        ? renderJournalCitation(metadata, body.style)
        : await renderCitation(metadata, body.style, body.cslFile, {
            assetOrigin: request.url,
            nlmDatabase: env?.NLM_DB,
            disableJournalAbbreviation: true
          });
    const sourceLabels = [
      rendered.metadata.sourceLabel,
      rendered.metadata.abbreviationLabel
    ].filter(Boolean);

    return json({
      metadata: rendered.metadata,
      fullCitation: rendered.fullCitation,
      inTextCitation: rendered.inTextCitation,
      sourceLabels,
      warnings: rendered.metadata.warnings
    });
  } catch (error) {
    if (error instanceof MetadataError) {
      return json(
        {
          error: error.message,
          code: error.code
        },
        error.status
      );
    }

    console.error("Citation API failed.", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return json(
      {
        error: error instanceof Error ? error.message : "Citation generation failed."
      },
      500
    );
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

export function renderJournalCitation(metadata: CitationMetadata, style: GeneratorSlug) {
  const year = metadata.issued?.year ? String(metadata.issued.year) : "n.d.";
  const title = endWith(metadata.title || "Untitled source", ".");
  const journal = metadata.containerTitle || "Journal";
  const volumeIssue = formatVolumeIssue(metadata.volume, metadata.issue);
  const pageRange = metadata.page ? formatPages(metadata.page, style) : "";
  const doiOrUrl = formatDoiOrUrl(metadata);
  const numericLabel = style === "ieee" ? "[1]" : "1.";

  const fullCitationByStyle: Record<GeneratorSlug, string> = {
    apa: joinCitationParts([
      formatAuthors(metadata.authors, "apa"),
      `(${year}).`,
      title,
      journalWithVolume(journal, metadata.volume, metadata.issue, "comma"),
      pageRange,
      doiOrUrl
    ]),
    harvard: joinCitationParts([
      formatAuthors(metadata.authors, "harvard"),
      year,
      quoteTitle(metadata.title),
      journal,
      metadata.volume ? `vol. ${metadata.volume}` : "",
      metadata.issue ? `no. ${metadata.issue}` : "",
      pageRange,
      doiOrUrl
    ]),
    chicago: joinCitationParts([
      formatAuthors(metadata.authors, "chicago"),
      `${year}.`,
      quoteTitle(metadata.title),
      `${journal}${volumeIssue ? ` ${volumeIssue}` : ""}${metadata.page ? `: ${metadata.page}` : ""}.`,
      doiOrUrl
    ]),
    turabian: joinCitationParts([
      formatAuthors(metadata.authors, "turabian"),
      quoteTitle(metadata.title),
      `${journal}${metadata.volume ? ` ${metadata.volume}` : ""}${metadata.issue ? `, no. ${metadata.issue}` : ""} (${year})${metadata.page ? `: ${metadata.page}` : ""}.`,
      doiOrUrl
    ]),
    mla: joinCitationParts([
      formatAuthors(metadata.authors, "mla"),
      quoteTitle(metadata.title),
      journal + ",",
      metadata.volume ? `vol. ${metadata.volume},` : "",
      metadata.issue ? `no. ${metadata.issue},` : "",
      `${year},`,
      pageRange,
      doiOrUrl
    ]),
    cse: joinCitationParts([
      formatAuthors(metadata.authors, "cse"),
      `${year}.`,
      title,
      `${journal}.${volumeIssue ? ` ${volumeIssue}` : ""}${metadata.page ? `:${metadata.page}` : ""}.`,
      formatDoi(metadata)
    ]),
    ama: joinCitationParts([
      numericLabel,
      formatAuthors(metadata.authors, "ama"),
      title,
      `${journal}.${year};${volumeIssue || metadata.volume || ""}${metadata.page ? `:${metadata.page}` : ""}.`,
      formatDoi(metadata)
    ]),
    vancouver: joinCitationParts([
      numericLabel,
      formatAuthors(metadata.authors, "vancouver"),
      title,
      `${journal}.${year};${volumeIssue || metadata.volume || ""}${metadata.page ? `:${metadata.page}` : ""}.`,
      formatDoi(metadata)
    ]),
    ieee: joinCitationParts([
      numericLabel,
      formatAuthors(metadata.authors, "ieee"),
      quoteTitle(metadata.title),
      `${journal}${metadata.volume ? `, vol. ${metadata.volume}` : ""}${metadata.issue ? `, no. ${metadata.issue}` : ""}${metadata.page ? `, pp. ${metadata.page}` : ""}, ${year}.`,
      formatDoi(metadata)
    ]),
    acs: joinCitationParts([
      formatAuthors(metadata.authors, "acs"),
      title,
      `${journal} ${year}${metadata.volume ? `, ${metadata.volume}` : ""}${metadata.issue ? ` (${metadata.issue})` : ""}${metadata.page ? `, ${metadata.page}` : ""}.`,
      doiOrUrl
    ])
  };

  return {
    metadata,
    fullCitation: cleanupCitation(fullCitationByStyle[style]),
    inTextCitation: formatInTextCitation(metadata, style)
  };
}

function formatAuthors(authors: Contributor[], style: GeneratorSlug) {
  if (!authors.length) return "";

  if (style === "ama" || style === "vancouver" || style === "acs") {
    return authors
      .slice(0, 6)
      .map((author) => `${author.family ?? author.literal ?? ""} ${initials(author.given)}`.trim())
      .filter(Boolean)
      .join(", ");
  }

  if (style === "ieee") {
    return authors
      .map((author) => {
        if (author.literal) return author.literal;
        return [initials(author.given), author.family].filter(Boolean).join(" ");
      })
      .filter(Boolean)
      .join(", ");
  }

  if (style === "mla") {
    const [first, ...rest] = authors;
    const firstAuthor = formatSurnameFirst(first, false);
    if (!rest.length) return firstAuthor;
    if (rest.length === 1) return `${firstAuthor}, and ${formatGivenFirst(rest[0])}`;
    return `${firstAuthor}, et al.`;
  }

  if (style === "apa") {
    return authors
      .map((author) => {
        if (author.literal) return author.literal;
        return `${author.family ?? ""}, ${initials(author.given)}`.trim().replace(/\s+,/g, ",");
      })
      .filter(Boolean)
      .join(", ");
  }

  if (style === "harvard" || style === "chicago" || style === "turabian") {
    return authors
      .map((author) => formatSurnameFirst(author, false))
      .filter(Boolean)
      .join(", ");
  }

  if (style === "cse") {
    return authors
      .map((author) => {
        if (author.literal) return author.literal;
        return `${author.family ?? ""} ${initials(author.given).replace(/\s+/g, "")}`.trim();
      })
      .filter(Boolean)
      .join(", ");
  }

  return authors
    .map((author) => (author.literal ? author.literal : formatGivenFirst(author)))
    .filter(Boolean)
    .join(", ");
}

function formatInTextCitation(metadata: CitationMetadata, style: GeneratorSlug) {
  if (style === "ama" || style === "acs" || style === "vancouver") return "1";
  if (style === "ieee") return "[1]";

  const year = metadata.issued?.year ? String(metadata.issued.year) : "n.d.";
  const authorText = formatInTextAuthor(metadata.authors);

  if (style === "mla") return `(${authorText})`;
  return `(${authorText} ${year})`;
}

function formatInTextAuthor(authors: Contributor[]) {
  if (!authors.length) return "Source";
  if (authors.length === 1) return authors[0].family ?? authors[0].literal ?? "Source";
  if (authors.length === 2) {
    return `${authors[0].family ?? authors[0].literal ?? "Source"} and ${authors[1].family ?? authors[1].literal ?? "Source"}`;
  }
  return `${authors[0].family ?? authors[0].literal ?? "Source"} et al.`;
}

function formatGivenFirst(author: Contributor) {
  if (author.literal) return author.literal;
  return [author.given, author.family].filter(Boolean).join(" ").trim();
}

function formatSurnameFirst(author: Contributor, useInitials: boolean) {
  if (author.literal) return author.literal;
  const given = useInitials ? initials(author.given) : author.given;
  return [author.family, given].filter(Boolean).join(", ").trim();
}

function initials(value?: string) {
  if (!value) return "";
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}.`)
    .join(" ");
}

function quoteTitle(title?: string) {
  const normalizedTitle = (title || "Untitled source").replace(/[.?!]+$/g, "");
  return `“${normalizedTitle}.”`;
}

function journalWithVolume(
  journal: string,
  volume?: string,
  issue?: string,
  mode: "comma" | "plain" = "plain"
) {
  if (!volume) return `${journal}.`;
  if (!issue) return mode === "comma" ? `${journal}, ${volume}.` : `${journal}, ${volume}`;
  return mode === "comma" ? `${journal}, ${volume}(${issue}).` : `${journal} ${volume}(${issue})`;
}

function formatVolumeIssue(volume?: string, issue?: string) {
  if (volume && issue) return `${volume}(${issue})`;
  return volume || issue || "";
}

function formatPages(page: string, style: GeneratorSlug) {
  if (style === "mla" || style === "ieee") return `pp. ${page}`;
  if (style === "harvard") return `pp. ${page}`;
  return page;
}

function formatDoi(metadata: CitationMetadata) {
  if (metadata.DOI) return `doi:${metadata.DOI}`;
  if (metadata.URL) return metadata.URL;
  return "";
}

function formatDoiOrUrl(metadata: CitationMetadata) {
  if (metadata.DOI) return `https://doi.org/${metadata.DOI}`;
  return metadata.URL || "";
}

function joinCitationParts(parts: string[]) {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function endWith(value: string, suffix: string) {
  return value.endsWith(suffix) ? value : `${value}${suffix}`;
}

function cleanupCitation(value: string) {
  return value
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\. \./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}
