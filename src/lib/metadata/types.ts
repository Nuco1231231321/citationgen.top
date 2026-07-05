export type SourceType = "auto" | "journal" | "book" | "website" | "video" | "manual";
export type ResolvedSourceType = Exclude<SourceType, "auto" | "manual">;

export type DataProvider =
  | "crossref"
  | "google-books"
  | "url"
  | "manual"
  | "nlm"
  | "acs-fallback";

export type Contributor = {
  given?: string;
  family?: string;
  literal?: string;
};

export type DateParts = {
  year?: number;
  month?: number;
  day?: number;
};

export type CitationMetadata = {
  id: string;
  sourceType: ResolvedSourceType;
  cslType?: string;
  title: string;
  authors: Contributor[];
  editors?: Contributor[];
  issued?: DateParts;
  accessed?: DateParts;
  containerTitle?: string;
  containerTitleShort?: string;
  volume?: string;
  issue?: string;
  page?: string;
  DOI?: string;
  URL?: string;
  publisher?: string;
  publisherPlace?: string;
  edition?: string;
  ISBN?: string;
  siteName?: string;
  abstract?: string;
  duration?: string;
  sourceLabel: string;
  sourceProvider: DataProvider;
  abbreviationLabel?: string;
  abbreviationProvider?: DataProvider;
  warnings: string[];
};

export type CitationRequest = {
  style: string;
  sourceType: SourceType;
  input?: string;
  metadata?: CitationMetadata;
  cslFile?: string;
};

export type CitationResponse = {
  metadata: CitationMetadata;
  fullCitation: string;
  inTextCitation: string;
  sourceLabels: string[];
  warnings: string[];
};

export type MetadataProviderResult = {
  metadata: CitationMetadata;
};

export class MetadataError extends Error {
  status: number;
  code: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = "MetadataError";
    this.status = options?.status ?? 400;
    this.code = options?.code ?? "metadata_error";
  }
}
