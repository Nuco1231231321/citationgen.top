"use client";

import type { CitationMetadata, CitationResponse } from "@/lib/metadata/types";
import { BookOpen, Check, ClipboardText, DownloadSimple } from "@phosphor-icons/react";
import { downloadRis } from "@/lib/export-ris";
import { useState } from "react";
import {
  contributorsToInputValue
} from "@/lib/metadata/contributors";

type GeneratorOutputProps = {
  result: CitationResponse;
  copyText: (value: string, label: string) => Promise<void>;
  compact?: boolean;
  onAddToLibrary?: () => void;
  libraryAdded?: boolean;
};

function formatDateParts(date?: CitationMetadata["issued"]) {
  if (!date?.year) return "";
  return [date.year, date.month, date.day].filter(Boolean).join("-");
}

function resultFields(metadata: CitationMetadata) {
  return [
    {
      label: "Title",
      value: metadata.title || "No title found"
    },
    {
      label: "Authors",
      value: contributorsToInputValue(metadata.authors) || "No author found"
    },
    {
      label: "Date",
      value: formatDateParts(metadata.issued) || "No date found"
    },
    {
      label: "Identifier",
      value: metadata.DOI
        ? `doi:${metadata.DOI}`
        : metadata.ISBN
          ? `ISBN ${metadata.ISBN}`
          : metadata.URL || "No DOI, ISBN, or URL found"
    }
  ];
}

export function GeneratorOutput({
  result,
  copyText,
  compact = false,
  onAddToLibrary,
  libraryAdded = false
}: GeneratorOutputProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const checkedFields = resultFields(result.metadata);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {result.warnings.length > 0 && (
        <WarningsPanel warnings={result.warnings} />
      )}

      <div className="rounded-2xl bg-subtle p-5">
        <p className="text-xs font-semibold text-ink">Full citation</p>
        <p className="citation-hanging mt-2 text-pretty text-sm leading-6 text-ink">
          {result.fullCitation}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => copyText(result.fullCitation, "Full citation")}
            className="inline-flex items-center gap-2 rounded-xl bg-ink text-page px-5 py-2.5 text-sm font-semibold hover:bg-[#2a2a25] transition cursor-pointer border-none"
          >
            <ClipboardText aria-hidden="true" size={17} />
            Copy full citation
          </button>

          {onAddToLibrary ? (
            <button
              type="button"
              onClick={onAddToLibrary}
              className="inline-flex items-center gap-2 rounded-xl bg-surface text-ink px-5 py-2.5 text-sm font-medium hover:bg-line transition cursor-pointer"
            >
              {libraryAdded ? <Check aria-hidden="true" size={17} /> : <BookOpen aria-hidden="true" size={17} />}
              {libraryAdded ? "Update library" : "Add to library"}
            </button>
          ) : null}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-surface text-ink px-5 py-2.5 text-sm font-medium hover:bg-line transition cursor-pointer"
            >
              <DownloadSimple aria-hidden="true" size={17} />
              Export
            </button>

            {showExportMenu && (
              <div className="absolute bottom-full left-0 z-20 mb-2 min-w-[200px] rounded-2xl bg-surface p-2 shadow-lg ring-1 ring-black/5">
                <button
                  type="button"
                  onClick={() => {
                    downloadRis(result.metadata);
                    setShowExportMenu(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-ink hover:bg-subtle transition-colors"
                >
                  Download .ris
                </button>
                <div className="mx-3 my-1 h-px bg-line" />
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                    setShowExportMenu(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-ink hover:bg-subtle transition-colors"
                >
                  Print / Save as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-subtle p-5">
        <p className="text-xs font-semibold text-ink">In-text citation</p>
        <p className="mt-2 text-sm leading-6 text-ink">
          {result.inTextCitation || "Not provided"}
        </p>
        <button
          type="button"
          onClick={() => copyText(result.inTextCitation, "In-text citation")}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-surface text-ink px-5 py-2.5 text-sm font-medium hover:bg-line transition cursor-pointer"
        >
          <ClipboardText aria-hidden="true" size={17} />
          Copy in-text
        </button>
      </div>

      <div className="rounded-2xl bg-subtle/60 p-5">
        <p className="text-xs font-semibold text-ink">Data source</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {result.sourceLabels.map((label) => (
            <span key={label} className="bg-surface rounded-full px-3 py-1 text-xs font-medium text-ink">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-subtle/60 p-5">
        <p className="text-xs font-semibold text-ink">Fields used</p>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          {checkedFields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs text-dim">{field.label}</dt>
              <dd className="mt-0.5 text-sm text-ink">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function WarningsPanel({ warnings }: { warnings: string[] }) {
  return (
    <div className="rounded-2xl bg-[#faf6f0] p-4">
      <p className="text-sm font-medium text-ink">Check these fields</p>
      <ul className="mt-2 grid gap-1 text-sm leading-6 text-dim">
        {warnings.map((warning) => (
          <li key={warning} className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-amber-600" />
            {warning}
          </li>
        ))}
      </ul>
    </div>
  );
}
