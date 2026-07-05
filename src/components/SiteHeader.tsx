import Link from "next/link";
import { List } from "@phosphor-icons/react/dist/ssr";
import { corePages } from "@/lib/navigation";
import { generatorPath } from "@/lib/formats";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const blogPage = corePages.find((p) => p.href === "/blog/");
  const aboutPage = corePages.find((p) => p.href === "/about/");

  return (
    <header className="site-header">
      <nav aria-label="Main navigation" className="site-shell site-nav">
        <Link href="/" className="nav-brand">
          <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-accent" />
          <span>{siteConfig.name}</span>
        </Link>

        <div className="desktop-nav" aria-label="Primary sections">
          <Link href="/tools/" className="nav-link">
            Citation tools
          </Link>

          {blogPage ? (
            <Link href={blogPage.href} className="nav-link">
              Blog
            </Link>
          ) : null}

          {aboutPage ? (
            <Link href={aboutPage.href} className="nav-link">
              About
            </Link>
          ) : null}
        </div>

        <div className="nav-actions">
          <Link href={generatorPath("apa")} className="nav-cta">
            Start citing
          </Link>

          <details className="mobile-nav">
            <summary>
              <List aria-hidden="true" size={18} />
              <span>Menu</span>
            </summary>
            <div className="mobile-nav-panel">
              <Link href={generatorPath("apa")} className="mobile-nav-primary">
                Start citing
              </Link>
              <Link href="/tools/" className="mobile-nav-about">
                Citation tools
              </Link>
              {blogPage ? (
                <Link href={blogPage.href} className="mobile-nav-about">
                  Blog
                </Link>
              ) : null}
              {aboutPage ? (
                <Link href={aboutPage.href} className="mobile-nav-about">
                  About
                </Link>
              ) : null}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
