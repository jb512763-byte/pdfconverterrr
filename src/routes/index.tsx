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
  return <SiteShell><div className="mx-auto max-w-6xl px-4 py-7 sm:py-12">
    <div className="mb-7"><p className="mb-2 text-xs font-semibold uppercase text-primary">PDF & IMAGE TOOLS</p><h1 className="font-display text-3xl font-bold sm:text-4xl">Less fuss. More done.</h1></div>
    <div className="grid gap-6 md:grid-cols-[240px_1fr] lg:gap-10">
      <nav aria-label="Converter tools" className="grid grid-cols-2 gap-2 md:flex md:flex-col">{ordered.map((t) => { const Icon = icons[t.kind] ?? FileImage; return <Button key={t.slug} variant={slug === t.slug ? "secondary" : "ghost"} aria-pressed={slug === t.slug} onClick={() => setSlug(t.slug)} className={`h-11 min-w-0 justify-start px-3 text-xs sm:text-sm ${slug === t.slug ? "border border-primary/30 text-primary" : "border border-transparent text-muted-foreground"}`}><Icon />{t.kind === "img-to-pdf" ? "Image to PDF" : t.name}</Button>; })}</nav>
      <section className="min-w-0"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-bold">{tool.kind === "img-to-pdf" ? "Image to PDF" : tool.name}</h2><p className="mt-1 text-sm text-muted-foreground">{tool.short}</p></div><Button asChild variant="ghost" size="icon"><a title="Open tool page" aria-label="Open tool page" href={`/${tool.slug}`}><ArrowRight /></a></Button></div><ToolWorkspace key={tool.slug} tool={tool} /></section>
    </div>
  </div></SiteShell>;
}
