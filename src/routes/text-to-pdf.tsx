import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/SiteShell";
import { ToolSelector } from "@/components/ToolSelector";
import { PdfResult, pageHead } from "@/components/PdfResult";
import type { TextPdfOptions } from "@/lib/pdf-writer";

export const Route = createFileRoute("/text-to-pdf")({
  head: () => pageHead("/text-to-pdf", "Text to PDF – Convert Text & TXT to PDF Free | ConvertKit", "Type or paste text, or open a .txt file, and create a clean PDF with your font, size and margins. Free, private, no upload."),
  component: TextToPdf,
});

const field = "mt-1.5 block h-11 w-full rounded-md border border-input bg-background px-3 text-base";

function TextToPdf() {
  const [o, setO] = useState<TextPdfOptions>({ title: "", body: "", fontSize: 12, font: "sans", pageSize: "A4", margin: 56, align: "left", pageNumbers: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const set = <K extends keyof TextPdfOptions>(k: K, v: TextPdfOptions[K]) => setO((p) => ({ ...p, [k]: v }));
  const words = o.body.trim() ? o.body.trim().split(/\s+/).length : 0;
  async function create() {
    setBusy(true); setError("");
    try { const { textToPdf } = await import("@/lib/pdf-writer"); setResult(await textToPdf(o)); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not create the PDF."); }
    finally { setBusy(false); }
  }
  const name = `${(o.title.trim() || "document").replace(/[^\w-]+/g, "-").slice(0, 60)}.pdf`;
  return <SiteShell><div className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
    <ToolSelector selected="text-to-pdf" />
    <h1 className="mt-9 font-display text-3xl font-bold leading-tight sm:text-5xl">Text to PDF</h1>
    <p className="mt-2 text-sm text-muted-foreground">Write, paste or open a .txt file and get a neat PDF in one tap.</p>
    <div className="mt-6">{result ? <PdfResult blob={result} name={name} onReset={() => setResult(null)} /> :
      <div className="workspace space-y-4 border border-border bg-card p-4 sm:p-7">
        <label className="block text-sm font-medium">Title (optional)<input className={field} value={o.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Leave Application" /></label>
        <label className="block text-sm font-medium"><span className="flex items-center justify-between">Your text<span className="text-xs font-normal text-muted-foreground">{words} words</span></span>
          <textarea aria-label="Your text" className="mt-1.5 block min-h-64 w-full rounded-md border border-input bg-background p-3 text-base leading-relaxed" value={o.body} onChange={(e) => set("body", e.target.value)} placeholder="Type or paste your text here…" /></label>
        <label className="relative flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input text-sm font-medium"><FileUp className="size-4" />Open a .txt file<input type="file" accept=".txt,text/plain" className="file-picker" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { set("body", await f.text()); if (!o.title) set("title", f.name.replace(/\.[^.]+$/, "")); } e.target.value = ""; }} /></label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="text-sm font-medium">Font<select className={field} value={o.font} onChange={(e) => set("font", e.target.value as TextPdfOptions["font"])}><option value="sans">Clean (Sans)</option><option value="serif">Classic (Serif)</option><option value="mono">Typewriter</option></select></label>
          <label className="text-sm font-medium">Size<select className={field} value={o.fontSize} onChange={(e) => set("fontSize", Number(e.target.value))}>{[10, 11, 12, 14, 16, 18].map((s) => <option key={s} value={s}>{s} pt</option>)}</select></label>
          <label className="text-sm font-medium">Page<select className={field} value={o.pageSize} onChange={(e) => set("pageSize", e.target.value as TextPdfOptions["pageSize"])}><option>A4</option><option>Letter</option></select></label>
          <label className="text-sm font-medium">Margin<select className={field} value={o.margin} onChange={(e) => set("margin", Number(e.target.value))}><option value={36}>Narrow</option><option value={56}>Normal</option><option value={80}>Wide</option></select></label>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={o.align === "center"} onChange={(e) => set("align", e.target.checked ? "center" : "left")} className="size-4 accent-primary" />Center text</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={o.pageNumbers} onChange={(e) => set("pageNumbers", e.target.checked)} className="size-4 accent-primary" />Page numbers</label>
        </div>
        <p className="text-xs text-muted-foreground">Supports English letters, numbers and symbols.</p>
        <Button className="h-14 w-full text-lg font-semibold" disabled={busy} onClick={create}>{busy ? <><Loader2 className="animate-spin" />Creating…</> : "Create PDF"}</Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>}</div>
  </div></SiteShell>;
}
