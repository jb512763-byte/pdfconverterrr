import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { TOOLS } from "@/lib/tools";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="font-display text-xl font-bold">
            Convert<span className="text-primary">Kit</span>
          </Link>
          <nav className="hidden gap-4 text-sm text-muted-foreground md:flex">
            {TOOLS.slice(0, 5).map((t) => (
              <a key={t.slug} href={`/${t.slug}`} className="hover:text-foreground">{t.name}</a>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      {/* Ad slot: drop your AdSense unit here */}
      <footer className="mt-20 border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold">Convert<span className="text-primary">Kit</span></p>
            <p className="mt-2 text-sm text-muted-foreground">Free file converters that run 100% in your browser. Nothing is uploaded.</p>
          </div>
          {TOOLS.map((t) => (
            <a key={t.slug} href={`/${t.slug}`} className="text-sm text-muted-foreground hover:text-primary">{t.name}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
