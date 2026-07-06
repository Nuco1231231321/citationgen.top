import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const wranglerPath = join(process.cwd(), "wrangler.jsonc");
const migrationPath = join(process.cwd(), "migrations", "0001_create_nlm_journals.sql");
const wranglerConfig = readFileSync(wranglerPath, "utf8");

const bindingMatch = wranglerConfig.match(/"binding"\s*:\s*"NLM_DB"/);
const databaseIdMatch = wranglerConfig.match(/"database_id"\s*:\s*"([^"]+)"/);
const databaseId = databaseIdMatch?.[1] ?? "";
const placeholderId = "00000000-0000-0000-0000-000000000000";
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const errors = [];

if (!bindingMatch) {
  errors.push("Missing D1 binding named NLM_DB in wrangler.jsonc.");
}

if (!databaseId || databaseId === placeholderId || !uuidPattern.test(databaseId)) {
  errors.push(
    "Replace the NLM_DB database_id placeholder in wrangler.jsonc with the real Cloudflare D1 database id."
  );
}

if (!existsSync(migrationPath)) {
  errors.push("Missing migrations/0001_create_nlm_journals.sql.");
}

if (errors.length) {
  console.error("Cloudflare D1 configuration is not deploy-ready:");
  for (const error of errors) console.error(`- ${error}`);
  console.error("\nFix:");
  console.error("1. wrangler d1 create citationgen-nlm");
  console.error("2. Paste the returned database_id into wrangler.jsonc");
  console.error("3. npm run d1:migrate:remote");
  console.error("4. npm run d1:seed:remote");
  process.exit(1);
}

console.log("Cloudflare D1 configuration looks deploy-ready.");
