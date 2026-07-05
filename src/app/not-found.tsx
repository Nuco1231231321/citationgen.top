import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[760px] px-4 py-20 md:px-6">
      <h1 className="font-editorial text-[40px] leading-[1.1] text-carbon-ink">
        Page not found
      </h1>
      <p className="mt-4 text-pretty text-base leading-7 text-graphite">
        This citation page is not available. Start from the format hub and choose a live generator.
      </p>
      <Link
        href="/"
        className="btn mt-8 inline-flex whitespace-nowrap"
      >
        Go to homepage
      </Link>
    </main>
  );
}
