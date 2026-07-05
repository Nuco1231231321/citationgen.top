import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { collectionPageJsonLd } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

const pageTitle = "About CitationGen";
const pageDescription =
  "How CitationGen uses public metadata sources, editable fields, source labels, and missing-field warnings.";

const trustChecks = [
  {
    title: "Public metadata first",
    body: "DOI lookups use CrossRef, ISBN lookups use Google Books when reachable, and websites are checked through public page metadata."
  },
  {
    title: "No invented fields",
    body: "If a source does not expose an author, date, DOI, page range, publisher, or URL, the page shows a warning instead of silently filling it."
  },
  {
    title: "Editable before copying",
    body: "The citation is generated from fields you can review and edit, which is safer than only editing the final formatted text."
  },
  {
    title: "Style-specific checks",
    body: "Science and medical formats can use NLM journal abbreviations where a trusted match is available."
  }
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: absoluteUrl("/about/")
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl("/about/"),
    type: "website"
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription
  }
};

export default function AboutPage() {
  return (
    <main>
      <JsonLd
        data={collectionPageJsonLd({
          name: pageTitle,
          description: pageDescription,
          path: "/about/",
          breadcrumbs: [
            { name: "Home", url: absoluteUrl("/") },
            { name: "About", url: absoluteUrl("/about/") }
          ]
        })}
      />

      <section className="site-shell py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-dim">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-ink transition-colors">Home</Link></li>
            <li aria-hidden="true" className="text-faint">/</li>
            <li className="font-medium text-ink">About</li>
          </ol>
        </nav>
        <div className="max-w-[760px]">
          <h1 className="font-editorial text-balance text-[34px] leading-[1.12] text-ink md:text-[52px]">
            Built for citations you can check before copying
          </h1>
          <p className="mt-4 max-w-[64ch] text-pretty text-[16px] leading-7 text-dim">
            CitationGen is a free academic writing tool. Its main job is to turn real source
            metadata into formatted citations while making the source trail visible.
          </p>
        </div>
      </section>

      <section className="site-shell pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {trustChecks.map((check) => (
            <article key={check.title} className="rounded-3xl bg-surface p-6">
              <h2 className="font-editorial text-[25px] leading-[1.2] text-ink">{check.title}</h2>
              <p className="mt-3 text-pretty text-sm leading-6 text-dim">{check.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-surface p-6 md:p-8">
          <h2 className="font-editorial text-[28px] leading-[1.2] text-ink">
            What the labels mean
          </h2>
          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-ink">Data from CrossRef</dt>
              <dd className="mt-1 text-sm leading-6 text-dim">
                Article metadata was found through a public DOI or title record.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink">Data from Google Books</dt>
              <dd className="mt-1 text-sm leading-6 text-dim">
                Book metadata was found through an ISBN or book title lookup.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink">Metadata extracted from URL</dt>
              <dd className="mt-1 text-sm leading-6 text-dim">
                Public page title, canonical URL, site name, Open Graph tags, or JSON-LD were found.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-ink">Manually entered</dt>
              <dd className="mt-1 text-sm leading-6 text-dim">
                The citation was generated from fields entered or edited by the user.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
