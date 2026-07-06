import { accessSync, constants } from "node:fs";
import { spawnSync } from "node:child_process";
import { delimiter, join } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run-node-tool.mjs <command> [...args]");
  process.exit(1);
}

const bundledNodeBin = join(
  process.env.HOME ?? "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "bin"
);

function canUseBundledNode() {
  try {
    accessSync(join(bundledNodeBin, "node"), constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

const env = { ...process.env };
const localBin = join(process.cwd(), "node_modules", ".bin");
env.PATH = `${localBin}${delimiter}${env.PATH ?? ""}`;
if (canUseBundledNode()) {
  env.PATH = `${bundledNodeBin}${delimiter}${env.PATH}`;
}

const [command, ...commandArgs] = args;
const result = spawnSync(command, commandArgs, {
  cwd: process.cwd(),
  env,
  shell: false,
  stdio: "inherit"
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
