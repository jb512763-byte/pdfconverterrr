import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/SiteShell";
import { ToolSelector } from "@/components/ToolSelector";
import { PdfResult, pageHead } from "@/components/PdfResult";
import type { ResumeData } from "@/lib/pdf-writer";

export const Route = createFileRoute("/resume-maker")({
  head: () => pageHead("/resume-maker", "Free Resume Maker – Create a Professional CV PDF | ConvertKit", "Make a clean, professional resume (CV) and download it as PDF in minutes. Free, no sign-up, no watermark, nothing uploaded."),
  component: ResumeMaker,
});

const COLORS: { label: string; v: [number, number, number] }[] = [
  { label: "Forest", v: [0.09, 0.4, 0.3] }, { label: "Navy", v: [0.1, 0.2, 0.45] }, { label: "Maroon", v: [0.55, 0.12, 0.15] }, { label: "Black", v: [0.12, 0.12, 0.14] },
];
const input = "mt-1.5 block h-11 w-full rounded-md border border-input bg-background px-3 text-base";
const area = "mt-1.5 block min-h-28 w-full rounded-md border border-input bg-background p-3 text-base";

function ResumeMaker() {
  const [r, setR] = useState<ResumeData>({ name: "", role: "", email: "", phone: "", location: "", link: "", summary: "", experience: "", education: "", skills: "", extra: "", accent: COLORS[0]!.v });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const set = (k: keyof ResumeData) => (e: { target: { value: string } }) => setR((p) => ({ ...p, [k]: e.target.value }));
  async function create() {
    setBusy(true); setError("");
    try { const { resumeToPdf } = await import("@/lib/pdf-writer"); setResult(await resumeToPdf(r)); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not create the resume."); }
    finally { setBusy(false); }
  }
  const T = ({ k, label, ph }: { k: keyof ResumeData; label: string; ph: string }) => <label className="block text-sm font-medium">{label}<input className={input} value={r[k] as string} onChange={set(k)} placeholder={ph} /></label>;
  const A = ({ k, label, ph }: { k: keyof ResumeData; label: string; ph: string }) => <label className="block text-sm font-medium">{label}<textarea className={area} value={r[k] as string} onChange={set(k)} placeholder={ph} /></label>;
  return <SiteShell><div className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
    <ToolSelector selected="resume-maker" />
    <h1 className="mt-9 font-display text-3xl font-bold leading-tight sm:text-5xl">Resume Maker</h1>
    <p className="mt-2 text-sm text-muted-foreground">Fill in what you have — empty sections are skipped. Get a clean one-page CV PDF.</p>
    <div className="mt-6">{result ? <PdfResult blob={result} name={`${r.name.trim().replace(/[^\w-]+/g, "-") || "resume"}-resume.pdf`} onReset={() => setResult(null)} /> :
      <div className="workspace space-y-4 border border-border bg-card p-4 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2">
          {T({ k: "name", label: "Full name *", ph: "Rahul Kumar" })}{T({ k: "role", label: "Job title", ph: "Accountant / Student" })}
          {T({ k: "email", label: "Email", ph: "you@example.com" })}{T({ k: "phone", label: "Phone", ph: "+91 98765 43210" })}
          {T({ k: "location", label: "City", ph: "Patna, Bihar" })}{T({ k: "link", label: "LinkedIn / website", ph: "linkedin.com/in/you" })}
        </div>
        {A({ k: "summary", label: "Profile summary", ph: "2–3 lines about you and your goal." })}
        {A({ k: "experience", label: "Experience", ph: "Sales Executive | ABC Pvt Ltd | 2022 – Present\n- Increased monthly sales by 20%\n- Managed 50+ clients" })}
        {A({ k: "education", label: "Education", ph: "B.Com | Patna University | 2021\n12th (BSEB) | 78% | 2018" })}
        {A({ k: "skills", label: "Skills (comma separated)", ph: "MS Excel, Tally, Communication, Hindi, English" })}
        {A({ k: "extra", label: "Projects, certificates & achievements", ph: "- CCC certificate (NIELIT)\n- Won district-level quiz" })}
        <p className="text-xs text-muted-foreground">Tip: put a line in “Role | Company | Years” format to make it bold. Start a line with “-” for a bullet.</p>
        <div><p className="text-sm font-medium">Colour</p><div className="mt-2 grid grid-cols-4 gap-2">{COLORS.map((c) => <Button key={c.label} type="button" variant={r.accent === c.v ? "default" : "outline"} className="h-11" onClick={() => setR((p) => ({ ...p, accent: c.v }))}>{c.label}</Button>)}</div></div>
        <Button className="h-14 w-full text-lg font-semibold" disabled={busy} onClick={create}>{busy ? <><Loader2 className="animate-spin" />Creating…</> : "Create resume PDF"}</Button>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>}</div>
  </div></SiteShell>;
}
