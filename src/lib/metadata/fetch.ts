import { MetadataError } from "./types";

export async function fetchJson<T>(
  url: string,
  options?: {
    timeoutMs?: number;
    headers?: HeadersInit;
    errorLabel?: string;
  }
) {
  const response = await fetchWithTimeout(url, {
    timeoutMs: options?.timeoutMs ?? 8000,
    headers: options?.headers
  });

  if (!response.ok) {
    throw new MetadataError(
      `${options?.errorLabel ?? "Metadata request"} failed with status ${response.status}.`,
      { status: response.status, code: "provider_http_error" }
    );
  }

  return (await response.json()) as T;
}

export async function fetchWithTimeout(
  url: string,
  options?: RequestInit & { timeoutMs?: number }
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 8000);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new MetadataError("The metadata request timed out. Try manual entry.", {
        status: 504,
        code: "provider_timeout"
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
