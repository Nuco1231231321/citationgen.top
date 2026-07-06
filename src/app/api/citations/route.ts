import { handleCitationApiRequest } from "@/lib/api/citation-api";

export async function POST(request: Request) {
  return handleCitationApiRequest(request);
}
