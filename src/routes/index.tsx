import { createFileRoute } from "@tanstack/react-router";
import { FileImage, FileText, Images, Minimize2, Scaling, ShieldCheck, Zap, Lock } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { TOOLS } from "@/lib/tools";

const TITLE = "ConvertKit – Free All-in-One PDF & Image Converter (No Upload)";
const DESC = "Convert PDF to JPG, JPG to PDF, PNG, WebP, compress and resize images free. 100% in your browser – no upload, no sign-up, fully private.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "ConvertKit", description: DESC }) }],
  }),
  component: Index,
});

const icons: Record<string, typeof FileImage> = { "pdf-to-img": FileImage, "img-to-pdf": FileText, convert: Images, compress: Minimize2, resize: Scaling };

function Index() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 pt-16 text-center">
        <p className="inline-block rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">Your files never leave your device</p>
        <h1 className="mt-5 text-5xl font-bold leading-tight md:text-6xl">Every file converter.<br /><span className="text-primary">One free place.</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">PDF to JPG, JPG to PDF, PNG, WebP, compress and resize — instant, private and free. Everything runs right in your browser.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-primary" /> No upload</span>
          <span className="inline-flex items-center gap-1"><Zap className="h-4 w-4 text-primary" /> Super fast</span>
          <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4 text-primary" /> No sign-up</span>
        </div>
      </section>
      <section className="mx-auto mt-12 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => {
          const Icon = icons[t.kind];
          return (
            <a key={t.slug} href={`/${t.slug}`} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary">
              <Icon className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-lg font-bold">{t.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t.short}</p>
            </a>
          );
        })}
      </section>
      <section className="mx-auto mt-20 max-w-3xl px-4">
        <h2 className="text-2xl font-bold">Why ConvertKit?</h2>
        <p className="mt-3 text-muted-foreground">Most online converters upload your documents to their servers. ConvertKit does all the work on your own device, so private files like ID cards, bills and photos stay with you. It is faster too — there is no waiting for uploads or downloads.</p>
      </section>
    </SiteShell>
  );
}
