const baseUrl = (process.argv[2] || "https://citationgen.top").replace(/\/$/, "");

const cases = [
  {
    name: "manual-book-apa",
    body: {
      style: "apa",
      sourceType: "manual",
      metadata: {
        id: "manual-book-1",
        sourceType: "book",
        title: "Test Book",
        authors: [{ given: "Ada", family: "Lovelace" }],
        issued: { year: 2024 },
        publisher: "Example Press",
        sourceLabel: "Manually entered",
        sourceProvider: "manual",
        warnings: []
      }
    },
    mustInclude: ["Lovelace", "Test Book"]
  },
  {
    name: "manual-website-mla",
    body: {
      style: "mla",
      sourceType: "manual",
      metadata: {
        id: "manual-website-1",
        sourceType: "website",
        title: "Example Page",
        authors: [{ literal: "Example Organization" }],
        issued: { year: 2024, month: 7, day: 1 },
        containerTitle: "Example Site",
        URL: "https://example.com",
        sourceLabel: "Manually entered",
        sourceProvider: "manual",
        warnings: []
      }
    },
    mustInclude: ["Example Page", "example.com"]
  },
  {
    name: "manual-journal-chicago",
    body: {
      style: "chicago",
      sourceType: "manual",
      metadata: {
        id: "manual-journal-1",
        sourceType: "journal",
        title: "The Structure of Ordinary Water",
        authors: [{ given: "Henry S.", family: "Frank" }],
        issued: { year: 1970, month: 8, day: 14 },
        containerTitle: "Science",
        volume: "169",
        issue: "3946",
        page: "635-641",
        DOI: "10.1126/science.169.3946.635",
        URL: "https://doi.org/10.1126/science.169.3946.635",
        sourceLabel: "Manually entered",
        sourceProvider: "manual",
        warnings: []
      }
    },
    mustInclude: ["Frank", "Science", "10.1126/science.169.3946.635"]
  },
  {
    name: "doi-auto-chicago",
    body: {
      style: "chicago",
      sourceType: "auto",
      input: "10.1126/science.169.3946.635"
    },
    mustInclude: ["Frank", "Science", "10.1126/science.169.3946.635"]
  }
];

let failures = 0;

for (const testCase of cases) {
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}/api/citations`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(testCase.body)
  });

  const elapsedMs = Date.now() - startedAt;
  const rawText = await response.text();
  let payload;

  try {
    payload = JSON.parse(rawText);
  } catch {
    payload = { rawText };
  }

  if (!response.ok) {
    failures += 1;
    console.error(`[FAIL] ${testCase.name} -> HTTP ${response.status} in ${elapsedMs}ms`);
    console.error(typeof payload === "object" ? JSON.stringify(payload, null, 2) : String(payload));
    continue;
  }

  const fullCitation = typeof payload?.fullCitation === "string" ? payload.fullCitation : "";
  const missing = testCase.mustInclude.filter((token) => !fullCitation.includes(token));

  if (missing.length) {
    failures += 1;
    console.error(`[FAIL] ${testCase.name} -> missing ${missing.join(", ")} in ${elapsedMs}ms`);
    console.error(fullCitation);
    continue;
  }

  console.log(`[PASS] ${testCase.name} -> ${elapsedMs}ms`);
}

if (failures) {
  process.exitCode = 1;
  console.error(`Smoke test finished with ${failures} failure(s).`);
} else {
  console.log("Smoke test passed for all citation cases.");
}
