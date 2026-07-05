"use client";

import type { CitationMetadata } from "@/lib/metadata/types";
import { contributorsFromInput, contributorsToInputValue } from "@/lib/metadata/contributors";

type GeneratorEditProps = {
  metadata: CitationMetadata;
  onChange: (metadata: CitationMetadata) => void;
  onRegenerate: () => Promise<void>;
  loading: boolean;
};

const editableSourceTypes: Array<CitationMetadata["sourceType"]> = [
  "journal",
  "book",
  "website",
  "video"
];

const fieldClasses =
  "field px-4 py-2.5 placeholder:text-dim";

export function GeneratorEdit({
  metadata,
  onChange,
  onRegenerate,
  loading
}: GeneratorEditProps) {
  const authorValue = contributorsToInputValue(metadata.authors);

  function setField<K extends keyof CitationMetadata>(key: K, value: CitationMetadata[K]) {
    onChange({ ...metadata, [key]: value });
  }

  function setDateField(key: "year" | "month" | "day", value: string) {
    const number = value ? Number(value) : undefined;
    onChange({
      ...metadata,
      issued: {
        ...metadata.issued,
        [key]: Number.isFinite(number) ? number : undefined
      }
    });
  }

  return (
    <div className="rounded-3xl bg-surface border border-line p-6 md:p-8 mt-6">
      <div className="max-w-[640px] pb-5 border-b border-line/50">
        <p className="text-xs font-semibold uppercase tracking-wider text-faint">
          Editable metadata
        </p>
        <h2 className="font-editorial mt-3 text-[28px] leading-[1.2] text-ink">
          Edit source fields
        </h2>
        <p className="mt-2 text-pretty text-sm leading-6 text-dim">
          Change any field, then regenerate so the citation style rules are applied again.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Citation item type
          <select
            value={metadata.sourceType}
            onChange={(event) =>
              setField("sourceType", event.target.value as CitationMetadata["sourceType"])
            }
            className={fieldClasses}
          >
            {editableSourceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Authors
          <input
            value={authorValue}
            onChange={(event) => setField("authors", contributorsFromInput(event.target.value))}
            placeholder="Alireza Shokri; Lawrence Que"
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink md:col-span-2">
          Title
          <textarea
            value={metadata.title}
            onChange={(event) => setField("title", event.target.value)}
            rows={3}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Journal, site, or container
          <input
            value={metadata.containerTitle ?? ""}
            onChange={(event) => setField("containerTitle", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Short journal title
          <input
            value={metadata.containerTitleShort ?? ""}
            onChange={(event) => setField("containerTitleShort", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Year
          <input
            inputMode="numeric"
            value={metadata.issued?.year ?? ""}
            onChange={(event) => setDateField("year", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Month
          <input
            inputMode="numeric"
            value={metadata.issued?.month ?? ""}
            onChange={(event) => setDateField("month", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Day
          <input
            inputMode="numeric"
            value={metadata.issued?.day ?? ""}
            onChange={(event) => setDateField("day", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Volume
          <input
            value={metadata.volume ?? ""}
            onChange={(event) => setField("volume", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Issue
          <input
            value={metadata.issue ?? ""}
            onChange={(event) => setField("issue", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Pages
          <input
            value={metadata.page ?? ""}
            onChange={(event) => setField("page", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          DOI
          <input
            value={metadata.DOI ?? ""}
            onChange={(event) => setField("DOI", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          URL
          <input
            value={metadata.URL ?? ""}
            onChange={(event) => setField("URL", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Publisher
          <input
            value={metadata.publisher ?? ""}
            onChange={(event) => setField("publisher", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Publisher place
          <input
            value={metadata.publisherPlace ?? ""}
            onChange={(event) => setField("publisherPlace", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Edition
          <input
            value={metadata.edition ?? ""}
            onChange={(event) => setField("edition", event.target.value)}
            className={fieldClasses}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          ISBN
          <input
            value={metadata.ISBN ?? ""}
            onChange={(event) => setField("ISBN", event.target.value)}
            className={fieldClasses}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="action-primary mt-6 px-6"
      >
        Regenerate from fields
      </button>
    </div>
  );
}
