import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/ToolPage";
import { SiteShell } from "@/components/SiteShell";
import { TOOLS } from "@/lib/tools";
import { ToolSelector, toolLabel } from "@/components/ToolSelector";

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

function Index() {
  const [slug, setSlug] = useState("jpg-to-pdf");
  const tool = TOOLS.find((t) => t.slug === slug) ?? TOOLS[0];
  if (!tool) return null;
  const label = toolLabel(tool);
  return <SiteShell><div className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
    <ToolSelector selected={slug} onSelect={setSlug} />
    <section className="mx-auto max-w-3xl min-w-0">
      <div className="mb-5 mt-9 flex items-center justify-between gap-3 sm:mt-12">
        <div key={tool.slug} className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">{label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tool.short}</p>
        </div>
        <Button asChild variant="ghost" size="icon" className="shrink-0"><a title="Open tool page" aria-label="Open tool page" href={`/${tool.slug}`}><ArrowRight /></a></Button>
      </div>
      <ToolWorkspace key={tool.slug} tool={tool} />
    </section>
  </div></SiteShell>;
}
