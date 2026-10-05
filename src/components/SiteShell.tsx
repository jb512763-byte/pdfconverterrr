import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
export function SiteShell({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-background text-foreground"><header className="border-b border-border bg-card"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4"><Link to="/" className="flex items-center gap-2 font-display text-xl font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><ArrowLeftRight size={18} /></span>ConvertKit</Link><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck size={16} className="text-primary" />100% private</span></div></header><main className="flex-1">{children}</main><footer className="mt-8 border-t border-border"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground"><span>ConvertKit</span><span>No account. No watermark. No upload.</span></div></footer></div>;
}
