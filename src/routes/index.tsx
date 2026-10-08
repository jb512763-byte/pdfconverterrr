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
    <div className="mb-6 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-secondary px-3 py-1 text-xs font-semibold text-primary">⚡ Instant · 🔒 No upload · ✨ Free</span>
      <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Every PDF & Image tool, <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">one tap away</span></h1>
    </div>
    <nav aria-label="Converter tools" className="mx-auto mb-6 grid max-w-3xl grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">{ordered.map((t) => { const Icon = icons[t.kind] ?? FileImage; const on = slug === t.slug; return <button key={t.slug} type="button" aria-pressed={on} onClick={() => setSlug(t.slug)} className={`flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-center text-xs font-semibold leading-tight transition-all active:scale-95 sm:text-sm ${on ? "border-primary bg-primary text-primary-foreground shadow-lg" : "border-border bg-card text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${on ? "bg-primary-foreground/20" : "bg-secondary text-primary"}`}><Icon className="h-5 w-5" /></span><span className="w-full break-words">{t.kind === "img-to-pdf" ? "Image to PDF" : t.name}</span></button>; })}</nav>
    <section className="mx-auto max-w-3xl min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div key={tool.slug} className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tool.short}</p>
        </div>
        <Button asChild variant="ghost" size="icon" className="shrink-0"><a title="Open tool page" aria-label="Open tool page" href={`/${tool.slug}`}><ArrowRight /></a></Button>
      </div>
      <ToolWorkspace key={tool.slug} tool={tool} />
    </section>
  </div></SiteShell>;
}
