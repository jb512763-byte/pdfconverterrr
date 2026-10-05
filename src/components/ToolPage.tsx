import { useState, useCallback } from "react";
import { Upload, Download, Loader2, ShieldCheck, Zap, Lock, X } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { TOOLS } from "@/lib/tools";
import { SiteShell } from "./SiteShell";
import type { OutFile } from "@/lib/convert";

export function ToolPage({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<OutFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [quality, setQuality] = useState(70);
  const [width, setWidth] = useState("");
  const [percent, setPercent] = useState("50");
  const [mode, setMode] = useState<"width" | "percent">("percent");

  const multiple = tool.kind !== "pdf-to-img";

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const accepted = tool.accept.split(",");
    const arr = Array.from(list).filter((f) => accepted.includes(f.type));
    if (!arr.length) { setError("Unsupported file type for this tool."); return; }
    setError(""); setResults([]);
    setFiles((prev) => (multiple ? [...prev, ...arr] : [arr[0]]));
  }, [tool.accept, multiple]);

  async function run() {
    setBusy(true); setError(""); setProgress(0);
    try {
      const c = await import("@/lib/convert");
      let out: OutFile[] = [];
      if (tool.kind === "pdf-to-img") out = await c.pdfToImages(files[0], setProgress);
      else if (tool.kind === "img-to-pdf") out = [await c.imagesToPdf(files)];
      else {
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (tool.kind === "convert") out.push(await c.convertImage(f, tool.target!));
          if (tool.kind === "compress") out.push(await c.compressImage(f, quality / 100));
          if (tool.kind === "resize") out.push(await c.resizeImage(f, mode === "width" ? { width: Number(width) || undefined } : { percent: Number(percent) || 100 }));
          setProgress((i + 1) / files.length);
        }
      }
      setResults(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  async function downloadZip() {
    const { zipAll } = await import("@/lib/convert");
    const blob = await zipAll(results);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `convertkit-${tool.slug}.zip`; a.click();
  }

  const fmt = (b: number) => (b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`);
  const totalIn = files.reduce((s, f) => s + f.size, 0);
  const totalOut = results.reduce((s, f) => s + f.blob.size, 0);

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 pt-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">{tool.name} <span className="text-primary">Converter</span></h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">{tool.description}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-primary" /> No upload</span>
          <span className="inline-flex items-center gap-1"><Zap className="h-4 w-4 text-primary" /> Instant</span>
          <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4 text-primary" /> 100% private</span>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl px-4">
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition-colors ${drag ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary"}`}
        >
          <Upload className="h-10 w-10 text-primary" />
          <span className="mt-3 font-display text-lg font-semibold">Drop {multiple ? "files" : "a file"} here or click to choose</span>
          <span className="mt-1 text-sm text-muted-foreground">Files stay on your device</span>
          <input type="file" className="sr-only" accept={tool.accept} multiple={multiple} onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </label>

        {files.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="truncate">{f.name} <span className="text-muted-foreground">· {fmt(f.size)}</span></span>
                  <button aria-label="Remove file" onClick={() => { setFiles(files.filter((_, j) => j !== i)); setResults([]); }}><X className="h-4 w-4 text-muted-foreground" /></button>
                </li>
              ))}
            </ul>

            {tool.kind === "compress" && (
              <div className="mt-4">
                <label className="text-sm font-medium">Quality: {quality}%</label>
                <input type="range" min={10} max={95} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-[var(--primary)]" />
              </div>
            )}
            {tool.kind === "resize" && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <select value={mode} onChange={(e) => setMode(e.target.value as "width" | "percent")} className="rounded-lg border border-input bg-background px-3 py-2">
                  <option value="percent">By percentage</option>
                  <option value="width">By width (px)</option>
                </select>
                {mode === "percent"
                  ? <input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className="w-28 rounded-lg border border-input bg-background px-3 py-2" placeholder="%" />
                  : <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-28 rounded-lg border border-input bg-background px-3 py-2" placeholder="Width px" />}
              </div>
            )}

            <button onClick={run} disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Working… {Math.round(progress * 100)}%</> : `Convert ${files.length > 1 ? `${files.length} files` : ""}`}
            </button>
          </div>
        )}

        {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}

        {results.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-accent/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">Done! {fmt(totalIn)} → {fmt(totalOut)}</p>
              {results.length > 1 && <button onClick={downloadZip} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" /> Download all (ZIP)</button>}
            </div>
            <ul className="mt-3 space-y-2">
              {results.map((r) => (
                <li key={r.url} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-sm">
                  <span className="truncate">{r.name} <span className="text-muted-foreground">· {fmt(r.blob.size)}</span></span>
                  <a href={r.url} download={r.name} className="inline-flex items-center gap-1 font-medium text-primary"><Download className="h-4 w-4" /> Download</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-4">
        <h2 className="text-2xl font-bold">How to use {tool.name}</h2>
        <ol className="mt-4 space-y-2">
          {tool.steps.map((s, i) => (
            <li key={i} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span><span className="pt-0.5">{s}</span></li>
          ))}
        </ol>
        <h2 className="mt-12 text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {tool.faqs.map((f) => (
            <details key={f.q} className="rounded-xl border border-border bg-card p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <h2 className="mt-12 text-2xl font-bold">More free tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TOOLS.filter((t) => t.slug !== tool.slug).map((t) => (
            <a key={t.slug} href={`/${t.slug}`} className="rounded-xl border border-border bg-card p-4 hover:border-primary">
              <p className="font-semibold">{t.name}</p><p className="text-sm text-muted-foreground">{t.short}</p>
            </a>
          ))}
        </div>
      </section>
    </SiteShell>
  );
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
