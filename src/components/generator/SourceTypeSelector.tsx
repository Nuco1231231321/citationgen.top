"use client";

import {
  MagnifyingGlass,
  Article,
  BookOpen,
  Globe,
  Video,
  PencilSimpleLine
} from "@phosphor-icons/react";
import type { SourceType } from "@/lib/metadata/types";
import { cn } from "@/lib/utils";

export const sourceOptions: Array<{
  value: SourceType;
  label: string;
  helper: string;
  icon: typeof Article;
}> = [
  {
    value: "auto",
    label: "Auto",
    helper: "DOI, ISBN, URL, or title",
    icon: MagnifyingGlass
  },
  {
    value: "journal",
    label: "Journal",
    helper: "DOI or article title",
    icon: Article
  },
  {
    value: "book",
    label: "Book",
    helper: "ISBN or book title",
    icon: BookOpen
  },
  {
    value: "website",
    label: "Website",
    helper: "Public URL",
    icon: Globe
  },
  {
    value: "video",
    label: "Video",
    helper: "Video URL or manual fields",
    icon: Video
  },
  {
    value: "manual",
    label: "Manual",
    helper: "Enter fields yourself",
    icon: PencilSimpleLine
  }
];

type SourceTypeSelectorProps = {
  selected: SourceType;
  onChange: (type: SourceType) => void;
  compact?: boolean;
};

export function SourceTypeSelector({
  selected,
  onChange,
  compact = false
}: SourceTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-ink">Source type</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {sourceOptions.map((option) => {
          const Icon = option.icon;
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "rounded-xl text-left transition-all duration-150",
                compact ? "min-h-11 p-2.5" : "min-h-14 p-3",
                active
                  ? "bg-ink text-page"
                  : "bg-subtle text-ink hover:bg-line"
              )}
            >
              <span className="flex items-center justify-between gap-2 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Icon aria-hidden="true" size={18} />
                  {option.label}
                </span>
                {active ? <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-accent" /> : null}
              </span>
              <span className={compact ? "sr-only" : "mt-1 block text-xs opacity-70"}>
                {option.helper}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
