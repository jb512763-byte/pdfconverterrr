import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Clock, ShieldCheck, Zap, Smartphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolWorkspace } from "@/components/ToolPage";
import { SiteShell } from "@/components/SiteShell";
import { TOOLS } from "@/lib/tools";
import { ToolSelector, toolLabel } from "@/components/ToolSelector";
import { readHistory, clearHistory, type HistoryItem } from "@/lib/history";

const TITLE = "ConvertKit – Free All-in-One PDF & Image Converter (No Upload)";
const DESC = "Convert PDF to JPG, JPG to PDF, merge & split PDF, compress photos to 20/50 KB, make a resume – free, 100% in your browser, no upload.";

const FAQ = [
  ["Are my files uploaded to a server?", "No. Every conversion runs inside your own browser using HTML5 Canvas and PDF libraries. Your files never leave your phone or computer."],
  ["Is ConvertKit really free?", "Yes. There is no sign-up, no watermark and no daily limit, because we pay no server cost for processing your files."],
  ["How do I compress a photo to 20 KB or 50 KB for a government form?", "Open “Photo to 20/50 KB”, pick your photo, tap the 20 KB or 50 KB preset and download. The tool automatically finds the best quality under that size."],
  ["Where does my downloaded file go?", "Images go to Downloads and appear in your Gallery after a few seconds. PDFs are saved in the Downloads or Files app."],
  ["Does it work offline and on mobile?", "Yes. Once the page has loaded, conversions work on any modern mobile or desktop browser, even on slow internet."],
] as const;

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
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "ConvertKit", description: DESC, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) },
    ],
  }),
  component: Index,
});

function ago(t: number) {
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
}

function RecentFiles() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const load = () => setItems(readHistory());
    load(); window.addEventListener("ck-history", load);
    return () => window.removeEventListener("ck-history", load);
  }, []);
  if (!items.length) return null;
  return <section className="mt-10 rounded-2xl border border-border bg-card p-4 sm:p-6">
    <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 font-display text-lg font-bold"><Clock className="size-5 text-primary" />Your recent files</h2><Button variant="ghost" size="sm" onClick={clearHistory}><Trash2 />Clear</Button></div>
    <ul className="divide-y divide-border">{items.map((i) => <li key={i.at + i.name} className="flex items-center gap-3 py-2.5 text-sm"><div className="min-w-0 flex-1"><p className="truncate font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.tool} · {(i.size / 1024).toFixed(0)} KB · {ago(i.at)}</p></div><Button asChild variant="outline" size="sm"><a href={i.href}>Again</a></Button></li>)}</ul>
    <p className="mt-2 text-xs text-muted-foreground">Saved only on this device. Files themselves are never stored or uploaded.</p>
  </section>;
}

function Index() {
  const [slug, setSlug] = useState("jpg-to-pdf");
  const workRef = useRef<HTMLElement>(null);
  const tool = TOOLS.find((t) => t.slug === slug) ?? TOOLS[0];
  if (!tool) return null;
  const label = toolLabel(tool);
  const pick = (s: string) => { setSlug(s); requestAnimationFrame(() => workRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })); };
  return <SiteShell><div className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
    <div className="mb-6 text-center">
      <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1 text-xs font-semibold"><ShieldCheck className="size-3.5" />100% private · Free · No upload</p>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">Every PDF & image tool, <span className="text-primary">in your pocket</span></h1>
    </div>
    <ToolSelector selected={slug} onSelect={pick} />
    <section ref={workRef} className="mx-auto min-w-0 max-w-3xl scroll-mt-20">
      <div className="mb-5 mt-9 flex items-center justify-between gap-3 sm:mt-12">
        <div key={tool.slug} className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tool.short}</p>
        </div>
        <Button asChild variant="ghost" size="icon" className="shrink-0"><a title="Open tool page" aria-label="Open tool page" href={`/${tool.slug}`}><ArrowRight /></a></Button>
      </div>
      <ToolWorkspace key={tool.slug} tool={tool} />
    </section>
    <RecentFiles />
    <article className="mt-12 space-y-6 text-sm leading-relaxed">
      <h2 className="font-display text-2xl font-bold">How in-browser conversion keeps your files private</h2>
      <p>Most online converters upload your document to a remote server, process it there and send it back. That costs them money, takes time on slow networks, and means a copy of your Aadhaar, mark sheet or resume sits on someone else’s computer. ConvertKit works differently: the conversion code is downloaded once with the page, and then your own device does the work using HTML5 Canvas and open-source PDF libraries.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[[ShieldCheck, "Zero upload", "Files never leave your device."], [Zap, "Instant", "No waiting in a server queue."], [Smartphone, "Mobile first", "Big buttons, works on any phone."]].map(([Icon, t, d]) => { const I = Icon as typeof Zap; return <div key={t as string} className="rounded-xl border border-border bg-card p-4"><I className="mb-2 size-5 text-primary" /><p className="font-semibold">{t as string}</p><p className="text-muted-foreground">{d as string}</p></div>; })}
      </div>
      <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-left"><thead className="bg-muted"><tr><th className="p-3"></th><th className="p-3">Typical online converter</th><th className="p-3">ConvertKit</th></tr></thead><tbody className="divide-y divide-border">
        {[["Where files go", "Uploaded to a server", "Stay on your device"], ["Sign-up", "Often required", "Never"], ["Watermark / limits", "Common", "None"], ["Speed on slow internet", "Slow upload + download", "Instant"]].map(([a, b, c]) => <tr key={a}><td className="p-3 font-medium">{a}</td><td className="p-3 text-muted-foreground">{b}</td><td className="p-3 font-semibold text-primary">{c}</td></tr>)}
      </tbody></table></div>
      <h2 className="font-display text-2xl font-bold">Frequently asked questions</h2>
      <div className="space-y-2">{FAQ.map(([q, a]) => <details key={q} className="rounded-xl border border-border bg-card p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-muted-foreground">{a}</p></details>)}</div>
    </article>
  </div></SiteShell>;
}
