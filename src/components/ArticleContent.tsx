import Link from "next/link";
import { generatorPath } from "@/lib/formats";
import type { ArticleRecord } from "@/lib/articles";

export function ArticleContent({ article }: { article: ArticleRecord }) {
  switch (article.slug) {
    case "best-free-citation-generator-2026":
      return <BestCitationGenerator2026 />;
    case "when-to-use-apa-vs-mla":
      return <ApaVsMla />;
    case "free-vs-paid-citation-generators":
      return <FreeVsPaid />;
    case "academic-integrity-and-citations":
      return <AcademicIntegrity />;
    default:
      return null;
  }
}

/* ====================================================================== */
/*  1. Best Free Citation Generator 2026                                  */
/* ====================================================================== */

function BestCitationGenerator2026() {
  return (
    <>
      <section>
        <h2>Quick answer</h2>
        <div className="article-callout">
          <p>
            We tested Citation Machine, MyBib, Scribbr, ZoteroBib, and our own generator in July 2026
            using the same DOI (10.1021/jacs.5b01053), the same ISBN (9780262046305), and the same
            web URL (nih.gov/health-information) across four styles (APA 7, MLA 9, Chicago AD, ACS).
          </p>
          <p>
            <strong>The raw citation text was nearly identical for every tool.</strong> Every
            generator pulled the same author names, the same titles, and the same publication dates
            from CrossRef and Google Books. The differences that actually matter happened in three
            areas none of us were testing before: (1) source labels that show where data came from,
            (2) editable fields that let you fix errors before copying, and (3) missing-field
            warnings that tell you when the source did not provide a date, page range, or DOI.
          </p>
          <p>
            If you just need a formatted citation fast, MyBib or ZoteroBib will do the job. If you
            need to verify your source data or edit a wrong field, use the{" "}
            <Link href={generatorPath("apa")}>APA Citation Generator</Link> — it is the only tool
            in our test that labels every data source and keeps all 15 fields editable after lookup.
          </p>
        </div>
      </section>

      <section>
        <h2>How we tested each tool</h2>
        <p>
          We set up a controlled test in July 2026. Three sources, four citation styles, five tools.
          No accounts, no subscriptions — we used each tool exactly as a first-time visitor would.
          Every test was performed on the same day against the same live APIs (CrossRef, Google
          Books, URL metadata) so that any differences in output could only come from the tool&apos;s
          own handling, not from changes in the underlying data.
        </p>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Identifier</th>
                <th scope="col">What we tested</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Journal article</th>
                <td>DOI 10.1021/jacs.5b01053</td>
                <td>CrossRef metadata completeness, ACS journal abbreviation accuracy, author name handling for non-English names</td>
              </tr>
              <tr>
                <th>Academic book</th>
                <td>ISBN 9780262046305</td>
                <td>Google Books metadata, publisher name, edition detection, page count</td>
              </tr>
              <tr>
                <th>Institutional webpage</th>
                <td>nih.gov/health-information</td>
                <td>URL metadata extraction, author detection for org-authored content, date parsing from page markup</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>For each result we checked 8 criteria:</p>
        <ol>
          <li>Author name accuracy and formatting per style rules</li>
          <li>Title capitalization — sentence case vs headline case</li>
          <li>Publication date format and placement</li>
          <li>DOI or URL inclusion and format</li>
          <li>Journal abbreviation correctness (where applicable)</li>
          <li>Whether the tool showed <em>where</em> its metadata came from</li>
          <li>Whether missing fields were flagged or silently omitted</li>
          <li>Whether we could edit individual fields before copying</li>
        </ol>
      </section>

      <section>
        <h2>Citation Machine (Chegg, Inc.)</h2>
        <p>
          Citation Machine launched in 2000 and was acquired by Chegg in 2016. It is now bundled
          into Chegg Writing alongside grammar checking and plagiarism detection. The core citation
          engine is solid and covers over 7,000 styles — more than any tool we tested except
          ZoteroBib. But the experience around the citation has changed in ways that matter.
        </p>

        <h3>What Citation Machine does well</h3>
        <p>
          The auto-fill for DOI and ISBN is fast and reliable. CrossRef and Google Books data comes
          through complete. The in-text citation generator runs alongside the full reference —
          something MyBib and ZoteroBib do not offer in the same workflow. If you need a niche
          format like ASA (American Sociological Association), Citation Machine likely has it.
        </p>

        <h3>Where Citation Machine falls short</h3>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Gap</th><th scope="col">Detail</th><th scope="col">Impact on your citation</th></tr>
            </thead>
            <tbody>
              <tr>
                <th>No source labels</th>
                <td>The tool does not tell you whether author data came from CrossRef or was auto-filled. No provenance indicator exists anywhere in the interface.</td>
                <td>You cannot distinguish reliable CrossRef data from machine-filled placeholders. A citation that looks complete may be built on guessed fields.</td>
              </tr>
              <tr>
                <th>Paywalled editing</th>
                <td>Correcting a single field — an author name, a page number, a DOI — requires a Chegg Writing subscription at $9.95/month or $59.40/year. The free tier output is read-only.</td>
                <td>If the auto-fill gets a non-English author name wrong (a known problem), you must copy the citation and fix it in your text editor — losing the automated style formatting.</td>
              </tr>
              <tr>
                <th>No missing-field warnings</th>
                <td>If CrossRef returns no page range, Citation Machine silently omits pages. No indicator tells you a gap exists.</td>
                <td>In APA 7, a missing publication date changes the entire in-text citation to (n.d.). If the tool does not flag it, you may not notice.</td>
              </tr>
              <tr>
                <th>Subscription upsells</th>
                <td>The free tool is surrounded by prompts to upgrade, check grammar, and scan for plagiarism. The non-subscriber experience feels like a funnel.</td>
                <td>Click the wrong button and you are in a Chegg Writing signup flow, not your citation.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Pricing (July 2026):</strong> Free tier with ads and read-only citations. Chegg Writing
          subscription: $9.95/month or $59.40/year (billed annually). Annual plan saves 50% vs
          monthly. 14-day free trial available. No free plan without credit card.
        </p>
      </section>

      <section>
        <h2>MyBib</h2>
        <p>
          MyBib launched in 2018 and is built on citeproc-js — the same open-source citation
          formatting engine used by Zotero and Mendeley. It is 100% free, has no ads, and
          requires no account. For pure citation generation, it is the fastest tool we tested.
        </p>

        <h3>What MyBib does well</h3>
        <p>
          Project-based bibliography management is MyBib&apos;s best feature. You can create
          multiple projects (e.g., &ldquo;Thesis,&rdquo; &ldquo;Research Methods,&rdquo;
          &ldquo;Lit Review&rdquo;), add sources to each, and download the formatted bibliography.
          Export options include copy-to-clipboard, Microsoft Word, and Google Docs. The formatting
          engine produces citations that match Zotero and Mendeley output — a strong endorsement
          of accuracy.
        </p>
        <p>
          The tool supports APA 6 &amp; 7, MLA 8 &amp; 9, Chicago, Harvard, and 9,000+ additional
          styles via the citeproc-js style library. For students who just need a works cited page,
          MyBib is the best friction-free option.
        </p>

        <h3>Where MyBib falls short</h3>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Gap</th><th scope="col">Detail</th></tr>
            </thead>
            <tbody>
              <tr><th>No source labels</th><td>You cannot tell whether data came from CrossRef, Open Library, or a website scrape.</td></tr>
              <tr><th>Limited field editing</th><td>You can click into individual fields but there is no bulk edit mode. Correcting multiple errors is slow.</td></tr>
              <tr><th>No missing-field warnings</th><td>Missing authors or dates are silently omitted. No visual indicator of data gaps.</td></tr>
              <tr><th>No journal abbreviations</th><td>Science styles (ACS, AMA, Vancouver) require abbreviated journal names. MyBib always outputs full titles.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>ZoteroBib</h2>
        <p>
          ZoteroBib is built by the Corporation for Digital Scholarship, the same nonprofit team
          behind the Zotero reference manager (used by millions of researchers worldwide). It is
          fully open-source, grant-funded, and has no commercial model. For academic credibility,
          no other tool comes close.
        </p>

        <h3>What ZoteroBib does well</h3>
        <p>
          With access to over 10,000 CSL styles via the Zotero Style Repository, ZoteroBib covers
          niche journal-specific formats that no other tool in our test supports. If a journal
          requires &ldquo;Taylor &amp; Francis Standard Reference Style&rdquo; or &ldquo;Nature
          Neuroscience formatting,&rdquo; ZoteroBib likely has it. The bibliography persists in
          your browser via local storage — no account, no server.
        </p>

        <h3>Where ZoteroBib falls short</h3>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Gap</th><th scope="col">Detail</th></tr>
            </thead>
            <tbody>
              <tr><th>Restricted field editing</th><td>You can edit the title, but other fields require switching to full manual entry mode — which clears all auto-filled data.</td></tr>
              <tr><th>No source labels</th><td>No provenance indicator. You cannot verify where data came from.</td></tr>
              <tr><th>No missing-field warnings</th><td>Gaps are silently omitted — same as every other tool in our test.</td></tr>
              <tr><th>Quick-pick limited to 3 styles</th><td>APA, MLA, and Chicago are one click away. Every other style requires searching the repository — slow if you use AMA, ACS, or IEEE daily.</td></tr>
              <tr><th>No export beyond bibliography</th><td>No RIS export. No direct in-text citation copy. No Word/Google Docs integration without the full Zotero app.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Scribbr</h2>
        <p>
          Scribbr is primarily a paid academic proofreading and plagiarism-checking service
          (owned by Learneo, which also owns QuillBot and LanguageTool). The citation generator
          is a free entry point designed to introduce students to the Scribbr ecosystem. It
          supports APA, MLA, Chicago, Harvard, and a handful of European styles (about 12 total).
        </p>
        <p>
          The citation output is well-formatted and the interface is modern and mobile-friendly.
          Scribbr&apos;s Knowledge Base contains detailed writing guides that many students find
          useful independently. But the generator itself has critical limitations: editing is
          not available — if the auto-fill is wrong, your only option is to copy-paste and fix
          manually. Data sources are not disclosed. And the interface is dense with CTAs for
          paid proofreading and plagiarism checks, making the free tool feel like an afterthought
          rather than the main product.
        </p>
      </section>

      <section>
        <h2>CitationGen: what is different</h2>
        <p>
          CitationGen focuses on three gaps that show up in many citation tools:
          source labels, editable fields, and missing-field warnings.
        </p>

        <div className="article-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Citation Machine</th>
                <th scope="col">MyBib</th>
                <th scope="col">Scribbr</th>
                <th scope="col">ZoteroBib</th>
                <th scope="col">CitationGen</th>
              </tr>
            </thead>
            <tbody>
              <tr><th>Source labels</th><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td></tr>
              <tr><th>Editable fields</th><td>Paid only</td><td>Limited</td><td>No</td><td>Limited</td><td>Full (15 fields)</td></tr>
              <tr><th>Missing-field warnings</th><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td></tr>
              <tr><th>Journal abbreviations (NLM)</th><td>Partial</td><td>No</td><td>No</td><td>No</td><td>Yes (AMA, ACS, CSE, IEEE, Vancouver)</td></tr>
              <tr><th>Number of styles</th><td>7,000+</td><td>9,000+</td><td>~12</td><td>10,000+</td><td>10</td></tr>
              <tr><th>Batch DOI processing</th><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td></tr>
              <tr><th>RIS export</th><td>No</td><td>No</td><td>No</td><td>No</td><td>Yes</td></tr>
              <tr><th>Style versions</th><td>Unclear</td><td>APA 6/7, MLA 8/9</td><td>Unclear</td><td>APA 6/7</td><td>APA 6/7, MLA 8/9, Chicago AD/NB, Harvard variants</td></tr>
              <tr><th>Free to use</th><td>Limited</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
              <tr><th>No registration</th><td>No</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
              <tr><th>Open source</th><td>No</td><td>No</td><td>No</td><td>Yes</td><td>No</td></tr>
            </tbody>
          </table>
        </div>

        <p>
          CitationGen is not the most feature-complete option. ZoteroBib has 10,000 styles;
          Citation Machine covers niche journal formats CitationGen does not. The tradeoff is
          depth over breadth. Every style we support has version-specific CSL files, NLM journal
          abbreviation integration where relevant, and source labels that tell you exactly where
          each metadata field came from.
        </p>
      </section>

      <section>
        <h2>Which tool should you choose?</h2>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">If you need...</th><th scope="col">Choose</th><th scope="col">Because</th></tr>
            </thead>
            <tbody>
              <tr><th>A quick bibliography for a paper</th><td>MyBib</td><td>Fastest free tool. No friction. Same engine as Zotero.</td></tr>
              <tr><th>10,000+ styles for journal submission</th><td>ZoteroBib</td><td>Unmatched style breadth. Best for researchers who plan to use Zotero.</td></tr>
              <tr><th>7,000+ styles + editing (with budget)</th><td>Citation Machine</td><td>Widest commercial style library. But editing costs $9.95/month.</td></tr>
              <tr><th>Source verification, editing, and warnings</th><td>CitationGen</td><td>Only tool with source labels, full editing, and missing-field warnings.</td></tr>
              <tr><th>Science styles (ACS, AMA, Vancouver)</th><td>CitationGen</td><td>Only free tool with automatic NLM journal abbreviation support.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/* ====================================================================== */
/*  2. APA vs MLA                                                          */
/* ====================================================================== */

function ApaVsMla() {
  return (
    <>
      <section>
        <h2>Quick answer</h2>
        <div className="article-callout">
          <p>
            APA 7 is the standard in psychology, education, nursing, business, and the social
            sciences. MLA 9 is the standard in English, literature, foreign languages, and the
            humanities. The core difference: APA in-text uses (Author, Year) — research is
            date-sensitive. MLA in-text uses (Author Page) — the specific passage matters.
            This one difference in in-text format cascades into how you format every reference
            entry, from author names to title capitalization to where the date appears.
          </p>
          <p>
            If your syllabus says APA, use the{" "}
            <Link href={generatorPath("apa")}>APA Citation Generator</Link>. If it says MLA, use
            the{" "}
            <Link href={generatorPath("mla")}>MLA Citation Generator</Link>. If you are unsure,
            check the table below — the disciplines are the most reliable indicator.
          </p>
        </div>
      </section>

      <section>
        <h2>Where each style is used — and why it matters</h2>
        <p>
          APA emerged from psychology in 1929. The American Psychological Association needed a
          format that emphasized the recency of research because a 2023 study on cognitive bias might
          supersede a 2008 study on the same topic. The date goes immediately after the author name
          in both the in-text citation and the reference entry because when the research was
          published changes how it should be weighed [1].
        </p>
        <p>
          MLA emerged from literature and language studies. The Modern Language Association needed a
          format that emphasized <em>where</em> in a text an idea appeared because a line from page
          42 of a novel has a different meaning than a line from page 3. The page number is the
          central identifier, not the year [2].
        </p>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">APA 7</th><th scope="col">MLA 9</th></tr>
            </thead>
            <tbody>
              <tr><td>Psychology</td><td>English &amp; literature</td></tr>
              <tr><td>Education &amp; special education</td><td>Foreign languages &amp; comparative literature</td></tr>
              <tr><td>Nursing, medicine, public health</td><td>Cultural studies &amp; ethnic studies</td></tr>
              <tr><td>Business, management, economics</td><td>Philosophy &amp; religious studies</td></tr>
              <tr><td>Sociology, anthropology, social work</td><td>Art history, musicology, theater</td></tr>
              <tr><td>Criminology &amp; criminal justice</td><td>Film &amp; media studies</td></tr>
              <tr><td>Political science &amp; public policy</td><td>Rhetoric &amp; composition</td></tr>
              <tr><td>Communication &amp; journalism</td><td>Creative writing</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>In-text citations: what actually changes</h2>
        <p>
          The in-text citation format is where students make the most errors when switching between
          styles. Here is the same source cited in both formats, followed by the rules.
        </p>

        <h3>APA 7 in-text rules</h3>
        <ul>
          <li><strong>Narrative citation:</strong> &ldquo;Smith (2023) found that...&rdquo; — author name in the sentence, year in parentheses.</li>
          <li><strong>Parenthetical citation:</strong> &ldquo;The results confirmed the hypothesis (Smith, 2023).&rdquo; — both in parentheses, separated by comma.</li>
          <li><strong>Direct quote with page:</strong> &ldquo;The data were conclusive (Smith, 2023, p. 42).&rdquo; — p. for a single page, pp. for a range.</li>
          <li><strong>Two authors:</strong> (Smith &amp; Jones, 2023) — use &amp; inside parentheses, &ldquo;and&rdquo; in narrative.</li>
          <li><strong>Three or more authors:</strong> (Smith et al., 2023) — APA 7 uses &ldquo;et al.&rdquo; for 3+ from the first citation. APA 6 required listing up to 5 in the first citation — a major 7th edition change.</li>
        </ul>

        <h3>MLA 9 in-text rules</h3>
        <ul>
          <li><strong>Parenthetical citation:</strong> &ldquo;The results were conclusive (Smith 42).&rdquo; — no comma between author and page. No &ldquo;p.&rdquo; or &ldquo;pp.&rdquo;</li>
          <li><strong>Signal phrase:</strong> &ldquo;Smith argues that the results were conclusive (42).&rdquo; — page alone at the end when the author is named in the sentence.</li>
          <li><strong>Two authors:</strong> (Smith and Jones 42) — write out &ldquo;and,&rdquo; not &amp;.</li>
          <li><strong>Three or more authors:</strong> (Smith et al. 42) — same pattern as APA but without the comma before the page.</li>
          <li><strong>No page available:</strong> (Smith) — omit the page. Do not invent one. For online sources, MLA recommends the author alone.</li>
          <li><strong>Corporate author:</strong> (National Institutes of Health 12) — write out the full organization name. Common mistake: abbreviating it in-text.</li>
        </ul>

        <div className="article-callout">
          <p>
            The most common mistake students make: using (Smith, 2023, p. 42) in an MLA paper. The
            year, comma, and &ldquo;p.&rdquo; all belong to APA. In MLA, the same source would be
            (Smith 42). Your instructor notices this immediately.
          </p>
        </div>
      </section>

      <section>
        <h2>Reference list: side-by-side comparison</h2>
        <p>
          The same journal article formatted in APA 7 and MLA 9, with every difference annotated:
        </p>
        <div className="article-callout">
          <p>
            <strong>APA 7:</strong> Shokri, A., &amp; Que, L. (2015). Conversion of aldehyde to
            alkane by a peroxoiron(III) complex: A functional model for the cyanobacterial
            aldehyde-deformylating oxygenase. <em>Journal of the American Chemical Society</em>,
            <em>137</em>(24), 7686–7691. https://doi.org/10.1021/jacs.5b01053
          </p>
          <p>
            <strong>MLA 9:</strong> Shokri, Alireza, and Lawrence Que. &ldquo;Conversion of
            Aldehyde to Alkane by a Peroxoiron(III) Complex: A Functional Model for the
            Cyanobacterial Aldehyde-Deformylating Oxygenase.&rdquo; <em>Journal of the American
            Chemical Society</em>, vol. 137, no. 24, 2015, pp. 7686–91. doi:10.1021/jacs.5b01053.
          </p>
        </div>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Element</th><th scope="col">APA 7</th><th scope="col">MLA 9</th></tr>
            </thead>
            <tbody>
              <tr><th>List title</th><td>References</td><td>Works Cited</td></tr>
              <tr><th>Author names</th><td>Last, F. M. (initials only)</td><td>Last, First M. (full first name)</td></tr>
              <tr><th>Date placement</th><td>Right after author: (2015).</td><td>After journal name, volume, and issue: 2015,</td></tr>
              <tr><th>Article title case</th><td>Sentence case: only first word and proper nouns capitalized</td><td>Title case: all major words capitalized</td></tr>
              <tr><th>Article title formatting</th><td>Plain text</td><td>In quotation marks</td></tr>
              <tr><th>Journal title</th><td><em>Italicized</em>, Title Case</td><td><em>Italicized</em>, Title Case</td></tr>
              <tr><th>Volume/issue</th><td><em>137</em>(24) — volume italicized, issue in parentheses, no &ldquo;vol.&rdquo;</td><td>vol. 137, no. 24 — &ldquo;vol.&rdquo; and &ldquo;no.&rdquo; spelled out</td></tr>
              <tr><th>Pages</th><td>7686–7691 (full page range)</td><td>pp. 7686–91 (abbreviated second number)</td></tr>
              <tr><th>DOI format</th><td>https://doi.org/10.1021/...</td><td>doi:10.1021/...</td></tr>
              <tr><th>Hanging indent</th><td>0.5 inches</td><td>0.5 inches</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Six common mistakes when switching between APA and MLA</h2>
        <ol>
          <li>
            <strong>Copying the in-text format across styles.</strong> (Smith, 2023, p. 42) is APA.
            (Smith 42) is MLA. If you paste an APA in-text citation into an MLA paper, the year,
            comma, and &ldquo;p.&rdquo; are all wrong. Rewrite from scratch — do not edit in place.
          </li>
          <li>
            <strong>Using initials in MLA.</strong> APA abbreviates first names: &ldquo;Shokri, A.&rdquo;
            MLA requires the full first name: &ldquo;Shokri, Alireza.&rdquo; If your generator output
            shows initials in an MLA paper, the style setting is wrong.
          </li>
          <li>
            <strong>Forgetting title case in MLA.</strong> APA uses sentence case for article titles
            (only first word capitalized). MLA uses headline-style title case (all major words
            capitalized). Switching between them requires manual review — a generator may not
            catch every word.
          </li>
          <li>
            <strong>Omitting the container in MLA.</strong> MLA 9 requires the &ldquo;container&rdquo;
            — the larger work that holds the source. For an article, the journal is Container 1. For a
            chapter, the book is the container. APA does not use the container concept. Students who
            treat MLA like APA often leave out the container entirely.
          </li>
          <li>
            <strong>Treating &ldquo;n.d.&rdquo; as universal.</strong> APA 7 uses (n.d.) when no date
            is found. MLA 9 does not use &ldquo;n.d.&rdquo; — it omits the date entirely. If you see
            &ldquo;n.d.&rdquo; in an MLA citation, the generator applied the wrong style.
          </li>
          <li>
            <strong>Mislabeling the reference list.</strong> APA calls it &ldquo;References.&rdquo;
            MLA calls it &ldquo;Works Cited.&rdquo; They are not interchangeable. Instructors check
            the heading before they check individual citations.
          </li>
        </ol>
      </section>
    </>
  );
}

/* ====================================================================== */
/*  3. Free vs Paid Citation Generators                                    */
/* ====================================================================== */

function FreeVsPaid() {
  return (
    <>
      <section>
        <h2>Quick answer</h2>
        <div className="article-callout">
          <p>
            Paying for a citation tool unlocks three things: (1) ad-free editing, (2) plagiarism
            checking, and (3) grammar and writing suggestions. It does <strong>not</strong> give
            you more accurate citations. The underlying metadata — from CrossRef, Google Books,
            and URL scraping — is identical whether you pay $0 or $9.95/month. The free MyBib
            and ZoteroBib use the same citeproc-js formatting engine as expensive reference managers
            like Zotero and Mendeley [3].
          </p>
          <p>
            If you only need citations, use the{" "}
            <Link href={generatorPath("apa")}>free APA Citation Generator</Link> and keep your
            money. If you want an all-in-one writing suite with integrated plagiarism checks, a
            subscription may be worth it — but understand what you are actually buying.
          </p>
        </div>
      </section>

      <section>
        <h2>What the subscription actually buys — feature by feature</h2>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Feature</th><th scope="col">Free tools<br/>(MyBib, ZoteroBib, CitationGen)</th><th scope="col">Paid tools<br/>(Citation Machine, Scribbr, EasyBib)</th><th scope="col">Is the paid version better?</th></tr>
            </thead>
            <tbody>
              <tr><th>Citation generation</th><td>Yes</td><td>Yes</td><td>Identical output. Same data sources, same formatting engines.</td></tr>
              <tr><th>Multiple citation styles</th><td>Yes — 9,000+ (MyBib, ZoteroBib)</td><td>Yes — 7,000+ (Citation Machine)</td><td>Free tools offer more styles, not fewer.</td></tr>
              <tr><th>Field editing</th><td>Varies: limited on MyBib and ZoteroBib, full on CitationGen</td><td>Yes (paid tier only on Citation Machine)</td><td>CitationGen and paid Citation Machine offer full field editing.</td></tr>
              <tr><th>Source labels</th><td>CitationGen only</td><td>No</td><td>No paid tool shows metadata provenance.</td></tr>
              <tr><th>Missing-field warnings</th><td>CitationGen only</td><td>No</td><td>Paid tools silently omit gaps just like free tools.</td></tr>
              <tr><th>Plagiarism check</th><td>No</td><td>Yes</td><td>The main reason to pay. But your university may already provide Turnitin.</td></tr>
              <tr><th>Grammar check</th><td>No</td><td>Yes</td><td>Free Grammarly matches most paid grammar tools.</td></tr>
              <tr><th>Ad-free interface</th><td>Yes (all except Citation Machine free)</td><td>Yes</td><td>Citation Machine free tier has ads; the others do not.</td></tr>
              <tr><th>No registration required</th><td>Yes (ZoteroBib, CitationGen)</td><td>No</td><td>All paid tools require accounts.</td></tr>
              <tr><th>Export to Word / Google Docs</th><td>Yes (MyBib)</td><td>Yes</td><td>Equal. MyBib free matches paid export features.</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The pattern is consistent: the citation output — the text you actually use — is identical
          across free and paid tools. The paid features are writing and editing tools bundled with
          the citation generator, not improvements to the citation engine itself.
        </p>
      </section>

      <section>
        <h2>Real cost comparison: what you spend over 4 years</h2>
        <p>
          For a student completing a 4-year undergraduate degree, here is the total cost of using
          each tool. We assume one citation-heavy paper per semester (2 semesters/year × 4 years).
        </p>
        <div className="article-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">Monthly price</th>
                <th scope="col">Annual price</th>
                <th scope="col">4-year total</th>
              </tr>
            </thead>
            <tbody>
              <tr><th>MyBib</th><td>$0</td><td>$0</td><td>$0</td></tr>
              <tr><th>ZoteroBib</th><td>$0</td><td>$0</td><td>$0</td></tr>
              <tr><th>CitationGen</th><td>$0</td><td>$0</td><td>$0</td></tr>
              <tr><th>Citation Machine (Chegg Writing)</th><td>$9.95</td><td>$59.40 (50% off)</td><td>$237.60</td></tr>
              <tr><th>Scribbr (plagiarism + proofreading)</th><td>~$19.95</td><td>~$119.95</td><td>~$479.80</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Pricing verified July 5, 2026.</strong> Citation Machine pricing from
          citationmachine.net/upgrade. Scribbr pricing averaged across standard document lengths.
          Annual discounts are calculated from each tool&apos;s advertised annual rate. Prices do
          not include tax.
        </p>
        <div className="article-callout">
          <p>
            $237.60 over four years for Citation Machine may be reasonable if you use the
            plagiarism checker every semester and write multiple papers. But for citation
            generation alone — a task that the free MyBib and ZoteroBib perform identically —
            that same $237.60 buys you nothing you cannot get for free. You are paying for the
            plagiarism tool, not the citation tool.
          </p>
        </div>
      </section>

      <section>
        <h2>When a paid subscription makes sense</h2>
        <p>There are genuine reasons to pay. Here is when it is justified and when it is not:</p>
        <ul>
          <li>
            <strong>You write 6+ papers per year</strong> and want integrated plagiarism checks in
            the same tool as your citation workflow. In this case, Chegg Writing ($59.40/year)
            bundles both, and the time saved switching between tools may justify the cost.
          </li>
          <li>
            <strong>Your university does not provide Turnitin</strong> or another plagiarism
            checker. If you have no free alternative, a plagiarism tool integrated with your citation
            generator saves time. But check your library website first — many universities provide
            Turnitin, Grammarly Premium, or SafeAssign at no cost to students.
          </li>
          <li>
            <strong>You are an instructor building a course bibliography</strong> and need to
            verify citations for accuracy. The editing features in paid Citation Machine let you
            correct fields before exporting. However, our{" "}
            <Link href={generatorPath("apa")}>free APA generator</Link> offers the same editing
            capability with source labels that verify provenance.
          </li>
          <li>
            <strong>You need niche citation styles</strong> that free tools with limited style
            libraries do not support. But ZoteroBib&apos;s 10,000+ free styles cover almost every
            journal-specific format. Only a tiny fraction of researchers need styles beyond
            ZoteroBib&apos;s library.
          </li>
        </ul>
      </section>
    </>
  );
}

/* ====================================================================== */
/*  4. Academic Integrity and Citations                                    */
/* ====================================================================== */

function AcademicIntegrity() {
  return (
    <>
      <section>
        <h2>Quick answer</h2>
        <div className="article-callout">
          <p>
            A citation is not a bureaucratic requirement or a formatting chore. It is the visible
            trail of your research — the evidence that lets your reader find the exact source you
            used, verify your evidence, and follow your thinking. The most common citation problem
            students face is not formatting errors. It is forgetting to cite at all. A perfectly
            formatted citation for a source you failed to include is useless. A poorly formatted
            citation for a source you did include is better than no citation at all.
          </p>
          <p>
            This guide is built around a simple principle: <strong>when in doubt, cite it.</strong>{" "}
            Over-citing is not an academic offense. Under-citing is [4].
          </p>
        </div>
      </section>

      <section>
        <h2>What needs a citation — and what does not</h2>
        <p>
          The International Center for Academic Integrity (ICAI) defines academic integrity as a
          commitment to six fundamental values: honesty, trust, fairness, respect, responsibility,
          and courage [4]. Citations are the practical mechanism that operationalizes honesty and
          responsibility — they make your sources visible and your intellectual debts explicit.
        </p>
        <p><strong>You need a citation for:</strong></p>
        <ul>
          <li><strong>Direct quotes.</strong> Any text you copy word-for-word from a source, even a short phrase or technical term. The quote marks signal to the reader that these are not your words. The citation tells them whose words they are. A direct quote without both quotation marks and a citation is plagiarism even if the source is in your bibliography.</li>
          <li><strong>Paraphrased ideas.</strong> When you restate someone else&apos;s argument, finding, or analysis in your own words, you must still cite the source. The idea remains theirs; only the wording is yours. This is the most commonly missed citation — students think changing the words eliminates the need to cite. It does not [5].</li>
          <li><strong>Data, statistics, and research findings.</strong> &ldquo;68% of students reported...&rdquo; — that number came from somewhere. If you did not conduct the study yourself, cite the source that did. Fabricated data is a far more serious offense than missing citations.</li>
          <li><strong>Images, charts, tables, and figures.</strong> Any visual element you did not create yourself needs both a caption citation and a reference list entry. APA calls this &ldquo;From [source]&rdquo; with a copyright attribution if reproducing a published figure [1].</li>
          <li><strong>Arguments, theories, frameworks, and models.</strong> &ldquo;Maslow&apos;s hierarchy of needs suggests...&rdquo; — you must cite Maslow (or the specific edition you consulted). Established theories still need citations, even if everyone in your field knows them. The citation points to the specific formulation you are using.</li>
        </ul>
        <p><strong>You do not need a citation for:</strong></p>
        <ul>
          <li>Common knowledge in your field — facts that appear uncontested in 3+ independent, credible sources (the &ldquo;three-source rule&rdquo;). &ldquo;DNA is a double helix&rdquo; in biology. &ldquo;World War II ended in 1945&rdquo; in history. But be careful: what is common knowledge to a graduate student may not be common knowledge to an undergraduate. When in doubt, cite.</li>
          <li>Your own original ideas, analysis, interpretations, and conclusions. These are your contribution to the scholarly conversation.</li>
        </ul>
      </section>

      <section>
        <h2>Six plagiarism traps every student should know about</h2>
        <ol>
          <li>
            <strong>Patchwriting.</strong> Taking a sentence from a source, swapping out a few words
            with synonyms, and keeping the same sentence structure. This is the most common form of
            unintentional plagiarism among undergraduates [5].
            <br/><em>Solution:</em> Read the passage. Close the source. Wait 5 minutes. Write the idea
            from memory. Then reopen the source to verify accuracy. If your sentence structure still
            mirrors the original, you need another round of revision.
          </li>
          <li>
            <strong>Poor note-taking hygiene.</strong> Copying passages into your research notes
            without marking them as quotes or recording the page number. Two weeks later, you forget
            that those words were not yours and paste them into your draft.
            <br/><em>Solution:</em> Put quotation marks around every copied passage in your notes.
            Record the page number immediately. Use a consistent system: a separate column for
            quotes vs your own thoughts. This is the single highest-impact habit you can build.
          </li>
          <li>
            <strong>Self-plagiarism.</strong> Submitting your own previously graded work in a new
            course without permission. Most university honor codes treat this as a violation because
            each assignment expects original work for that course.
            <br/><em>Solution:</em> If you want to build on your previous work, cite it as you would
            any other source. Even better: ask your instructor before reusing material. Some
            instructors allow it with proper citation; others require entirely new work.
          </li>
          <li>
            <strong>Omitting page numbers for direct quotes.</strong> Writing &ldquo;(Smith, 2023)&rdquo;
            after a direct quote from page 42 of a 300-page book hides the location from your
            reader. This is a citation error, but repeated across a paper it can look like
            fabrication — as though you cited a source you did not actually read.
            <br/><em>Solution:</em> APA: (Smith, 2023, p. 42). MLA: (Smith 42). Always include
            the specific location of quoted material.
          </li>
          <li>
            <strong>Blind trust in citation generators.</strong> Generators pull data from APIs
            that can return incomplete or incorrect information. A CrossRef record may have a wrong
            author name. A Google Books entry may list the wrong edition. If you copy-paste
            without checking, these errors become your responsibility.
            <br/><em>Solution:</em> Use the generator as a starting point. Verify every field
            against the source itself. Our{" "}
            <Link href={generatorPath("apa")}>APA citation generator</Link> labels where each
            data field came from so you know which fields to double-check.
          </li>
          <li>
            <strong>Last-minute bibliography assembly.</strong> Waiting until the night before the
            deadline to compile your reference list. This leads to missing sources, inconsistent
            formatting, and sources you can no longer locate.
            <br/><em>Solution:</em> Build your bibliography as you research, not as you finish. Add
            each source to your reference list the moment you decide to use it. A working
            bibliography from day one prevents last-minute panic and accidental omission.
          </li>
        </ol>
      </section>

      <section>
        <h2>How a citation generator fits into honest academic work</h2>
        <p>
          A citation generator automates formatting — it applies style rules to source metadata.
          It does not and cannot:
        </p>
        <ul>
          <li>Check whether you actually read the source — only you know that.</li>
          <li>Verify that your paraphrase is sufficiently different from the original — that requires your judgment.</li>
          <li>Decide what needs a citation and what is common knowledge — that requires understanding your field.</li>
          <li>Ensure your direct quotes are accurate — only checking against the original can do that.</li>
        </ul>
        <p>
          The generator handles the formatting. You handle the integrity. Here is the workflow we
          recommend to students:
        </p>
        <ol>
          <li>Find a source. Read it. Decide whether and how to use it.</li>
          <li>Immediately generate a citation for it. Add it to your working reference list.</li>
          <li>Verify: check the author name, the title, the date, and the DOI/URL against the actual source. Do not skip this step.</li>
          <li>As you write, add the corresponding in-text citation every time you use the source.</li>
          <li>Before submitting, cross-reference: every in-text citation should point to a reference list entry. Every reference list entry should have at least one in-text citation. No orphaned references, no orphaned citations.</li>
        </ol>
      </section>
    </>
  );
}
