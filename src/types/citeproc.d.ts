declare module "citeproc" {
  export class Engine {
    constructor(sys: unknown, style: string, lang?: string, forceLang?: boolean);
    updateItems(ids: string[]): void;
    makeBibliography(): [unknown, string[]] | false;
    makeCitationCluster(citationItems: Array<{ id: string }>): string;
    previewCitationCluster(
      citation: {
        citationItems: Array<{ id: string }>;
        properties: Record<string, unknown>;
      },
      citationsPre: unknown[],
      citationsPost: unknown[],
      format: "text" | "html" | "rtf"
    ): string;
  }

  const CSL: {
    Engine: typeof Engine;
  };

  export default CSL;
}
