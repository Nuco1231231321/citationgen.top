import Link from "next/link";
import { corePages, formatLinks, toolClusters } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer mt-24 bg-ink text-faint">
      <div className="site-shell grid gap-10 py-16 lg:grid-cols-[0.9fr_2.1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2 text-page">
            <span aria-hidden="true" className="block h-2 w-2 shrink-0 rounded-full bg-accent" />
            <span className="font-medium">{siteConfig.name}</span>
          </div>
          <p className="max-w-[42ch] text-pretty text-sm leading-6">
            Free citation tools using real metadata sources, editable fields, and clear source
            labels.
          </p>
          <nav aria-label="Site links" className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {corePages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="text-sm underline-offset-4 transition-colors hover:text-page"
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav aria-label="Generator links" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {toolClusters.map((cluster) => (
            <div key={cluster.title}>
              <h2 className="text-sm font-medium text-page">{cluster.title}</h2>
              <ul className="mt-3 grid gap-2">
                {formatLinks(cluster.slugs).map((format) => (
                  <li key={format.slug}>
                    <Link
                      href={format.href}
                      className="text-sm underline-offset-4 transition-colors hover:text-page"
                    >
                      {format.label} generator
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
