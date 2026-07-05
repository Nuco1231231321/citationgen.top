export const siteConfig = {
  name: "CitationGen",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://citationgen.top",
  description:
    "Free citation generators that use real metadata sources, editable fields, and clear source labels."
};

export function absoluteUrl(path: string) {
  const base = siteConfig.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
