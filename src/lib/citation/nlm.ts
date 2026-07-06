import { acsAbbreviationPatches } from "./nlm-patches";
import type { DataProvider } from "@/lib/metadata/types";

type AbbreviationLookup = {
  title: string;
  abbreviation: string;
  label: string;
  provider: DataProvider;
};

type NlmRow = {
  journal_title: string;
  med_abbr: string | null;
  iso_abbr: string | null;
};

export type D1DatabaseLike = {
  prepare(query: string): D1PreparedStatementLike;
};

type D1PreparedStatementLike = {
  bind(...values: string[]): D1PreparedStatementLike;
  first<T>(): Promise<T | null>;
};

const journalLookupSql = `
  select journal_title, med_abbr, iso_abbr
  from journals
  where normalized_title = ?
     or normalized_med_abbr = ?
     or normalized_iso_abbr = ?
  limit 1
`;

let unavailableWarningShown = false;
let normalizedAcsPatches: Map<string, string> | undefined;

export async function lookupJournalAbbreviation(
  journalTitle: string | undefined,
  styleSlug: string,
  assetOrigin?: string,
  database?: D1DatabaseLike
): Promise<AbbreviationLookup | undefined> {
  if (!journalTitle) return undefined;
  const normalizedTitle = normalizeJournalName(journalTitle);
  if (!normalizedTitle) return undefined;

  const nlmRow = await lookupNlmRow(normalizedTitle, assetOrigin, database);
  if (nlmRow) {
    const baseAbbreviation = nlmRow.iso_abbr || nlmRow.med_abbr;
    if (baseAbbreviation) {
      return {
        title: nlmRow.journal_title,
        abbreviation: styleSlug === "acs" ? addAcsPeriods(baseAbbreviation) : baseAbbreviation,
        label: "Abbreviation from NLM",
        provider: "nlm"
      };
    }
  }

  const patch = getNormalizedAcsPatches().get(normalizedTitle);
  if (patch && styleSlug === "acs") {
    return {
      title: journalTitle,
      abbreviation: patch,
      label: "Abbreviation from ACS patch",
      provider: "acs-fallback"
    };
  }

  if (styleSlug === "acs") {
    const fallback = abbreviateWithAcsRule(journalTitle);
    if (fallback !== journalTitle) {
      return {
        title: journalTitle,
        abbreviation: fallback,
        label: "Abbreviation from ACS fallback rule",
        provider: "acs-fallback"
      };
    }
  }

  return undefined;
}

function getNormalizedAcsPatches() {
  if (normalizedAcsPatches) return normalizedAcsPatches;
  normalizedAcsPatches = new Map(
    Object.entries(acsAbbreviationPatches).map(([title, abbreviation]) => [
      normalizeJournalName(title),
      abbreviation
    ])
  );
  return normalizedAcsPatches;
}

export function normalizeJournalName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|journal|of)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function lookupNlmRow(
  normalizedTitle: string,
  _assetOrigin?: string,
  database?: D1DatabaseLike
): Promise<NlmRow | undefined> {
  if (database) {
    const row = await lookupD1Row(database, normalizedTitle);
    if (row) return row;
  }

  const d1Row = await lookupCloudflareD1Row(normalizedTitle);
  if (d1Row) return d1Row;

  warnNlmUnavailable();
  return undefined;
}

async function lookupCloudflareD1Row(normalizedTitle: string): Promise<NlmRow | undefined> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const cloudflareContext = await getCloudflareContext({ async: true });
    const env = cloudflareContext.env as { NLM_DB?: D1DatabaseLike };
    if (!env.NLM_DB) return undefined;

    const row = await lookupD1Row(env.NLM_DB, normalizedTitle);
    return normalizeNlmRow(row);
  } catch {
    return undefined;
  }
}

async function lookupD1Row(database: D1DatabaseLike, normalizedTitle: string) {
  return database
    .prepare(journalLookupSql)
    .bind(normalizedTitle, normalizedTitle, normalizedTitle)
    .first<NlmRow>();
}

function normalizeNlmRow(row: unknown): NlmRow | undefined {
  if (!row || typeof row !== "object") return undefined;
  const candidate = row as Partial<NlmRow>;
  if (!candidate.journal_title) return undefined;
  return {
    journal_title: String(candidate.journal_title),
    med_abbr: candidate.med_abbr ? String(candidate.med_abbr) : null,
    iso_abbr: candidate.iso_abbr ? String(candidate.iso_abbr) : null
  };
}

function warnNlmUnavailable() {
  if (unavailableWarningShown) return;
  unavailableWarningShown = true;
  console.warn(
    "NLM journal database is unavailable. Configure the NLM_DB D1 binding for journal abbreviation lookups."
  );
}

function addAcsPeriods(value: string) {
  return value
    .split(/\s+/)
    .map((part) => {
      if (!part) return part;
      if (/[().,]$/.test(part)) return part;
      if (/^(and|of|the|in|for|on)$/i.test(part)) return part;
      if (/^[A-Z]{2,}$/.test(part)) return part;
      return `${part}.`;
    })
    .join(" ")
    .replace(/\s+,/g, ",");
}

function abbreviateWithAcsRule(value: string) {
  const replacements: Record<string, string> = {
    advanced: "Adv.",
    advances: "Adv.",
    american: "Am.",
    analytical: "Anal.",
    applied: "Appl.",
    biological: "Biol.",
    biology: "Biol.",
    chemical: "Chem.",
    chemistry: "Chem.",
    communications: "Commun.",
    computational: "Comput.",
    engineering: "Eng.",
    environmental: "Environ.",
    information: "Inf.",
    international: "Int.",
    journal: "J.",
    materials: "Mater.",
    medicinal: "Med.",
    molecular: "Mol.",
    nanotechnology: "Nanotechnol.",
    organic: "Org.",
    physical: "Phys.",
    polymer: "Polym.",
    research: "Res.",
    science: "Sci.",
    society: "Soc.",
    sustainable: "Sustainable",
    technology: "Technol.",
    theoretical: "Theor."
  };

  const words = value
    .replace(/&/g, "and")
    .split(/\s+/)
    .filter((word) => !/^(of|the|and)$/i.test(word));

  const abbreviated = words
    .map((word) => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, "");
      return replacements[clean] ?? word;
    })
    .join(" ");

  return abbreviated.trim();
}
