// Browser-only PDF writer for Text to PDF and Resume Maker (pdf-lib, no upload).
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type PageSize = "A4" | "Letter";
const SIZES: Record<PageSize, [number, number]> = { A4: [595.28, 841.89], Letter: [612, 792] };

/** Standard PDF fonts only cover Latin; replace other characters so export never crashes. */
export function safeText(s: string) {
  return s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/\u2022/g, "-").replace(/\t/g, "    ").replace(/[^\x20-\x7E\xA0-\xFF\n]/g, "?");
}

export function wrap(text: string, font: PDFFont, size: number, max: number): string[] {
  const lines: string[] = [];
  for (const para of safeText(text).split("\n")) {
    if (!para.trim()) { lines.push(""); continue; }
    let line = "";
    for (const word of para.split(/ +/)) {
      const t = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(t, size) <= max) { line = t; continue; }
      if (line) lines.push(line);
      let w = word;
      while (font.widthOfTextAtSize(w, size) > max) {
        let n = w.length; while (n > 1 && font.widthOfTextAtSize(w.slice(0, n), size) > max) n--;
        lines.push(w.slice(0, n)); w = w.slice(n);
      }
      line = w;
    }
    lines.push(line);
  }
  return lines;
}

class Writer {
  page!: PDFPage; y = 0;
  constructor(public doc: PDFDocument, public size: [number, number], public margin: number) { this.add(); }
  add() { this.page = this.doc.addPage(this.size); this.y = this.size[1] - this.margin; }
  get width() { return this.size[0] - this.margin * 2; }
  need(h: number) { if (this.y - h < this.margin) this.add(); }
  lines(text: string, font: PDFFont, size: number, opts: { color?: [number, number, number]; align?: "left" | "center" | "justify"; gap?: number } = {}) {
    const lh = size * (opts.gap ?? 1.45);
    for (const l of wrap(text, font, size, this.width)) {
      this.need(lh);
      const w = font.widthOfTextAtSize(l, size);
      const x = opts.align === "center" ? this.margin + (this.width - w) / 2 : this.margin;
      this.page.drawText(l, { x, y: this.y - size, size, font, color: rgb(...(opts.color ?? [0.1, 0.1, 0.12])) });
      this.y -= lh;
    }
  }
}

export interface TextPdfOptions { title: string; body: string; fontSize: number; font: "sans" | "serif" | "mono"; pageSize: PageSize; margin: number; align: "left" | "center"; pageNumbers: boolean }

export async function textToPdf(o: TextPdfOptions): Promise<Blob> {
  if (!o.body.trim() && !o.title.trim()) throw new Error("Type or paste some text first.");
  const doc = await PDFDocument.create();
  const fam = o.font === "serif" ? [StandardFonts.TimesRoman, StandardFonts.TimesRomanBold] : o.font === "mono" ? [StandardFonts.Courier, StandardFonts.CourierBold] : [StandardFonts.Helvetica, StandardFonts.HelveticaBold];
  const [reg, bold] = await Promise.all(fam.map((f) => doc.embedFont(f!)));
  const w = new Writer(doc, SIZES[o.pageSize], o.margin);
  if (o.title.trim()) { w.lines(o.title, bold!, o.fontSize * 1.8, { align: o.align, gap: 1.3 }); w.y -= o.fontSize; }
  w.lines(o.body, reg!, o.fontSize, { align: o.align });
  if (o.pageNumbers) {
    const pages = doc.getPages();
    pages.forEach((p, i) => { const t = `${i + 1} / ${pages.length}`; p.drawText(t, { x: (p.getWidth() - reg!.widthOfTextAtSize(t, 9)) / 2, y: o.margin / 2, size: 9, font: reg!, color: rgb(0.5, 0.5, 0.5) }); });
  }
  doc.setTitle(o.title || "Document"); doc.setProducer("ConvertKit");
  return new Blob([await doc.save()], { type: "application/pdf" });
}

export interface ResumeData { name: string; role: string; email: string; phone: string; location: string; link: string; summary: string; experience: string; education: string; skills: string; extra: string; accent: [number, number, number] }

export async function resumeToPdf(r: ResumeData): Promise<Blob> {
  if (!r.name.trim()) throw new Error("Enter your full name.");
  const doc = await PDFDocument.create();
  const [reg, bold] = await Promise.all([doc.embedFont(StandardFonts.Helvetica), doc.embedFont(StandardFonts.HelveticaBold)]);
  const w = new Writer(doc, SIZES.A4, 48);
  w.page.drawRectangle({ x: 0, y: SIZES.A4[1] - 8, width: SIZES.A4[0], height: 8, color: rgb(...r.accent) });
  w.lines(r.name, bold, 26, { gap: 1.2 });
  if (r.role.trim()) w.lines(r.role, reg, 13, { color: r.accent });
  const contact = [r.email, r.phone, r.location, r.link].filter((s) => s.trim()).join("  |  ");
  if (contact) { w.y -= 2; w.lines(contact, reg, 9.5, { color: [0.35, 0.35, 0.4] }); }
  const section = (title: string, body: string) => {
    if (!body.trim()) return;
    w.need(50); w.y -= 12;
    w.page.drawText(safeText(title.toUpperCase()), { x: w.margin, y: w.y - 11, size: 11, font: bold, color: rgb(...r.accent) });
    w.y -= 16;
    w.page.drawLine({ start: { x: w.margin, y: w.y }, end: { x: w.margin + w.width, y: w.y }, thickness: 0.8, color: rgb(0.85, 0.85, 0.88) });
    w.y -= 7;
    for (const line of body.split("\n")) {
      const isBullet = /^\s*[-*•]/.test(line);
      w.lines(isBullet ? `- ${line.replace(/^\s*[-*•]\s*/, "")}` : line, isBullet || !line.includes("|") ? reg : bold, 10.5);
    }
  };
  section("Profile", r.summary); section("Experience", r.experience); section("Education", r.education);
  section("Skills", r.skills.split(/[,\n]/).map((s) => s.trim()).filter(Boolean).join("  -  ")); section("Projects & Achievements", r.extra);
  doc.setTitle(`${r.name} - Resume`); doc.setProducer("ConvertKit");
  return new Blob([await doc.save()], { type: "application/pdf" });
}
