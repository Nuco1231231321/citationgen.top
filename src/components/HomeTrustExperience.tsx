const readerChecks = [
  {
    title: "Missing author or organization",
    body:
      "If a page does not expose a clear author line, you should see that gap before you copy the citation."
  },
  {
    title: "Thin website metadata",
    body:
      "Web sources often need a manual date, site name, or title cleanup. The result should help you spot that immediately."
  },
  {
    title: "Journal details that need a second look",
    body:
      "Volume, issue, pages, DOI, and abbreviated journal titles matter most when the citation is headed into a paper or report."
  }
];

const readerNotes = [
  {
    role: "Undergraduate writer",
    quote:
      "I need the citation quickly, but I still want to see whether the page is missing an author or date before I paste it."
  },
  {
    role: "Chemistry lab author",
    quote:
      "The useful part is checking the DOI record and the journal details while the source is still in front of me."
  },
  {
    role: "Medical course researcher",
    quote:
      "For AMA or Vancouver, the difference is usually in the source details, not in how dramatic the interface looks."
  },
  {
    role: "Graduate student",
    quote:
      "When a website has weak metadata, I want the tool to surface the gap instead of pretending the citation is complete."
  }
];

const faqFacts = [
  {
    title: "Paste first",
    body: "DOI, ISBN, URL, title, or manual source fields all work."
  },
  {
    title: "No invented data",
    body: "Missing author, date, page, DOI, ISBN, and URL details stay visible as warnings."
  },
  {
    title: "Edit before copy",
    body: "You can correct fields and regenerate the citation before it leaves the page."
  }
];

const faqs = [
  {
    question: "What can I paste into CitationGen?",
    answer:
      "You can paste a DOI, ISBN, URL, article title, book title, or enter source fields manually. Public lookups are used when a reliable record is available."
  },
  {
    question: "Does the generator invent missing fields?",
    answer:
      "No. Missing author, date, page, DOI, ISBN, or URL details are surfaced as warnings so you can review them before copying."
  },
  {
    question: "Why are source labels shown with the result?",
    answer:
      "Citation quality depends on metadata quality. Labels such as CrossRef, Google Books, URL metadata, NLM, or manual entry help you judge the result."
  },
  {
    question: "Can I edit the citation after lookup?",
    answer:
      "Yes. Authors, title, date, journal, publisher, DOI, URL, ISBN, volume, issue, and page fields remain editable before you regenerate or copy."
  },
  {
    question: "Which citation styles are supported?",
    answer:
      "CitationGen supports common academic styles including APA, MLA, Chicago, Turabian, Harvard, AMA, ACS, CSE, IEEE, Vancouver, and NLM-backed journal abbreviation workflows."
  }
];

export function HomeTrustExperience() {
  return (
    <>
      <section className="site-shell home-reader-notes py-12" aria-labelledby="home-reader-notes-heading">
        <div className="home-reader-notes-layout">
          <div className="home-reader-notes-copy">
            <h2 id="home-reader-notes-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              Most citation mistakes happen before the final punctuation.
            </h2>
            <p>
              Before you copy, check whether the source record is complete enough to use as-is or
              whether it still needs a manual fix.
            </p>

            <ul className="home-reader-checklist">
              {readerChecks.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="home-reader-notes-grid" aria-label="Citation workflow reader notes">
            {readerNotes.map((note) => (
              <article key={note.role} className="home-reader-note">
                <p className="home-reader-note-quote">“{note.quote}”</p>
                <p className="home-reader-note-role">{note.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell home-faq-block py-12" aria-labelledby="home-faq-heading">
        <div className="faq-section faq-section--editorial">
          <div className="faq-intro">
            <h2 id="home-faq-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              Questions that matter when the source record is incomplete.
            </h2>
            <p className="mt-3 text-pretty text-sm leading-6 text-dim">
              Use these answers when a DOI is missing fields, a website has thin metadata, or a
              citation needs one last edit before you use it.
            </p>

            <div className="faq-fact-list">
              {faqFacts.map((fact) => (
                <article key={fact.title}>
                  <strong>{fact.title}</strong>
                  <p>{fact.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <span aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
