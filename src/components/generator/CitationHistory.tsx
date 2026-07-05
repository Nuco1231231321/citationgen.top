"use client";

import { useState } from "react";
import { ClipboardText, ClockCounterClockwise } from "@phosphor-icons/react";
import { useCitationHistory } from "@/hooks/useCitationHistory";
import { generatorFormats } from "@/lib/formats";
import { cn, stripHtml } from "@/lib/utils";

export function CitationHistory() {
  const { entries, clearHistory } = useCitationHistory();
  const [expanded, setExpanded] = useState(false);

  if (!entries.length) return null;

  return (
    <div className="rounded-3xl bg-surface mt-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClockCounterClockwise aria-hidden="true" size={20} className="text-dim" />
          <div>
            <p className="text-sm font-medium text-ink">Recent citations</p>
            <p className="text-xs text-faint">
              {entries.length} citation{entries.length !== 1 ? "s" : ""} saved on this device
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="rounded-lg px-2 py-1 text-xs text-faint underline underline-offset-2 hover:text-dim"
        >
          Clear all
        </button>
      </div>

      <div
        className={cn(
          "mt-4 divide-y divide-line",
          !expanded ? "max-h-[280px] overflow-hidden" : ""
        )}
      >
        {entries.map((entry) => {
          const format = generatorFormats[entry.styleSlug as keyof typeof generatorFormats];
          const date = new Date(entry.createdAt).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            minute: "2-digit",
            hour: "2-digit"
          });
          const fullCitation = stripHtml(entry.fullCitation);

          return (
            <div key={entry.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-subtle px-2 py-0.5 text-[10px] font-medium text-dim">
                      {format?.label ?? entry.styleSlug.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-faint">{date}</span>
                  </div>
                  <p className="citation-hanging mt-2 text-xs leading-5 text-dim line-clamp-2">
                    {fullCitation}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.sourceLabels.map((label) => (
                      <span
                        key={label}
                        className="rounded-md bg-surface px-2 py-0.5 text-[10px] text-faint"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(fullCitation)
                      .catch((error) => console.warn("Could not copy history citation.", error));
                  }}
                  className="shrink-0 rounded-lg p-1.5 text-dim transition-colors hover:bg-subtle hover:text-ink"
                  aria-label="Copy full citation"
                >
                  <ClipboardText size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {entries.length > 3 ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm font-medium text-dim underline underline-offset-2 hover:text-ink"
        >
          {expanded ? "Show fewer" : `Show all ${entries.length} citations`}
        </button>
      ) : null}
    </div>
  );
}
