"use client";

import type { CitationMetadata, CitationResponse } from "@/lib/metadata/types";
import { BookOpen, Check, ClipboardText, DownloadSimple } from "@phosphor-icons/react";
import { downloadRis } from "@/lib/export-ris";
import { useEffect, useId, useRef, useState } from "react";
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
  const exportMenuId = useId();
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const checkedFields = resultFields(result.metadata);
  const warningSummary =
    result.warnings.length > 0
      ? `${result.warnings.length} missing field${result.warnings.length !== 1 ? "s" : ""} need review.`
      : "No required-field warnings were returned.";

  useEffect(() => {
    if (!showExportMenu) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShowExportMenu(false);
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!exportMenuRef.current?.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [showExportMenu]);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {result.warnings.length > 0 && (
        <WarningsPanel warnings={result.warnings} />
      )}

      <div className="result-card result-card-primary p-5">
        <p className="text-xs font-semibold text-ink">Full citation</p>
        <p className="citation-hanging mt-2 text-pretty text-sm leading-6 text-ink">
          {result.fullCitation}
        </p>
        <div className="result-actions mt-4">
          <button
            type="button"
            onClick={() => copyText(result.fullCitation, "Full citation")}
            className="action-primary"
          >
            <ClipboardText aria-hidden="true" size={17} />
            Copy full citation
          </button>

          {onAddToLibrary ? (
            <button
              type="button"
              onClick={onAddToLibrary}
              className="action-secondary"
            >
              {libraryAdded ? <Check aria-hidden="true" size={17} /> : <BookOpen aria-hidden="true" size={17} />}
              {libraryAdded ? "Update library" : "Add to library"}
            </button>
          ) : null}

          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu((v) => !v)}
              aria-expanded={showExportMenu}
              aria-controls={showExportMenu ? exportMenuId : undefined}
              aria-haspopup="menu"
              className="action-secondary"
            >
              <DownloadSimple aria-hidden="true" size={17} />
              Export
            </button>

            {showExportMenu && (
              <div
                id={exportMenuId}
                role="menu"
                className="export-menu absolute bottom-full left-0 z-20 mb-2 min-w-[220px] p-2"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    downloadRis(result.metadata);
                    setShowExportMenu(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-ink transition-colors hover:bg-subtle"
                >
                  Download .ris
                </button>
                <div className="mx-3 my-1 h-px bg-line" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    window.print();
                    setShowExportMenu(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-ink transition-colors hover:bg-subtle"
                >
                  Print / Save as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="result-card p-5">
        <p className="text-xs font-semibold text-ink">In-text citation</p>
        <p className="mt-2 text-sm leading-6 text-ink">
          {result.inTextCitation || "Not provided"}
        </p>
        <button
          type="button"
          onClick={() => copyText(result.inTextCitation, "In-text citation")}
          className="action-secondary mt-4"
        >
          <ClipboardText aria-hidden="true" size={17} />
          Copy in-text
        </button>
      </div>

      <div className="result-card p-5">
        <p className="text-xs font-semibold text-ink">Data source</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {result.sourceLabels.map((label) => (
            <span key={label} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink ring-1 ring-line">
              {label}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-dim">
          Source labels show where the metadata came from. Public records can still be incomplete,
          so check the fields below before submitting or exporting.
        </p>
        <p className="mt-2 text-xs font-medium text-ink">{warningSummary}</p>
      </div>

      <div className="result-card p-5">
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
    <div className="result-card border-accent/30 bg-[#faf6f0] p-4">
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
