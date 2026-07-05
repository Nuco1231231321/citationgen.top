import fs from "node:fs/promises";
import path from "node:path";

const stylesRepoUrl = "https://github.com/citation-style-language/styles.git";

const cslDir = path.join(process.cwd(), "data", "csl");
const stylesDir = path.join(cslDir, "all-styles");
const manifestPath = path.join(cslDir, "csl-manifest.json");

interface StyleEntry {
  filename: string;
  title: string;
  category: string;
  rawTitle: string;
}

async function buildManifest() {
  const entries: StyleEntry[] = [];

  async function scanDir(dir: string) {
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith(".")) continue;
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        await scanDir(fullPath);
      } else if (item.name.endsWith(".csl")) {
        const content = await fs.readFile(fullPath, "utf8");
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/);
        const rawTitle = titleMatch ? titleMatch[1].trim() : item.name.replace(".csl", "");
        const title = cleanStyleTitle(rawTitle);
        const category = extractCategory(item.name, rawTitle);
        entries.push({
          filename: path.relative(stylesDir, fullPath).replace(/\\/g, "/"),
          title,
          category,
          rawTitle
        });
      }
    }
  }

  try {
    await scanDir(stylesDir);
  } catch {
    console.log("No all-styles directory found. Run: git clone https://github.com/citation-style-language/styles.git data/csl/all-styles");
  }

  entries.sort((a, b) => a.title.localeCompare(b.title));
  await fs.writeFile(manifestPath, JSON.stringify(entries, null, 0), "utf8");
  console.log(`Built CSL manifest with ${entries.length} styles.`);
}

function cleanStyleTitle(raw: string): string {
  return raw
    .replace(/\s+\(.* Edition\)$/i, "")
    .replace(/\s*\[.*\]$/, "")
    .replace(/\.csl$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCategory(filename: string, rawTitle: string): string {
  const lower = (rawTitle + filename).toLowerCase();
  if (lower.includes("apa") || lower.includes("american psychological")) return "Psychology & Social Sciences";
  if (lower.includes("mla") || lower.includes("modern language")) return "Humanities";
  if (lower.includes("chicago") || lower.includes("turabian")) return "Humanities";
  if (lower.includes("harvard")) return "Referencing Systems";
  if (lower.includes("vancouver") || lower.includes("icmje") || lower.includes("nlm")) return "Medicine";
  if (lower.includes("ama") || lower.includes("american medical")) return "Medicine";
  if (lower.includes("acs") || lower.includes("american chemical") || lower.includes("rsc")) return "Chemistry";
  if (lower.includes("ieee")) return "Engineering";
  if (lower.includes("cse") || lower.includes("council of science")) return "Science";
  if (lower.includes("nature")) return "Science";
  if (lower.includes("cell")) return "Science";
  if (lower.includes("elsevier") || lower.includes("springer") || lower.includes("taylor") || lower.includes("wiley")) return "Publisher Styles";
  if (lower.includes("journal of") || lower.includes("society") || lower.includes("association")) return "Journal Styles";
  return "Other Styles";
}

buildManifest().catch(console.error);
