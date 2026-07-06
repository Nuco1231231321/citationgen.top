"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    role: "Undergraduate writer",
    quote:
      "I need the citation fast, but I also need to see if the author or date is missing before I paste it into the paper."
  },
  {
    role: "Chemistry lab author",
    quote:
      "ACS citations are picky. The useful part is seeing the DOI record and checking journal details before copying."
  },
  {
    role: "Medical course researcher",
    quote:
      "For AMA and Vancouver, I care less about decoration and more about whether the source data is visible and editable."
  },
  {
    role: "Graduate student",
    quote:
      "When a website has weak metadata, I want the generator to tell me what is missing instead of pretending it knows."
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(motionQuery.matches);

    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);
    return () => motionQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || !isVisible) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % testimonials.length);
    }, 4400);

    return () => window.clearInterval(timer);
  }, [isVisible, paused, reduceMotion]);

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + testimonials.length) % testimonials.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % testimonials.length);
  }

  return (
    <>
      <section className="site-shell home-testimonials py-12" aria-labelledby="home-testimonials-heading">
        <div className="home-section-heading">
          <p className="home-kicker">Writing workflows</p>
          <h2 id="home-testimonials-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
            Built for the moment before you submit.
          </h2>
          <p className="mt-3 max-w-[62ch] text-pretty text-sm leading-6 text-dim">
            Create citations for papers, lab reports, literature reviews, and reference lists
            without losing sight of source quality.
          </p>
        </div>

        <div
          ref={carouselRef}
          className="testimonial-carousel"
          aria-roledescription="carousel"
          aria-label="CitationGen user workflow comments"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
          }}
        >
          <div className="testimonial-window">
            <div
              className="testimonial-track"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <article
                  key={testimonial.role}
                  className="testimonial-card"
                  aria-hidden={activeIndex !== index}
                >
                  <p className="testimonial-quote">“{testimonial.quote}”</p>
                  <p className="testimonial-role">{testimonial.role}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="testimonial-controls">
            <button type="button" onClick={showPrevious} aria-label="Show previous comment">
              Previous
            </button>
            <div className="testimonial-dots" aria-label="Select comment">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.role}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show comment ${index + 1}`}
                  aria-current={activeIndex === index}
                />
              ))}
            </div>
            <button type="button" onClick={showNext} aria-label="Show next comment">
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="site-shell home-faq-block py-12" aria-labelledby="home-faq-heading">
        <div className="faq-section">
          <div className="faq-intro">
            <p className="home-kicker">FAQ</p>
            <h2 id="home-faq-heading" className="font-editorial text-balance text-[30px] leading-[1.16] text-ink md:text-[42px]">
              Questions before you copy a citation.
            </h2>
            <p className="mt-3 text-pretty text-sm leading-6 text-dim">
              Check what you can paste, how missing fields are handled, and which citation
              styles are available.
            </p>
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
