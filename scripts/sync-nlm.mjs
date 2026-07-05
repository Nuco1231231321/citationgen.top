import fs from "node:fs/promises";
import path from "node:path";
import Database from "better-sqlite3";

const sourceUrl = "https://ftp.ncbi.nlm.nih.gov/pubmed/J_Entrez.txt";
const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "nlm-journals.sqlite");

await fs.mkdir(dataDir, { recursive: true });

const response = await fetch(sourceUrl);
if (!response.ok) {
  throw new Error(`Failed to download NLM J_Entrez.txt: ${response.status}`);
}

const text = await response.text();
const blocks = text
  .split("--------------------------------------------------------")
  .map((block) => block.trim())
  .filter(Boolean);

const rows = blocks
  .map(parseBlock)
  .filter((row) => row.journal_title && (row.med_abbr || row.iso_abbr));

await fs.rm(dbPath, { force: true });
const db = new Database(dbPath);
db.pragma("journal_mode = DELETE");
db.exec(`
  create table journals (
    id integer primary key,
    jr_id text,
    journal_title text not null,
    med_abbr text,
    iso_abbr text,
    issn_print text,
    issn_online text,
    nlm_id text,
    normalized_title text not null,
    normalized_med_abbr text,
    normalized_iso_abbr text
  );
  create index journals_normalized_title_idx on journals(normalized_title);
  create index journals_normalized_med_abbr_idx on journals(normalized_med_abbr);
  create index journals_normalized_iso_abbr_idx on journals(normalized_iso_abbr);
`);

const insert = db.prepare(`
  insert into journals (
    jr_id,
    journal_title,
    med_abbr,
    iso_abbr,
    issn_print,
    issn_online,
    nlm_id,
    normalized_title,
    normalized_med_abbr,
    normalized_iso_abbr
  )
  values (
    @jr_id,
    @journal_title,
    @med_abbr,
    @iso_abbr,
    @issn_print,
    @issn_online,
    @nlm_id,
    @normalized_title,
    @normalized_med_abbr,
    @normalized_iso_abbr
  )
`);

const transaction = db.transaction((items) => {
  for (const row of items) insert.run(row);
});

transaction(
  rows.map((row) => ({
    ...row,
    normalized_title: normalizeJournalName(row.journal_title),
    normalized_med_abbr: row.med_abbr ? normalizeJournalName(row.med_abbr) : null,
    normalized_iso_abbr: row.iso_abbr ? normalizeJournalName(row.iso_abbr) : null
  }))
);

db.close();
console.log(`Synced ${rows.length} NLM journal records to ${dbPath}`);

function parseBlock(block) {
  const record = {};
  for (const line of block.split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    record[key] = value || null;
  }

  return {
    jr_id: record.JrId,
    journal_title: record.JournalTitle,
    med_abbr: record.MedAbbr,
    iso_abbr: record.IsoAbbr,
    issn_print: record["ISSN (Print)"],
    issn_online: record["ISSN (Online)"],
    nlm_id: record.NlmId
  };
}

function normalizeJournalName(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|journal|of)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
