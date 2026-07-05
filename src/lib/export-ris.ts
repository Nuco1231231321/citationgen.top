import type { CitationMetadata } from "@/lib/metadata/types";

const RIS_TYPE_MAP: Record<string, string> = {
  journal: "JOUR",
  book: "BOOK",
  website: "ELEC",
  video: "VIDEO"
};

function risLine(tag: string, value: string | undefined): string {
  if (!value) return "";
  return `${tag}  - ${value}\r\n`;
}

function risAuthors(prefix: string, authors: CitationMetadata["authors"]): string {
  return authors
    .map((a) => {
      const name = a.literal ? a.literal : [a.family, a.given].filter(Boolean).join(", ");
      return `${prefix}  - ${name}\r\n`;
    })
    .join("");
}

export function generateRis(metadata: CitationMetadata): string {
  const lines: string[] = [];

  lines.push(risLine("TY", RIS_TYPE_MAP[metadata.sourceType] ?? "GEN"));

  lines.push(risAuthors("A1", metadata.authors));
  if (metadata.editors?.length) {
    lines.push(risAuthors("A2", metadata.editors));
  }

  lines.push(risLine("TI", metadata.title));
  lines.push(risLine("JO", metadata.containerTitle));
  lines.push(risLine("JA", metadata.containerTitleShort));
  lines.push(risLine("VL", metadata.volume));
  lines.push(risLine("IS", metadata.issue));

  if (metadata.page) {
    const pages = metadata.page.split(/[-–—]/);
    lines.push(risLine("SP", pages[0]?.trim()));
    if (pages[1]) lines.push(risLine("EP", pages[1]?.trim()));
  }

  lines.push(risLine("DO", metadata.DOI));
  lines.push(risLine("UR", metadata.URL));
  lines.push(risLine("PB", metadata.publisher));
  lines.push(risLine("CY", metadata.publisherPlace));
  lines.push(risLine("ET", metadata.edition));
  lines.push(risLine("SN", metadata.ISBN));
  lines.push(risLine("AB", metadata.abstract));

  if (metadata.issued?.year) {
    const date = [
      String(metadata.issued.year),
      metadata.issued.month ? String(metadata.issued.month).padStart(2, "0") : null,
      metadata.issued.day ? String(metadata.issued.day).padStart(2, "0") : null
    ]
      .filter(Boolean)
      .join("/");
    lines.push(risLine("PY", String(metadata.issued.year)));
    lines.push(risLine("DA", date));
  }

  lines.push(risLine("ER", ""));

  return lines.join("");
}

export function downloadRis(metadata: CitationMetadata, filename?: string) {
  const content = generateRis(metadata);
  const blob = new Blob([content], { type: "application/x-research-info-systems" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `citation-${metadata.id.slice(0, 8)}.ris`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
