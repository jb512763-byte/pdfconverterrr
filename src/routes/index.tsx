import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, FileImage, FileText, Images, Minimize2, Scaling } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/ToolPage";
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
  const [slug, setSlug] = useState("jpg-to-pdf");
  const tool = TOOLS.find((t) => t.slug === slug) ?? TOOLS[0];
  if (!tool) return null;
  const ordered = [TOOLS.find((t) => t.slug === "jpg-to-pdf"), ...TOOLS.filter((t) => t.slug !== "jpg-to-pdf")].filter((t) => t !== undefined);
  const label = tool.kind === "img-to-pdf" ? "Image to PDF" : tool.name;
  return <SiteShell><div className="mx-auto max-w-6xl px-4 py-6 sm:py-12">
    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">PDF & Image Converter</p>
    <nav aria-label="Converter tools" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">{ordered.map((t) => { const Icon = icons[t.kind] ?? FileImage; const on = slug === t.slug; return <button key={t.slug} type="button" aria-pressed={on} onClick={() => setSlug(t.slug)} className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all active:scale-95 ${on ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}><Icon className="h-4 w-4" />{t.kind === "img-to-pdf" ? "Image to PDF" : t.name}</button>; })}</nav>
    <section className="mx-auto max-w-3xl min-w-0">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div key={tool.slug} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"><span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">{label}</span></h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">{tool.short}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-secondary px-3 py-1 text-xs font-medium text-primary">● 100% private · Instant · Free</span>
        </div>
        <Button asChild variant="ghost" size="icon"><a title="Open tool page" aria-label="Open tool page" href={`/${tool.slug}`}><ArrowRight /></a></Button>
      </div>
      <ToolWorkspace key={tool.slug} tool={tool} />
    </section>
  </div></SiteShell>;
}
