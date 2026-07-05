import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.svg"
  },
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    url: absoluteUrl("/"),
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl("/images/home/citation-generator-hero-desk.jpg"),
        width: 1800,
        height: 1012,
        alt: "CitationGen citation generator workspace"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [absoluteUrl("/images/home/citation-generator-hero-desk.jpg")]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] font-sans antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
