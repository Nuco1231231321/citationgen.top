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

## NLM database

NLM journal abbreviations are queried from a database, not from Worker-bundled
JSON. Local development reads `data/nlm-journals.sqlite`; Cloudflare reads the
`NLM_DB` D1 binding.

Create the D1 database, replace the placeholder `database_id` in
`wrangler.jsonc`, then migrate and seed:

```bash
wrangler d1 create citationgen-nlm
npm run d1:migrate:remote
npm run d1:seed:remote
```

`npm run cf:dry-run`, `npm run cf:deploy`, and `npm run deploy` run
`npm run cf:check` first. The check fails fast if the D1 binding is missing or
the `database_id` is still the placeholder value, so Cloudflare deployment does
not ship with a broken NLM data binding.

For local D1 testing:

```bash
npm run d1:migrate:local
npm run d1:seed:local
```
