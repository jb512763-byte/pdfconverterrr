import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const MENU = [
  { to: "/", label: "All tools" },
  { to: "/text-to-pdf", label: "Text to PDF" },
  { to: "/resume-maker", label: "Resume Maker" },
  { to: "/profile", label: "My activity" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
] as const;
const LEGAL = [{ to: "/about", label: "About" }, { to: "/contact", label: "Contact" }, { to: "/privacy", label: "Privacy Policy" }, { to: "/terms", label: "Terms" }] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="flex min-h-screen flex-col bg-background text-foreground">
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-md"><ArrowLeftRight size={18} /></span>ConvertKit</Link>
        <nav aria-label="Main" className="hidden gap-5 text-sm font-medium sm:flex">{MENU.map((m) => <Link key={m.to} to={m.to} className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }}>{m.label}</Link>)}</nav>
        <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-md border border-border sm:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && <nav aria-label="Mobile" className="border-t border-border px-4 pb-3 sm:hidden">{MENU.map((m) => <Link key={m.to} to={m.to} onClick={() => setOpen(false)} className="block border-b border-border py-3 text-base font-medium last:border-0">{m.label}</Link>)}</nav>}
    </header>
    <main className="flex-1">{children}</main>
    <footer className="mt-8 border-t border-border"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">{LEGAL.map((m) => <Link key={m.to} to={m.to} className="hover:text-foreground">{m.label}</Link>)}</nav>
      <span>© ConvertKit · No account. No watermark. No upload.</span>
    </div></footer>
  </div>;
}
