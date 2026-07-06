import fs from "node:fs/promises";
import path from "node:path";
import Database from "better-sqlite3";

const dataDir = path.join(process.cwd(), "data");
const sqlitePath = path.join(dataDir, "nlm-journals.sqlite");
const outputPath = path.join(dataDir, "nlm-journals-d1.sql");

const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
const rows = db
  .prepare(
    `
      select
        id,
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
      from journals
      order by id
    `
  )
  .all();

const columns = [
  "id",
  "jr_id",
  "journal_title",
  "med_abbr",
  "iso_abbr",
  "issn_print",
  "issn_online",
  "nlm_id",
  "normalized_title",
  "normalized_med_abbr",
  "normalized_iso_abbr"
];

const lines = ["delete from journals;"];

for (const row of rows) {
  const values = columns.map((column) => sqlValue(row[column]));
  lines.push(`insert into journals (${columns.join(", ")}) values (${values.join(", ")});`);
}

await fs.writeFile(outputPath, `${lines.join("\n")}\n`);
db.close();

console.log(`Exported ${rows.length} NLM rows to ${outputPath}`);

function sqlValue(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}
