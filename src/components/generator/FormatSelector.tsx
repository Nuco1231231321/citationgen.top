"use client";

import type { GeneratorFormat, FormatVersion } from "@/lib/formats";

type FormatSelectorProps = {
  formats: GeneratorFormat[];
  selectedSlug: string;
  selectedVersion?: string;
  onChange: (slug: string) => void;
  onVersionChange?: (versionKey: string) => void;
  variant?: "dropdown" | "inline";
};

export function FormatSelector({
  formats,
  selectedSlug,
  selectedVersion,
  onChange,
  onVersionChange,
  variant = "dropdown"
}: FormatSelectorProps) {
  const active = formats.find((f) => f.slug === selectedSlug);
  const versions = active?.versions;

  if (variant === "inline") {
    return (
      <label className="grid gap-2 text-sm font-medium text-ink">
        Citation style
        <select
          value={selectedSlug}
          onChange={(e) => onChange(e.target.value)}
          className="select-control w-full px-4 py-2"
        >
          {formats.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.label} - {f.edition}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="grid gap-1.5">
        <span className="text-xs font-medium text-faint">Style</span>
        <select
          value={selectedSlug}
          onChange={(e) => onChange(e.target.value)}
          className="select-control px-4 py-2.5 text-sm"
          aria-label="Citation style"
        >
          {formats.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.label} - {f.edition}
            </option>
          ))}
        </select>
      </div>
      {versions && versions.length > 1 && onVersionChange ? (
        <div className="grid gap-1.5">
          <span className="text-xs font-medium text-faint">Edition</span>
          <select
            value={selectedVersion ?? versions[0].key}
            onChange={(e) => onVersionChange(e.target.value)}
            className="select-control px-4 py-2.5 text-sm"
            aria-label="Edition variant"
          >
            {versions.map((v) => (
              <option key={v.key} value={v.key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}

export function getVersionCslFile(
  format: GeneratorFormat,
  versionKey?: string
): string | undefined {
  if (!versionKey || !format.versions) return undefined;
  const version = format.versions.find((v) => v.key === versionKey);
  return version?.cslFile;
}
