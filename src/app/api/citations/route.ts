import { NextResponse } from "next/server";
import { generatorSlugs, isGeneratorSlug } from "@/lib/formats";
import { renderCitation } from "@/lib/citation/csl";
import { resolveCitationMetadata } from "@/lib/metadata/resolve";
import { MetadataError, type CitationRequest, type SourceType } from "@/lib/metadata/types";

const sourceTypes: SourceType[] = ["auto", "journal", "book", "website", "video", "manual"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CitationRequest;
    if (!isGeneratorSlug(body.style) && !body.cslFile) {
      return NextResponse.json(
        {
          error: `Choose a supported citation style: ${generatorSlugs.join(", ")}.`
        },
        { status: 400 }
      );
    }

    if (!sourceTypes.includes(body.sourceType)) {
      return NextResponse.json(
        {
          error: "Choose a supported source type."
        },
        { status: 400 }
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

    return NextResponse.json({
      metadata: rendered.metadata,
      fullCitation: rendered.fullCitation,
      inTextCitation: rendered.inTextCitation,
      sourceLabels,
      warnings: rendered.metadata.warnings
    });
  } catch (error) {
    if (error instanceof MetadataError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code
        },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : "Citation generation failed.";
    return NextResponse.json(
      {
        error: message
      },
      { status: 500 }
    );
  }
}
