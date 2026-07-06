import { generatorSlugs, isGeneratorSlug } from "@/lib/formats";
import { renderCitation } from "@/lib/citation/csl";
import { resolveCitationMetadata } from "@/lib/metadata/resolve";
import { MetadataError, type CitationRequest, type SourceType } from "@/lib/metadata/types";

const sourceTypes: SourceType[] = ["auto", "journal", "book", "website", "video", "manual"];

export async function handleCitationApiRequest(request: Request) {
  try {
    const body = (await request.json()) as CitationRequest;
    if (!isGeneratorSlug(body.style) && !body.cslFile) {
      return json(
        {
          error: `Choose a supported citation style: ${generatorSlugs.join(", ")}.`
        },
        400
      );
    }

    if (!sourceTypes.includes(body.sourceType)) {
      return json(
        {
          error: "Choose a supported source type."
        },
        400
      );
    }

    const { metadata } = await resolveCitationMetadata({
      input: body.input,
      sourceType: body.sourceType,
      metadata: body.metadata
    });
    const rendered = await renderCitation(metadata, body.style, body.cslFile, {
      assetOrigin: request.url
    });
    const sourceLabels = [
      rendered.metadata.sourceLabel,
      rendered.metadata.abbreviationLabel
    ].filter(Boolean);

    return json({
      metadata: rendered.metadata,
      fullCitation: rendered.fullCitation,
      inTextCitation: rendered.inTextCitation,
      sourceLabels,
      warnings: rendered.metadata.warnings
    });
  } catch (error) {
    if (error instanceof MetadataError) {
      return json(
        {
          error: error.message,
          code: error.code
        },
        error.status
      );
    }

    console.error("Citation API failed.", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return json(
      {
        error: error instanceof Error ? error.message : "Citation generation failed."
      },
      500
    );
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
