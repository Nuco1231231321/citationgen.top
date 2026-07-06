import fs from "node:fs/promises";
import path from "node:path";

const workerPath = path.join(process.cwd(), ".open-next", "worker.js");
const workerImport =
  'import { handleCitationApiRequest as handleLightweightCitationApiRequest } from "../worker/citation-api.ts";\n';
const patchMarkerStart = "            // codex lightweight citation api start";
const patchMarkerEnd = "            // codex lightweight citation api end";
const patchBlock = `${patchMarkerStart}
            if (url.pathname === "/api/citations") {
                if (request.method === "OPTIONS") {
                    return new Response(null, {
                        status: 204,
                        headers: {
                            allow: "POST, OPTIONS"
                        }
                    });
                }
                if (request.method === "POST") {
                    return handleLightweightCitationApiRequest(request, env);
                }
            }
            ${patchMarkerEnd}`;

const importAnchor =
  'import { handler as middlewareHandler } from "./middleware/handler.mjs";\n';
const routeAnchor = "            const url = new URL(request.url);\n";

const source = await fs.readFile(workerPath, "utf8");
let nextSource = source;

if (!nextSource.includes(workerImport.trim())) {
  if (!nextSource.includes(importAnchor)) {
    throw new Error("Could not find middleware import anchor in .open-next/worker.js");
  }

  nextSource = nextSource.replace(importAnchor, `${importAnchor}${workerImport}`);
}

if (!nextSource.includes(patchMarkerStart)) {
  if (!nextSource.includes(routeAnchor)) {
    throw new Error("Could not find request URL anchor in .open-next/worker.js");
  }

  nextSource = nextSource.replace(routeAnchor, `${routeAnchor}${patchBlock}\n`);
}

if (nextSource !== source) {
  await fs.writeFile(workerPath, nextSource, "utf8");
  console.log("Patched .open-next/worker.js with lightweight citation API routing.");
} else {
  console.log(".open-next/worker.js already contains lightweight citation API routing.");
}
