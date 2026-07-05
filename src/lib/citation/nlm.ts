import nlmData from "./nlm-data.json";
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

type NlmData = {
  values: Array<[string, string, string]>;
  map: Record<string, number>;
};

let normalizedAcsPatches: Map<string, string> | undefined;

export function lookupJournalAbbreviation(
  journalTitle: string | undefined,
  styleSlug: string
): AbbreviationLookup | undefined {
  if (!journalTitle) return undefined;
  const normalizedTitle = normalizeJournalName(journalTitle);
  if (!normalizedTitle) return undefined;

  const nlmRow = lookupNlmRow(normalizedTitle);
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

function lookupNlmRow(normalizedTitle: string): NlmRow | undefined {
  const data = nlmData as unknown as NlmData;
  const rowIndex = data.map[normalizedTitle];
  if (rowIndex === undefined) return undefined;

  const row = data.values[rowIndex];
  if (!row) return undefined;

  return {
    journal_title: row[0],
    med_abbr: row[1] || null,
    iso_abbr: row[2] || null
  };
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
