import Link from "next/link";
import { GraduationCap, List } from "@phosphor-icons/react/dist/ssr";
import { corePages } from "@/lib/navigation";
import { generatorPath } from "@/lib/formats";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const blogPage = corePages.find((p) => p.href === "/blog/");
  const aboutPage = corePages.find((p) => p.href === "/about/");

  return (
    <header className="site-header">
      <div className="site-topbar">
        <div className="site-shell site-topbar-inner">
          <Link href="/#home-faq-heading">FAQ</Link>
          {aboutPage ? <Link href={aboutPage.href}>About</Link> : null}
          {blogPage ? <Link href={blogPage.href}>Guides</Link> : null}
        </div>
      </div>
      <nav aria-label="Main navigation" className="site-shell site-nav">
        <Link href="/" className="nav-brand">
          <span aria-hidden="true" className="nav-brand-mark">
            <GraduationCap size={26} weight="bold" />
          </span>
          <span>{siteConfig.name}</span>
        </Link>

        <div className="desktop-nav" aria-label="Primary sections">
          <Link href="/tools/" className="nav-link">
            Citation tools
          </Link>
          <Link href={generatorPath("apa")} className="nav-link">
            APA
          </Link>
          <Link href={generatorPath("mla")} className="nav-link">
            MLA
          </Link>

          {blogPage ? (
            <Link href={blogPage.href} className="nav-link">
              Guides
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
