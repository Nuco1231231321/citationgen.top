# citationgen.top

CitationGen is a real citation generator built with Next.js, Tailwind CSS, CSL styles, CrossRef, Google Books, URL metadata extraction, and NLM journal abbreviations.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck
npm test
npm run build
```

## Cloudflare Workers deployment

This project uses `@opennextjs/cloudflare` and Wrangler.

```bash
npm run cf:build
npm run cf:dry-run
npm run cf:deploy
```

Cloudflare build command:

```bash
npm run cf:build
```

Required production variables:

```bash
NEXT_PUBLIC_SITE_URL=https://citationgen.top
CROSSREF_MAILTO=metadata-contact@your-domain.example
```

`CROSSREF_MAILTO` must be a real monitored address. CrossRef uses it for polite
pool identification and contact when automated metadata requests misbehave.

The Worker is configured in `wrangler.jsonc` as `citationgen-top`.
