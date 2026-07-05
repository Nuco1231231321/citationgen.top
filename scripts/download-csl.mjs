import fs from "node:fs/promises";
import path from "node:path";

const styleFiles = [
  "american-medical-association.csl",
  "american-chemical-society.csl",
  "taylor-and-francis-council-of-science-editors-author-date.csl",
  "ieee.csl",
  "chicago-notes-bibliography-subsequent-author-title-17th-edition.csl",
  "chicago-author-date.csl",
  "chicago-fullnote-bibliography.csl",
  "modern-language-association.csl",
  "modern-language-association-8th-edition.csl",
  "nlm-citation-sequence.csl",
  "harvard-cite-them-right.csl",
  "harvard-imperial-college-london.csl",
  "apa.csl",
  "apa-6th-edition.csl",
  "vancouver-author-date.csl",
  "vancouver-brackets.csl",
  "ama-11th-edition.csl"
];

const styleBase = "https://raw.githubusercontent.com/citation-style-language/styles/master";
const localeUrl =
  "https://raw.githubusercontent.com/citation-style-language/locales/master/locales-en-US.xml";

const outputDir = path.join(process.cwd(), "data", "csl");
await fs.mkdir(outputDir, { recursive: true });

for (const file of styleFiles) {
  const response = await fetch(`${styleBase}/${file}`);
  if (!response.ok) {
    throw new Error(`Failed to download ${file}: ${response.status}`);
  }
  await fs.writeFile(path.join(outputDir, file), await response.text(), "utf8");
  console.log(`Downloaded ${file}`);
}

const localeResponse = await fetch(localeUrl);
if (!localeResponse.ok) {
  throw new Error(`Failed to download locales-en-US.xml: ${localeResponse.status}`);
}
await fs.writeFile(path.join(outputDir, "locales-en-US.xml"), await localeResponse.text(), "utf8");
console.log("Downloaded locales-en-US.xml");
