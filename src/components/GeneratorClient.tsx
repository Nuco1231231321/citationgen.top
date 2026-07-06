"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CaretDown,
  Check,
  ClipboardText,
  MagnifyingGlass,
  ShareNetwork
} from "@phosphor-icons/react";
import type {
  CitationMetadata,
  CitationResponse,
  ResolvedSourceType,
  SourceType
} from "@/lib/metadata/types";
import type { FormatVersion, GeneratorFormat, GeneratorSlug } from "@/lib/formats";
import { generatorFormats } from "@/lib/formats";
import { useCitationHistory } from "@/hooks/useCitationHistory";
import { useCitationLibrary } from "@/hooks/useCitationLibrary";
import { detectionLabel, detectInput } from "@/lib/metadata/detect";
import { cn } from "@/lib/utils";
import { useToast } from "./Toast";
import { FormatSelector, getVersionCslFile } from "./generator/FormatSelector";
import { SourceTypeSelector } from "./generator/SourceTypeSelector";
import { ManualSourcePanel, type ManualSourceTemplate } from "./generator/ManualSourcePanel";
import { GeneratorOutput } from "./generator/GeneratorOutput";
import { GeneratorEdit } from "./generator/GeneratorEdit";
import { CitationTrustPanel } from "./generator/CitationTrustPanel";
import { CitationLibrary } from "./generator/CitationLibrary";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type CitationExample = {
  label: string;
  detail: string;
  input: string;
  sourceType?: SourceType;
  formatSlug?: GeneratorFormat["slug"];
};

type GeneratorClientProps = {
  format: GeneratorFormat;
  formatOptions?: GeneratorFormat[];
  compact?: boolean;
  introLabel?: string;
  introText?: string;
  examples?: CitationExample[];
};

type RequestState = "empty" | "loading" | "success" | "error";

type CompactStyleChoice = {
  id: string;
  slug: GeneratorSlug;
  versionKey?: string;
  label: string;
  helper: string;
};

function compactStyleName(format: GeneratorFormat, version?: FormatVersion) {
  if (!version) return format.edition;
  return version.label.toLowerCase().startsWith(format.label.toLowerCase())
    ? version.label
    : `${format.label} ${version.label}`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function GeneratorClient({
  format,
  formatOptions,
  compact = false,
  introLabel = "Source lookup",
  introText = "Paste what you have. The page checks public metadata sources first, then keeps the fields editable.",
  examples = []
}: GeneratorClientProps) {
  /* ----- state ----- */
  const [isMac, setIsMac] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(format.slug);
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>(
    format.versions?.[0]?.key
  );
  const [input, setInput] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("auto");
  const [state, setState] = useState<RequestState>("empty");
  const [error, setError] = useState("");
  const [result, setResult] = useState<CitationResponse | null>(null);
  const [metadata, setMetadata] = useState<CitationMetadata | null>(null);
  const [showSourceTypes, setShowSourceTypes] = useState(false);
  const [compactStyleOpen, setCompactStyleOpen] = useState(false);
  const [compactStyleSearch, setCompactStyleSearch] = useState("");
  const [activeExampleLabel, setActiveExampleLabel] = useState("");
  const [batchProgress, setBatchProgress] = useState<{
    total: number;
    done: number;
  } | null>(null);

  const toast = useToast();

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const generateRef = useRef<HTMLButtonElement>(null);
  const resultRegionRef = useRef<HTMLDivElement>(null);
  const compactStyleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  const { addEntry } = useCitationHistory();
  const {
    items: libraryItems,
    addItem: addLibraryItem,
    removeItem: removeLibraryItem,
    clearLibrary,
    hasItem: hasLibraryItem
  } = useCitationLibrary();
  const activeFormat =
    formatOptions?.find((option) => option.slug === selectedSlug) ?? generatorFormats[selectedSlug] ?? format;
  const activeVersion = activeFormat.versions?.find((version) => version.key === selectedVersion);
  const compactStyleLabel = compactStyleName(activeFormat, activeVersion);

  const detected = useMemo(() => detectInput(input), [input]);
  const detectionText = useMemo(() => detectionLabel(detected), [detected]);

  const compactStyleChoices = useMemo<CompactStyleChoice[]>(() => {
    const choices: CompactStyleChoice[] = [];

    for (const option of formatOptions ?? [activeFormat]) {
      if (option.versions?.length) {
        choices.push(...option.versions.map((version) => ({
          id: `${option.slug}:${version.key}`,
          slug: option.slug,
          versionKey: version.key,
          label: compactStyleName(option, version),
          helper: option.fullName
        })));
        continue;
      }

      choices.push({
        id: option.slug,
        slug: option.slug,
        label: option.edition,
        helper: option.fullName
      });
    }

    return choices.sort((a, b) => a.label.localeCompare(b.label));
  }, [activeFormat, formatOptions]);

  const filteredCompactStyleChoices = useMemo(() => {
    const query = compactStyleSearch.trim().toLowerCase();
    if (!query) return compactStyleChoices;

    return compactStyleChoices.filter((choice) =>
      `${choice.label} ${choice.helper}`.toLowerCase().includes(query)
    );
  }, [compactStyleChoices, compactStyleSearch]);

  const cslOverride = getVersionCslFile(activeFormat, selectedVersion);
  const resultInLibrary = result ? hasLibraryItem(result, activeFormat.slug) : false;

  /* ----- keyboard shortcuts ----- */
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key === "Enter") {
        event.preventDefault();
        if (sourceType === "manual" && metadata) {
          regenerateFromFields();
        } else {
          generateFromInput();
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sourceType, activeFormat.slug, input, metadata, selectedVersion]);

  useEffect(() => {
    function closeCompactStyleMenu(event: PointerEvent) {
      if (!compactStyleRef.current?.contains(event.target as Node)) {
        setCompactStyleOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCompactStyleOpen(false);
    }

    window.addEventListener("pointerdown", closeCompactStyleMenu);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("pointerdown", closeCompactStyleMenu);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ----- status message ----- */
  const statusMessage = useMemo(() => {
    if (batchProgress) return `Processing ${batchProgress.done}/${batchProgress.total} DOIs...`;
    if (state === "loading") return "Looking up source data and formatting the citation.";
    if (state === "error") return error;
    if (state === "success") return "Citation generated.";
    return "Paste a source to begin.";
  }, [error, state, batchProgress]);

  /* ----- request / generate ----- */
  const requestCitation = useCallback(
    async (opts: {
      styleSlug: string;
      requestSourceType: SourceType;
      requestInput?: string;
      requestMetadata?: CitationMetadata;
      requestCslFile?: string | null;
      revealResult?: boolean;
    }) => {
    setState("loading");
    setError("");

    const body: Record<string, unknown> = {
        style: opts.styleSlug,
        sourceType: opts.requestSourceType,
        input: opts.requestInput,
        metadata: opts.requestMetadata
      };
      const requestedCslFile =
        "requestCslFile" in opts ? opts.requestCslFile : cslOverride;
      if (requestedCslFile) body.cslFile = requestedCslFile;

      try {
        const response = await postCitation(body);
        const payload = await readCitationPayload(response);
        if (!response.ok) {
          setState("error");
          setError(readError(payload, errorMessageForStatus(response.status)));
          setResult(null);
          if (!opts.requestMetadata) {
            setMetadata(createBlankMetadata(toBlankSourceType(opts.requestSourceType)));
          }
          revealResultRegion(opts.revealResult);
          return;
        }

        const citation = payload as CitationResponse;
        setResult(citation);
        setMetadata(citation.metadata);
        setState("success");

        addEntry(citation, opts.styleSlug as GeneratorSlug, opts.requestInput ?? "");
        revealResultRegion(opts.revealResult);
      } catch (error) {
        setState("error");
        setError(
          error instanceof Error && error.name === "AbortError"
            ? "Citation lookup timed out. Try again or enter the fields manually."
            : "Citation lookup failed. Try again or enter the fields manually."
        );
        setResult(null);
        if (!opts.requestMetadata) {
          setMetadata(createBlankMetadata(toBlankSourceType(opts.requestSourceType)));
        }
        revealResultRegion(opts.revealResult);
      }
    },
    [cslOverride, addEntry]
  );

  async function generateFromInput() {
    if (sourceType === "manual") {
      const nextMetadata = metadata ?? createBlankMetadata("website");
      setMetadata(nextMetadata);
      setResult(null);
      setState("empty");
      setError("");
      return;
    }

    const detected = detectInput(input);
    if (detected.kind === "batch-doi") {
      await processBatch(detected.values);
      return;
    }

    await requestCitation({
      styleSlug: activeFormat.slug,
      requestSourceType: sourceType,
      requestInput: input
    });
  }

  async function processBatch(dois: string[]) {
    setBatchProgress({ total: dois.length, done: 0 });
    setState("loading");

    const results: CitationResponse[] = [];
    for (const doi of dois) {
      const body: Record<string, unknown> = {
        style: activeFormat.slug,
        sourceType: "auto",
        input: doi
      };
      if (cslOverride) body.cslFile = cslOverride;

      try {
        const res = await postCitation(body);
        if (res.ok) {
          const citation = (await readCitationPayload(res)) as CitationResponse;
          results.push(citation);
          addEntry(citation, activeFormat.slug, doi);
        }
      } catch (error) {
        console.warn(`DOI lookup failed for ${doi}.`, error);
      }
      setBatchProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : null));
    }

    setBatchProgress(null);
    if (results.length > 0) {
      setResult(results[results.length - 1]);
      setMetadata(results[results.length - 1].metadata);
      setState("success");
      toast.show(
        `${results.length}/${dois.length} DOI${results.length !== 1 ? "s" : ""} processed. Only the last citation is shown.`,
        "info"
      );
    } else {
      setState("error");
      setError("None of the DOIs returned results. Check the values and try again.");
    }
  }

  async function regenerateFromFields() {
    if (!metadata) return;
    await requestCitation({
      styleSlug: activeFormat.slug,
      requestSourceType: metadata.sourceType,
      requestMetadata: metadata
    });
  }

  /* ----- helpers ----- */
  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.show(`${label} copied`, "success");
    } catch {
      toast.show("Copy failed. Select the text and copy it manually.", "error");
    }
  }

  function updateMetadata(next: CitationMetadata) {
    setMetadata(next);
  }

  function changeFormat(slug: string) {
    const typedSlug = slug as GeneratorSlug;
    setSelectedSlug(typedSlug);
    const next = formatOptions?.find((f) => f.slug === typedSlug) ?? generatorFormats[typedSlug];
    if (next?.versions?.length) setSelectedVersion(next.versions[0].key);
    else setSelectedVersion(undefined);
    setResult(null);
    setState("empty");
    setError("");
    setActiveExampleLabel("");
  }

  function chooseCompactStyle(choice: CompactStyleChoice) {
    changeFormat(choice.slug);
    if (choice.versionKey) setSelectedVersion(choice.versionKey);
    setCompactStyleOpen(false);
    setCompactStyleSearch("");
  }

  function chooseManualTemplate(template: ManualSourceTemplate) {
    setSourceType("manual");
    setMetadata(createBlankMetadata(template.sourceType, template.cslType));
    setResult(null);
    setState("empty");
    setError("");
    setShowSourceTypes(false);
  }

  async function runExample(example: CitationExample) {
    const nextStyleSlug = example.formatSlug ?? activeFormat.slug;
    const nextFormat = generatorFormats[nextStyleSlug];
    const nextVersion = nextFormat.versions?.[0]?.key;
    setSelectedSlug(nextStyleSlug);
    setSelectedVersion(nextVersion);
    setSourceType(example.sourceType ?? "auto");
    setInput(example.input);
    setActiveExampleLabel(example.label);
    setMetadata(null);
    setResult(null);
    setShowSourceTypes(false);

    await requestCitation({
      styleSlug: nextStyleSlug,
      requestSourceType: example.sourceType ?? "auto",
      requestInput: example.input,
      requestCslFile: getVersionCslFile(nextFormat, nextVersion),
      revealResult: true
    });
  }

  function revealResultRegion(shouldReveal?: boolean) {
    if (!shouldReveal) return;
    window.setTimeout(() => {
      resultRegionRef.current?.focus({ preventScroll: true });
    }, 60);
  }

  function shareCitation() {
    if (!result) return;
    const data = {
      c: result.fullCitation,
      i: result.inTextCitation,
      s: activeFormat.slug,
      l: result.sourceLabels
    };
    const hash = encodeURIComponent(btoa(JSON.stringify(data)));
    const url = `${window.location.origin}${window.location.pathname}#share=${hash}`;
    navigator.clipboard.writeText(url).then(
      () => toast.show("Share link copied", "success"),
      () => toast.show("Could not copy link.", "error")
    );
  }

  function addResultToLibrary() {
    if (!result) return;
    const action = addLibraryItem(result, activeFormat.slug, input);
    toast.show(
      action === "updated" ? "Reference library updated" : "Added to reference library",
      "success"
    );
  }

  /* ----- render ----- */
  if (compact) {
    return (
      <section id="generator" className="site-shell generator-stage py-4">
        <div className="citation-console">
          <div className="citation-dock">
            <div className="dock-style" ref={compactStyleRef}>
              <span>Citation style</span>
              <button
                type="button"
                className="dock-style-trigger"
                aria-haspopup="listbox"
                aria-expanded={compactStyleOpen}
                onClick={() => setCompactStyleOpen((open) => !open)}
              >
                <span>{compactStyleLabel}</span>
                <CaretDown aria-hidden="true" size={16} weight="bold" />
              </button>

              {compactStyleOpen ? (
                <div className="compact-style-menu" role="listbox" aria-label="Citation style">
                  <label className="compact-style-search">
                    <MagnifyingGlass aria-hidden="true" size={18} />
                    <input
                      type="search"
                      value={compactStyleSearch}
                      onChange={(event) => setCompactStyleSearch(event.target.value)}
                      placeholder="Find by name"
                      aria-label="Find citation style by name"
                      autoFocus
                    />
                  </label>

                  <div className="compact-style-list">
                    {filteredCompactStyleChoices.map((choice) => {
                      const selected =
                        activeFormat.slug === choice.slug &&
                        (choice.versionKey ? selectedVersion === choice.versionKey : true);

                      return (
                        <button
                          key={choice.id}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={selected ? "is-selected" : undefined}
                          onClick={() => chooseCompactStyle(choice)}
                        >
                          <span>
                            <strong>{choice.label}</strong>
                            <small>{choice.helper}</small>
                          </span>
                          {selected ? <Check aria-hidden="true" size={18} weight="bold" /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            <label className="dock-query" htmlFor={`${activeFormat.slug}-quick-input`}>
              <span>Cite a webpage, book, article, and more</span>
              <input
                ref={inputRef}
                id={`${activeFormat.slug}-quick-input`}
                type="text"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setActiveExampleLabel("");
                  if (sourceType === "manual") setSourceType("auto");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    generateFromInput();
                  }
                }}
                placeholder="Search by title, URL, DOI, ISBN, or keywords"
                aria-describedby={`${activeFormat.slug}-quick-helper`}
              />
            </label>
            <button
              ref={generateRef}
              type="button"
              onClick={generateFromInput}
              disabled={state === "loading"}
              className="dock-cite"
            >
              {state === "loading" ? "Citing..." : "Cite"}
            </button>
          </div>

          <div className="citation-underbar" id={`${activeFormat.slug}-quick-helper`}>
            <button
              type="button"
              onClick={() => setShowSourceTypes((v) => !v)}
              className="underbar-action"
            >
              {showSourceTypes ? "Back to search" : "Cite manually"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSourceType(sourceType === "video" ? "auto" : "video");
                setResult(null);
                setState("empty");
                setError("");
                setActiveExampleLabel("");
              }}
              className={cn("underbar-action", sourceType === "video" ? "is-active" : "")}
            >
              {sourceType === "video" ? "Video mode selected" : "Cite a video"}
            </button>

            <span className="underbar-style-note">{compactStyleLabel}</span>
          </div>

          <InputDetectionBadge text={detectionText} className="citation-detection" />

          {examples.length ? (
            <div className="example-rail" aria-label="Try real citation examples">
              <span>Try real examples</span>
              <div>
                {examples.map((example) => (
                  <button
                    key={`${example.label}-${example.input}`}
                    type="button"
                    onClick={() => runExample(example)}
                    disabled={state === "loading"}
                    aria-pressed={activeExampleLabel === example.label}
                    className={activeExampleLabel === example.label ? "is-active" : undefined}
                  >
                    <strong>{example.label}</strong>
                    <small>{example.detail}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Manual source panel */}
        {showSourceTypes ? (
          <div className="mt-4">
            <ManualSourcePanel onChoose={chooseManualTemplate} />
          </div>
        ) : null}

        {/* Results area - only shows after citation is generated */}
        {(state === "loading" || state === "success" || state === "error" || result) && (
          <div
            ref={resultRegionRef}
            tabIndex={-1}
            aria-label="Citation checks and generated result"
            className="mt-6 grid scroll-mt-24 gap-6 lg:grid-cols-[1fr_1fr]"
          >
            {/* Citation checks */}
            <div className="rounded-3xl bg-surface border border-line p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-editorial text-xl text-ink">
                    Checks
                  </h2>
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
                  Live
                </span>
              </div>
              <CitationTrustPanel
                sourceLabel={result?.sourceLabels.join(", ")}
                warningCount={result?.warnings.length ?? 0}
                hasEditableFields={!!metadata}
              />
              {activeExampleLabel ? (
                <div className="mt-4 rounded-2xl bg-subtle p-4">
                  <p className="text-xs font-semibold text-ink">Real example running</p>
                  <p className="mt-1 text-sm leading-6 text-dim">
                    {activeExampleLabel} uses this input: <span className="break-all text-ink">{input}</span>
                  </p>
                </div>
              ) : null}
              <div className="mt-4 p-4 rounded-2xl bg-subtle/40 text-sm leading-6 text-dim">
                {sourceType === "video"
                  ? "Paste a video URL above, then cite it."
                  : sourceType === "manual" && metadata
                    ? "Fill in the fields, then regenerate."
                    : state === "success"
                      ? "Review the source label and any warnings."
                      : `Tip: Paste multiple DOIs (one per line) for batch.`}
              </div>
            </div>

            {/* Citation result */}
            <div className="rounded-3xl bg-surface border border-line p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="font-editorial text-xl text-ink">
                  Result
                </h2>
                <span className="rounded-full bg-subtle px-2.5 py-1 text-[11px] font-semibold text-dim">
                  {activeFormat.label}
                </span>
              </div>
              <div role="status" aria-live="polite" className="sr-only">
                {statusMessage}
              </div>
              {state === "loading" ? <LoadingState compact /> : null}
              {state === "error" ? <ErrorState message={error} compact /> : null}
              {result ? (
                <>
                  <GeneratorOutput
                    result={result}
                    copyText={copyText}
                    compact
                    onAddToLibrary={addResultToLibrary}
                    libraryAdded={resultInLibrary}
                  />
                  <button
                    type="button"
                    onClick={shareCitation}
                    className="action-ghost copy-share-link mt-4"
                  >
                    <ShareNetwork aria-hidden="true" size={16} />
                    Copy share link
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Edit panel */}
        {metadata && state !== "empty" ? (
          <GeneratorEdit
            metadata={metadata}
            onChange={updateMetadata}
            onRegenerate={regenerateFromFields}
            loading={state === "loading"}
          />
        ) : null}

        {libraryItems.length > 0 ? (
          <CitationLibrary
            items={libraryItems}
            onRemove={removeLibraryItem}
            onClear={clearLibrary}
          />
        ) : null}
        {toast.ToastContainer()}
      </section>
    );
  }

  /* ----- non-compact (standalone page) render ----- */
  return (
    <section id="generator" className="site-shell py-8">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* --- left column: input --- */}
        <div className="rounded-3xl bg-surface border border-line p-5 md:p-7">
          <div className="mb-5 border-b border-line pb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-faint">{introLabel}</p>
            <h2 className="font-editorial text-[30px] leading-[1.2] text-ink">
              Generate a citation
            </h2>
            <p className="mt-2 text-pretty text-sm leading-6 text-dim">{introText}</p>
          </div>

          <FormatSelector
            formats={formatOptions ?? [activeFormat]}
            selectedSlug={activeFormat.slug}
            selectedVersion={selectedVersion}
            onChange={changeFormat}
            onVersionChange={(v: string) => {
              setSelectedVersion(v);
              setResult(null);
              setState("empty");
              setError("");
            }}
          />

          <div className="mt-5">
            <SourceTypeSelector selected={sourceType} onChange={setSourceType} />
          </div>

          {sourceType !== "manual" ? (
            <div className="mt-5">
              <label htmlFor={`${activeFormat.slug}-source-input`} className="text-sm font-medium">
                DOI, ISBN, URL, or title
              </label>
              <textarea
                ref={textareaRef}
                id={`${activeFormat.slug}-source-input`}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setActiveExampleLabel("");
                }}
                rows={3}
                placeholder="Paste a DOI, ISBN, URL, or source title. One per line for batch."
                className="field mt-2 resize-y px-3 py-3 min-h-24"
                aria-describedby={`${activeFormat.slug}-source-helper`}
              />
              <InputDetectionBadge text={detectionText} className="mt-2" />
              <p id={`${activeFormat.slug}-source-helper`} className="mt-2 text-xs leading-5 text-faint">
                DOI searches use CrossRef. ISBN searches use Google Books. URL checks read public
                page metadata. Paste multiple DOIs on separate lines for batch processing.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-subtle mt-5 p-4 text-sm leading-6 text-dim">
              Fill the fields below, then generate the citation from your entry.
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              ref={generateRef}
              type="button"
              onClick={sourceType === "manual" ? regenerateFromFields : generateFromInput}
              disabled={state === "loading" || !!batchProgress}
              className="btn inline-flex w-full whitespace-nowrap sm:w-auto"
            >
              {batchProgress
                ? `Processing ${batchProgress.done}/${batchProgress.total}`
                : state === "loading"
                  ? "Generating"
                  : "Generate citation"}
            </button>
            {state === "error" ? (
              <button
                type="button"
                onClick={() => {
                  setSourceType("manual");
                  setMetadata(metadata ?? createBlankMetadata("website"));
                  setState("empty");
                  setError("");
                }}
                className="action-secondary w-full whitespace-nowrap sm:w-auto"
              >
                Enter fields manually
              </button>
            ) : null}
            <p className="self-center text-xs text-faint sm:ml-auto">
              {isMac ? "⌘" : "Ctrl"}+Enter to generate
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSourceTypes((v) => !v)}
            className="action-ghost mt-3 whitespace-nowrap"
          >
            {showSourceTypes ? "Hide source types" : "More source types"}
          </button>

          {showSourceTypes ? <ManualSourcePanel onChoose={chooseManualTemplate} /> : null}
        </div>

        {/* --- right column: output --- */}
        <div className="rounded-3xl bg-surface border border-line p-5 md:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-faint">Output</p>
              <h2 className="font-editorial text-[30px] leading-[1.2] text-ink">
                Citation result
              </h2>
              <p className="mt-2 text-sm leading-6 text-dim">
                Review warnings and copy the text you need.
              </p>
            </div>
            <span className="rounded-lg bg-subtle px-3 py-1 text-xs font-medium text-dim">
              {activeFormat.label}
            </span>
          </div>

          <div role="status" aria-live="polite" className="sr-only">
            {statusMessage}
          </div>

          {state === "loading" ? <LoadingState compact={false} /> : null}
          {state === "empty" && !result ? <EmptyState compact={false} /> : null}
          {state === "error" ? <ErrorState message={error} compact={false} /> : null}
          {result ? (
            <>
              <GeneratorOutput
                result={result}
                copyText={copyText}
                onAddToLibrary={addResultToLibrary}
                libraryAdded={resultInLibrary}
              />
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={shareCitation}
                  className="action-ghost whitespace-nowrap"
                >
                  <ShareNetwork aria-hidden="true" size={16} />
                  Share link
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {metadata ? (
        <GeneratorEdit
          metadata={metadata}
          onChange={updateMetadata}
          onRegenerate={regenerateFromFields}
          loading={state === "loading"}
        />
      ) : null}

      <CitationLibrary
        items={libraryItems}
        onRemove={removeLibraryItem}
        onClear={clearLibrary}
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function InputDetectionBadge({ text, className }: { text: string; className?: string }) {
  if (!text || text === "Waiting for input") return null;
  return (
    <div className={cn("flex items-center gap-2 rounded-lg bg-subtle px-3 py-1.5", className)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      <span className="text-xs font-medium text-dim">{text}</span>
    </div>
  );
}

function LoadingState({ compact }: { compact: boolean }) {
  return (
    <div className={cn("space-y-3", compact ? "mt-4" : "mt-6")} aria-busy="true">
      <div className="rounded-lg bg-subtle/80 h-4 w-32 animate-pulse" />
      <div className={cn("rounded-xl bg-subtle/80 animate-pulse", compact ? "h-16" : "h-24")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-subtle/80 h-14 animate-pulse" />
        <div className="rounded-xl bg-subtle/80 h-14 animate-pulse" />
      </div>
    </div>
  );
}

function EmptyState({ compact }: { compact: boolean }) {
  return (
    <div className={cn("result-card", compact ? "mt-4 p-4" : "mt-6 p-6")}>
      <p className="text-sm font-medium text-ink">No citation yet.</p>
      <p className="mt-1.5 text-pretty text-sm leading-6 text-dim">
        Paste a DOI, ISBN, URL, or source title to begin. If no public record is found, you can enter fields manually.
      </p>
    </div>
  );
}

function ErrorState({ message, compact }: { message: string; compact: boolean }) {
  return (
    <div className={cn("result-card border-accent/30 bg-[#faf6f0]", compact ? "mt-4 p-4" : "mt-6 p-6")}>
      <p className="text-sm font-medium text-ink">Lookup did not finish.</p>
      <p className="mt-1.5 text-pretty text-sm leading-6 text-dim">{message}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                 */
/* -------------------------------------------------------------------------- */

async function postCitation(body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 18000);
  try {
    return await fetch("/api/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

async function readCitationPayload(response: Response): Promise<CitationResponse | { error?: string }> {
  try {
    return (await response.json()) as CitationResponse | { error?: string };
  } catch {
    return { error: errorMessageForStatus(response.status) };
  }
}

function errorMessageForStatus(status: number) {
  if (status === 429) {
    return "The metadata provider is rate limiting requests. Wait a minute or enter the source manually.";
  }
  if (status === 503) {
    return "Citation lookup is temporarily unavailable. Try again or enter the source manually.";
  }
  if (status >= 500) {
    return "Citation lookup failed on the server. Try again or enter the source manually.";
  }
  return "Citation lookup failed. Try manual entry.";
}

function createBlankMetadata(sourceType: ResolvedSourceType, cslType?: string): CitationMetadata {
  return {
    id: crypto.randomUUID(),
    sourceType,
    cslType,
    title: "",
    authors: [],
    sourceLabel: "Manually entered",
    sourceProvider: "manual",
    warnings: []
  };
}

function toBlankSourceType(sourceType: SourceType): ResolvedSourceType {
  if (
    sourceType === "journal" ||
    sourceType === "book" ||
    sourceType === "website" ||
    sourceType === "video"
  ) {
    return sourceType;
  }
  return "website";
}

function readError(payload: CitationResponse | { error?: string }, fallback: string) {
  return "error" in payload && payload.error ? payload.error : fallback;
}
