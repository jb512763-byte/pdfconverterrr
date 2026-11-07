import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Trash2, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/SiteShell";
import { readHistory, clearHistory, type HistoryItem } from "@/lib/history";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Activity – Your Converted Files | ConvertKit" },
      { name: "description", content: "See the files you converted, compressed and created on this device. Private – nothing is uploaded." },
      { property: "og:title", content: "My Activity – ConvertKit" },
      { property: "og:description", content: "Your recent conversions, saved privately on this device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const load = () => setItems(readHistory());
    load(); window.addEventListener("ck-history", load);
    return () => window.removeEventListener("ck-history", load);
  }, []);
  const total = items.reduce((n, i) => n + i.size, 0);
  const tools = new Set(items.map((i) => i.tool)).size;
  return <SiteShell><div className="mx-auto max-w-3xl px-4 py-8">
    <h1 className="font-display text-3xl font-bold sm:text-4xl">My activity</h1>
    <p className="mt-2 text-sm text-muted-foreground">Everything you made on this device. Files are never uploaded.</p>
    <div className="mt-6 grid grid-cols-3 gap-3">
      {[["Files made", items.length], ["Tools used", tools], ["Total size", `${(total / 1048576).toFixed(1)} MB`]].map(([l, v]) => <div key={l} className="rounded-xl border border-border bg-card p-4"><p className="font-display text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>)}
    </div>
    <section className="mt-6 rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold"><Clock className="size-5 text-primary" />History</h2>{items.length > 0 && <Button variant="ghost" size="sm" onClick={clearHistory}><Trash2 />Clear</Button>}</div>
      {items.length === 0 ? <div className="py-10 text-center"><FileCheck2 className="mx-auto size-10 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">No files yet.</p><Button asChild className="mt-4"><Link to="/">Start converting</Link></Button></div>
        : <ul className="divide-y divide-border">{items.map((i) => <li key={i.at + i.name} className="flex items-center gap-3 py-3 text-sm"><div className="min-w-0 flex-1"><p className="truncate font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.tool} · {(i.size / 1024).toFixed(0)} KB · {new Date(i.at).toLocaleString()}</p></div><Button asChild variant="outline" size="sm"><a href={i.href}>Again</a></Button></li>)}</ul>}
    </section>
  </div></SiteShell>;
}
