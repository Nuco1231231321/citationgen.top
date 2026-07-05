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

Required production variable:

```bash
NEXT_PUBLIC_SITE_URL=https://citationgen.top
```

The Worker is configured in `wrangler.jsonc` as `citationgen-top`.
