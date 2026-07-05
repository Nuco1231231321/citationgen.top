"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ClipboardText,
  DownloadSimple,
  Trash
} from "@phosphor-icons/react";
import { generatorFormats } from "@/lib/formats";
import type { GeneratorSlug } from "@/lib/formats";
import type { LibraryEntry } from "@/hooks/useCitationLibrary";

type CitationLibraryProps = {
  items: LibraryEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

const NUMERIC_STYLES = new Set<GeneratorSlug>(["ama", "acs", "ieee", "vancouver"]);

export function CitationLibrary({ items, onRemove, onClear }: CitationLibraryProps) {
  const [copied, setCopied] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const sortedItems = useMemo(() => sortLibraryItems(items), [items]);
  const plainText = useMemo(() => buildPlainText(sortedItems), [sortedItems]);
  const richHtml = useMemo(() => buildRichHtml(sortedItems), [sortedItems]);
  const htmlText = useMemo(() => buildHtmlDocument(richHtml), [richHtml]);

  async function copyLibrary() {
    if (!plainText) return;
    try {
      await writeClipboard(plainText, richHtml);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function copyLibraryItem(item: LibraryEntry, index: number) {
    try {
      await writeClipboard(buildItemPlainText(item, index), buildItemHtml(item, index));
      setCopiedItemId(item.id);
      window.setTimeout(() => setCopiedItemId(""), 1800);
    } catch {
      setCopiedItemId("");
    }
  }

  function downloadLibrary(format: "txt" | "html") {
    const content = format === "txt" ? plainText : htmlText;
    if (!content) return;

    const blob = new Blob([content], {
      type: format === "txt" ? "text/plain;charset=utf-8" : "text/html;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reference-library-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function confirmClearLibrary() {
    onClear();
    setConfirmClear(false);
  }

  if (!items.length) {
    return (
      <section className="rounded-3xl bg-surface mt-6 p-6" aria-labelledby="citation-library-heading">
        <div className="grid gap-3 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-subtle text-dim">
            <BookOpen aria-hidden="true" size={20} />
          </div>
          <div>
            <h2 id="citation-library-heading" className="font-editorial text-xl leading-snug text-ink">
              Reference library
            </h2>
            <p className="mx-auto mt-2 max-w-[48ch] text-pretty text-sm leading-6 text-dim">
              Generate a citation, review the fields, then choose Add to library to build a copy-ready bibliography.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-surface mt-6 p-6" aria-labelledby="citation-library-heading">
      <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 id="citation-library-heading" className="font-editorial text-xl leading-snug text-ink">
            Reference library
          </h2>
          <p className="mt-1 text-sm leading-6 text-dim">
            {items.length} saved citation{items.length !== 1 ? "s" : ""}. Copy or export the list when your draft is ready.
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            {copied ? "Reference library copied." : copiedItemId ? "Citation copied." : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyLibrary}
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-page transition-colors hover:bg-[#2a2a25]"
          >
            {copied ? <Check aria-hidden="true" size={16} /> : <ClipboardText aria-hidden="true" size={16} />}
            {copied ? "Copied" : "Copy all"}
          </button>
          <button
            type="button"
            onClick={() => downloadLibrary("txt")}
            className="inline-flex items-center gap-2 rounded-xl bg-subtle px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-line"
          >
            <DownloadSimple aria-hidden="true" size={16} />
            TXT
          </button>
          <button
            type="button"
            onClick={() => downloadLibrary("html")}
            className="inline-flex items-center gap-2 rounded-xl bg-subtle px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-line"
          >
            <DownloadSimple aria-hidden="true" size={16} />
            HTML
          </button>
          {confirmClear ? (
            <span className="inline-flex items-center gap-2 rounded-xl bg-subtle p-1">
              <button
                type="button"
                onClick={confirmClearLibrary}
                className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-page"
              >
                Confirm clear
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-dim hover:bg-surface hover:text-ink"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-faint underline underline-offset-2 transition-colors hover:text-ink"
            >
              Clear library
            </button>
          )}
        </div>
      </div>

      <ol className="mt-5 grid gap-3">
        {sortedItems.map((item, index) => {
          const format = generatorFormats[item.styleSlug];
          const displayIndex = NUMERIC_STYLES.has(item.styleSlug) ? `[${index + 1}]` : `${index + 1}`;
          const itemCopied = copiedItemId === item.id;

          return (
            <li key={item.id} className="rounded-2xl bg-subtle p-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-lg bg-surface px-2 py-1 text-xs tabular-nums text-dim">
                  {displayIndex}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-dim">
                      {format?.label ?? item.styleSlug.toUpperCase()}
                    </span>
                    {item.sourceLabels.map((label) => (
                      <span key={label} className="rounded-md bg-surface px-2 py-0.5 text-[11px] text-faint">
                        {label}
                      </span>
                    ))}
                  </div>
                  <p className="citation-hanging mt-2 text-pretty text-sm leading-6 text-ink">
                    {item.fullCitation}
                  </p>
                  {item.inTextCitation ? (
                    <p className="mt-2 text-xs leading-5 text-dim">
                      In-text: <span className="text-ink">{item.inTextCitation}</span>
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => copyLibraryItem(item, index)}
                  className="shrink-0 rounded-lg p-2 text-faint transition-colors hover:bg-surface hover:text-ink"
                  aria-label={`Copy citation ${index + 1}`}
                >
                  {itemCopied ? (
                    <Check aria-hidden="true" size={16} />
                  ) : (
                    <ClipboardText aria-hidden="true" size={16} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="shrink-0 rounded-lg p-2 text-faint transition-colors hover:bg-surface hover:text-ink"
                  aria-label={`Remove citation ${index + 1} from library`}
                >
                  <Trash aria-hidden="true" size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function sortLibraryItems(items: LibraryEntry[]) {
  return [...items].sort((a, b) => {
    if (a.styleSlug !== b.styleSlug) return a.addedAt - b.addedAt;
    if (NUMERIC_STYLES.has(a.styleSlug)) return a.addedAt - b.addedAt;
    return getSortKey(a).localeCompare(getSortKey(b));
  });
}

function getSortKey(item: LibraryEntry) {
  const firstAuthor = item.metadata.authors[0];
  return (
    firstAuthor?.literal ??
    firstAuthor?.family ??
    item.metadata.title ??
    item.fullCitation
  ).toLowerCase();
}

function buildPlainText(items: LibraryEntry[]) {
  if (!items.length) return "";

  return items.map((item, index) => buildItemPlainText(item, index)).join("\n\n");
}

function buildItemPlainText(item: LibraryEntry, index: number) {
  if (NUMERIC_STYLES.has(item.styleSlug)) {
    return `[${index + 1}] ${stripNumericPrefix(item.fullCitation)}`;
  }
  return item.fullCitation;
}

function buildRichHtml(items: LibraryEntry[]) {
  return items.map((item, index) => buildItemHtml(item, index)).join("\n");
}

function buildItemHtml(item: LibraryEntry, index: number) {
  const citation = buildItemPlainText(item, index);
  const className = NUMERIC_STYLES.has(item.styleSlug) ? "citation" : "citation hanging";

  return `<p class="${className}">${escapeHtml(citation)}</p>`;
}

function buildHtmlDocument(rows: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Reference library</title>
  <style>
    body { background: #f8f8f6; color: #121212; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; margin: 0; padding: 48px; }
    main { max-width: 820px; margin: 0 auto; }
    h1 { font-family: Georgia, serif; font-weight: 400; font-size: 30px; line-height: 1.2; margin: 0 0 28px; }
    .citation { margin: 0 0 18px; font-size: 14px; }
    .hanging { padding-left: 36px; text-indent: -36px; }
  </style>
</head>
<body>
  <main>
    <h1>Reference library</h1>
    ${rows}
  </main>
</body>
</html>`;
}

async function writeClipboard(plainText: string, htmlText: string) {
  const canWriteRichText =
    typeof ClipboardItem !== "undefined" &&
    typeof navigator.clipboard.write === "function";

  if (canWriteRichText) {
    const clipboardItem = new ClipboardItem({
      "text/html": new Blob([htmlText], { type: "text/html" }),
      "text/plain": new Blob([plainText], { type: "text/plain" })
    });

    await navigator.clipboard.write([clipboardItem]);
    return;
  }

  await navigator.clipboard.writeText(plainText);
}

function stripNumericPrefix(value: string) {
  return value.replace(/^\s*(?:\[\d+\]|\d+[.)])\s*/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
