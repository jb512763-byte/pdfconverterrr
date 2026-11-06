import { useEffect, useState } from "react";
import { Check, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shared "download complete" card for generated PDFs. Auto-downloads once, then offers open/again. */
export function PdfResult({ blob, name, onReset }: { blob: Blob; name: string; onReset: () => void }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const u = URL.createObjectURL(blob); setUrl(u);
    const a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    void import("@/lib/history").then((h) => h.addHistory([{ name, size: blob.size, tool: "PDF Studio", href: location.pathname }])).catch(() => {});
    void import("@/lib/chime").then((m) => m.playSuccessChime()).catch(() => {});
    return () => URL.revokeObjectURL(u);
  }, [blob, name]);
  if (!url) return null;
  return <div className="workspace border border-border bg-card p-4 sm:p-7">
    <div aria-live="polite" className="mb-5 flex items-center gap-3 rounded-xl bg-accent/40 p-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check /></div><div className="min-w-0"><h2 className="font-display text-2xl font-bold">Download complete</h2><p className="mt-1 text-sm font-medium">Saved to your phone – check the Downloads / Files app.</p><p className="text-xs text-muted-foreground break-all">{name} · {(blob.size / 1024).toFixed(1)} KB</p></div></div>
    <Button asChild className="mb-3 h-14 w-full text-lg font-semibold"><a href={url} target="_blank" rel="noopener">Open PDF</a></Button>
    <p className="mb-4 text-center text-sm text-muted-foreground">Not saved? <a className="font-medium text-primary underline" href={url} download={name}><Download className="inline size-4" /> Download again</a></p>
    <Button variant="ghost" className="h-12 w-full text-base" onClick={onReset}><RotateCcw />Edit and create again</Button>
  </div>;
}

export function pageHead(path: string, title: string, description: string) {
  return {
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: path }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
