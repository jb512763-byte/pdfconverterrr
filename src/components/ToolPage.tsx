import { useState, useRef, useEffect } from "react";
import { Upload, Download, Loader2, ShieldCheck, X, Check, ArrowLeft, FileText, FileImage, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, fileMime, type Tool } from "@/lib/tools";
import { SiteShell } from "./SiteShell";
import type { OutFile } from "@/lib/convert";

export function ToolWorkspace({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<OutFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [quality, setQuality] = useState(70);
  const [value, setValue] = useState("50");
  const [mode, setMode] = useState("percent");
  const input = useRef<HTMLInputElement>(null);
  const resultRef = useRef<OutFile[]>([]);
  useEffect(() => { resultRef.current = results; }, [results]);
  useEffect(() => () => { resultRef.current.forEach((r) => URL.revokeObjectURL(r.url)); }, []);
  function clearResults() { results.forEach((r) => URL.revokeObjectURL(r.url)); setResults([]); }
  function addFiles(list: FileList | null) {
    if (!list || busy) return;
    const all = Array.from(list);
    const accepted = all.filter((f) => tool.accept.split(",").includes(fileMime(f)));
    if (!accepted.length) { setError(`Choose ${tool.kind === "pdf-to-img" ? "a PDF" : tool.accept.split(",").map((m) => m.split("/")[1]?.toUpperCase()).join(", ")} file${tool.kind === "pdf-to-img" ? "" : "s"}.`); return; }
    clearResults();
    setError(accepted.length !== all.length ? "Some unsupported files were skipped." : "");
    const first = accepted[0];
    if (!first) return;
    setFiles((prev) => tool.kind === "pdf-to-img" ? [first] : [...prev, ...accepted]);
  }
  const action = tool.kind === "img-to-pdf" ? "Create PDF" : tool.kind === "compress" ? "Compress images" : tool.kind === "resize" ? "Resize images" : "Convert";
  async function run() {
    const first = files[0];
    if (!first || busy) return;
    if (tool.kind === "resize" && (!Number.isFinite(Number(value)) || Number(value) <= 0 || (mode === "width" && !Number.isInteger(Number(value))))) { setError("Enter a positive " + (mode === "width" ? "whole-number width." : "percentage.")); return; }
    setBusy(true); setError(""); setProgress(0); clearResults();
    let output: OutFile[] = [];
    try {
      const c = await import("@/lib/convert");
      if (tool.kind === "pdf-to-img") output = await c.pdfToImages(first, setProgress);
      else if (tool.kind === "img-to-pdf") output = [await c.imagesToPdf(files)];
      else {
        for (const [i, f] of files.entries()) {
          if (tool.kind === "convert" && tool.target) output.push(await c.convertImage(f, tool.target));
          if (tool.kind === "compress") output.push(await c.compressImage(f, quality / 100));
          if (tool.kind === "resize") output.push(await c.resizeImage(f, mode === "width" ? { width: Number(value) } : { percent: Number(value) }));
          setProgress((i + 1) / files.length);
        }
      }
      setProgress(1); setResults(output);
      if (output.length === 1) {
        const r = output[0];
        if (r) {
          const a = document.createElement("a");
          a.href = r.url; a.download = r.name; document.body.appendChild(a); a.click(); a.remove();
        }
      }
    } catch (e) { output.forEach((r) => URL.revokeObjectURL(r.url)); setError(e instanceof Error ? e.message : "Could not convert this file. Try again."); }
    finally { setBusy(false); }
  }
  async function downloadZip() {
    setBusy(true); setError("");
    try {
      const { zipAll } = await import("@/lib/convert");
      const url = URL.createObjectURL(await zipAll(results));
      const a = document.createElement("a");
      a.href = url; a.download = `convertkit-${tool.slug}.zip`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch { setError("ZIP download failed. Download the files individually or try again."); }
    finally { setBusy(false); }
  }
  const fmt = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;
  return (
    <div className="workspace rounded-lg border border-border bg-card p-4 sm:p-7">
      <input ref={input} aria-label="Choose files" type="file" className="sr-only" accept={tool.accept} multiple={tool.kind !== "pdf-to-img"} disabled={busy} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
      {results.length === 0 ? <>
        <div onDragOver={(e) => { e.preventDefault(); if (!busy) setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }} className={`flex min-h-48 flex-col items-center justify-center rounded-md border border-dashed px-4 py-6 text-center transition-colors ${drag ? "border-primary bg-secondary" : "border-input bg-background"}`}>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">{tool.kind === "pdf-to-img" ? <FileText size={25} /> : <FileImage size={25} />}</div>
          <Button size="lg" disabled={busy} onClick={() => input.current?.click()}><Plus />{files.length ? "Add files" : tool.kind === "pdf-to-img" ? "Choose PDF" : "Choose images"}</Button>
          <p className="mt-3 text-xs text-muted-foreground">{tool.kind === "pdf-to-img" ? "PDF" : tool.accept.split(",").map((m) => m.split("/")[1]?.replace("jpeg", "jpg").toUpperCase()).join(" · ")}</p>
        </div>
        {files.length > 0 && <div className="mt-4">
          <ul className="max-h-48 overflow-y-auto divide-y divide-border">{files.map((f,i) => <li key={`${f.name}-${i}`} className="flex min-w-0 items-center gap-3 py-2"><FileText className="h-4 w-4 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{f.name}</p><p className="text-xs text-muted-foreground">{fmt(f.size)}</p></div><Button title="Remove file" aria-label={`Remove ${f.name}`} size="icon" variant="ghost" disabled={busy} onClick={() => { clearResults(); setFiles((prev) => prev.filter((_,j) => j !== i)); }}><X /></Button></li>)}</ul>
          {tool.kind === "compress" && <label className="mt-4 block text-sm">Quality: {quality}%<input aria-label="Quality" type="range" min={10} max={95} value={quality} disabled={busy} onChange={(e) => setQuality(Number(e.target.value))} className="mt-2 w-full accent-primary" /></label>}
          {tool.kind === "resize" && <div className="mt-4 flex items-center gap-3"><select aria-label="Resize mode" value={mode} disabled={busy} onChange={(e) => { setMode(e.target.value); setValue(e.target.value === "width" ? "800" : "50"); }} className="min-w-0 rounded-md border border-input bg-background p-2 text-sm"><option value="percent">Percentage</option><option value="width">Width (px)</option></select><input aria-label="Resize value" type="number" min="1" value={value} disabled={busy} onChange={(e) => setValue(e.target.value)} className="w-24 rounded-md border border-input bg-background p-2 text-sm" /></div>}
          <Button className="mt-4 h-12 w-full" disabled={busy} onClick={run}>{busy ? <><Loader2 className="animate-spin" />Processing… {Math.round(progress*100)}%</> : <>{action}<Upload /></>}</Button>
          {busy && <progress aria-label="Conversion progress" className="mt-2 h-1 w-full accent-primary" value={progress} max={1} />}
        </div>}
      </> : <div>
        <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check /></div><div><h2 className="font-display text-lg font-bold">Ready to download</h2><p className="text-xs text-muted-foreground">{results.length} {results.length === 1 ? "file" : "files"} · {fmt(results.reduce((n,r) => n+r.blob.size,0))}</p></div></div>
        {results.length > 1 && <Button className="mb-4 h-11 w-full" disabled={busy} onClick={downloadZip}><Download />{busy ? "Preparing ZIP…" : "Download all (ZIP)"}</Button>}
        {results.length === 1 && results[0] && <Button asChild className="mb-4 h-12 w-full"><a href={results[0].url} download={results[0].name}><Download />Download {results[0].name}</a></Button>}
        <ul className="divide-y divide-border">{results.map((r) => <li key={r.url} className="flex min-w-0 items-center gap-3 py-3">{r.blob.type.startsWith("image/") ? <img src={r.url} alt="Converted page" className="h-12 w-12 shrink-0 rounded border border-border object-contain" /> : <FileText className="h-8 w-8 shrink-0 text-primary" />}<div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{fmt(r.blob.size)}</p></div><Button asChild variant={results.length === 1 ? "default" : "outline"} size="sm"><a href={r.url} download={r.name}><Download /><span>Download</span></a></Button></li>)}</ul>
        <Button variant="ghost" className="mt-4 w-full" disabled={busy} onClick={() => { clearResults(); setFiles([]); setError(""); }}><RotateCcw />Start again</Button>
      </div>}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-5 flex justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />Private · No upload · Free</div>
    </div>
  );
}

export function ToolPage({ tool }: { tool: Tool }) {
  return <SiteShell><div className="mx-auto max-w-3xl px-4 py-8 sm:py-12"><Button asChild variant="ghost" size="sm"><a href="/"><ArrowLeft />All tools</a></Button><h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl">{tool.kind === "img-to-pdf" ? "Image to PDF" : tool.name}</h1><p className="mt-2 text-sm text-muted-foreground">{tool.short}</p><div className="mt-6"><ToolWorkspace tool={tool} /></div><details className="mt-8 border-t border-border py-5"><summary className="cursor-pointer text-sm font-medium">Common questions</summary><div className="mt-4 space-y-5">{tool.faqs.map((f) => <div key={f.q}><h2 className="text-sm font-semibold">{f.q}</h2><p className="mt-1 text-sm text-muted-foreground">{f.a}</p></div>)}</div></details><div className="mt-4 flex flex-wrap gap-2">{TOOLS.filter((t) => t.slug !== tool.slug).map((t) => <Button key={t.slug} asChild variant="outline" size="sm"><a href={`/${t.slug}`}>{t.kind === "img-to-pdf" ? "Image to PDF" : t.name}</a></Button>)}</div></div></SiteShell>;
}

export function toolHead(tool: Tool) {
  return {
    meta: [
      { title: tool.title },
      { name: "description", content: tool.description },
      { property: "og:title", content: tool.title },
      { property: "og:description", content: tool.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `/${tool.slug}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `/${tool.slug}` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: tool.name, description: tool.description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) },
    ],
  };
}
