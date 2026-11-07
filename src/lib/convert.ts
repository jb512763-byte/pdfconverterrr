// All conversion runs in the browser. Never import this from server code.
import { fileMime } from "./tools";

export interface OutFile { name: string; blob: Blob; url: string }

const extFor = (mime: string) => (mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg");
const base = (n: string) => n.replace(/\.[^.]+$/, "");

async function loadBitmap(file: Blob): Promise<ImageBitmap> {
  try { return await createImageBitmap(file); }
  catch { throw new Error("This image could not be opened. Choose a valid JPG, PNG or WebP file."); }
}

function canvasToBlob(c: HTMLCanvasElement, mime: string, q?: number) {
  return new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Conversion failed"))), mime, q));
}

function out(name: string, blob: Blob): OutFile {
  return { name, blob, url: URL.createObjectURL(blob) };
}

export async function convertImage(file: File, mime: string, quality = 0.92, width?: number, height?: number) {
  const bmp = await loadBitmap(file);
  const c = document.createElement("canvas");
  const w = width ?? bmp.width, h = height ?? bmp.height;
  if (!Number.isSafeInteger(w) || !Number.isSafeInteger(h) || w <= 0 || h <= 0 || w > 16384 || h > 16384 || w * h > 32000000) {
    bmp.close();
    throw new Error("This image is too large to process safely. Choose a smaller image or resize to smaller dimensions (maximum 32 megapixels).");
  }
  c.width = w;
  c.height = h;
  try {
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Not enough memory to process this file. Try a smaller file.");
  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await canvasToBlob(c, mime, mime === "image/png" ? undefined : quality);
  if (blob.type !== mime) throw new Error("Your browser does not support this output format.");
  return out(`${base(file.name)}.${extFor(mime)}`, blob);
  } finally { bmp.close(); c.width = 0; c.height = 0; }
}

export async function compressImage(file: File, quality: number) {
  // PNG has no quality knob in canvas; output WebP-free JPG for PNG unless transparency matters → use webp.
  const mime = fileMime(file) === "image/png" ? "image/webp" : fileMime(file);
  const r = await convertImage(file, mime, quality);
  if (r.blob.size >= file.size) { URL.revokeObjectURL(r.url); return out(file.name, file); }
  return r;
}

/** Shrink a photo to JPG under targetKB (for exam / govt form uploads). */
export async function compressToKB(file: File, targetKB: number) {
  const limit = targetKB * 1024;
  const bmp = await loadBitmap(file);
  let w = bmp.width, h = bmp.height;
  bmp.close();
  for (let scale = 1; scale > 0.05; scale *= 0.8) {
    const sw = Math.max(1, Math.round(w * scale)), sh = Math.max(1, Math.round(h * scale));
    let lo = 0.1, hi = 0.95, best: Awaited<ReturnType<typeof convertImage>> | null = null;
    for (let i = 0; i < 7; i++) {
      const q = (lo + hi) / 2;
      const r = await convertImage(file, "image/jpeg", q, sw, sh);
      if (r.blob.size <= limit) { if (best) URL.revokeObjectURL(best.url); best = r; lo = q; }
      else { URL.revokeObjectURL(r.url); hi = q; }
    }
    if (best) return best;
  }
  throw new Error(`Could not get this image under ${targetKB} KB.`);
}

export async function resizeImage(file: File, opts: { width?: number | undefined; percent?: number | undefined }) {
  const bmp = await loadBitmap(file);
  let w = bmp.width, h = bmp.height;
  if (opts.percent) { w = Math.round(w * opts.percent / 100); h = Math.round(h * opts.percent / 100); }
  else if (opts.width) { h = Math.round(h * opts.width / w); w = opts.width; }
  bmp.close();
  const mime = fileMime(file);
  return convertImage(file, mime, 0.92, Math.max(1, w), Math.max(1, h));
}

export async function pdfToImages(file: File, onProgress?: (p: number) => void) {
  const pdfjs = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  const task = pdfjs.getDocument({ data: await file.arrayBuffer(), useSystemFonts: true, isEvalSupported: false });
  const results: OutFile[] = [];
  try {
    const doc = await task.promise;
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const original = page.getViewport({ scale: 1 });
      const scale = Math.min(2, 4096 / Math.max(original.width, original.height), Math.sqrt(16000000 / (original.width * original.height)));
      const vp = page.getViewport({ scale });
      const c = document.createElement("canvas");
      c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("Not enough memory. Try a smaller PDF.");
      await page.render({ canvasContext: ctx, viewport: vp, background: "white" }).promise;
      results.push(out(`${base(file.name)}-page-${i}.jpg`, await canvasToBlob(c, "image/jpeg", 0.92)));
      c.width = 0; c.height = 0; page.cleanup();
      onProgress?.(i / doc.numPages);
    }
    return results;
  } catch (error) {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    const name = error instanceof Error ? error.name : "";
    if (name === "PasswordException") throw new Error("This PDF is password-protected. Choose an unlocked copy.");
    throw new Error("This PDF could not be converted. Check that it opens normally and is not damaged.");
  } finally { await task.destroy(); }
}

export async function imagesToPdf(files: File[]) {
  const { PDFDocument } = await import("pdf-lib");
  if (!files.length) throw new Error("Choose at least one image.");
  const pdf = await PDFDocument.create();
  for (const f of files) {
    let bytes: ArrayBuffer, isPng = fileMime(f) === "image/png";
    if (fileMime(f) === "image/jpeg" || isPng) bytes = await f.arrayBuffer();
    else { const j = await convertImage(f, "image/jpeg"); bytes = await j.blob.arrayBuffer(); URL.revokeObjectURL(j.url); isPng = false; }
    const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const data = await pdf.save();
  return out(`${base(files[0]?.name ?? "images")}.pdf`, new Blob([data as BlobPart], { type: "application/pdf" }));
}

export async function zipAll(files: OutFile[]) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const names = new Set<string>();
  files.forEach((f) => {
    let name = f.name, index = 2;
    while (names.has(name)) {
      const dot = f.name.lastIndexOf(".");
      name = dot > 0 ? `${f.name.slice(0, dot)}-${index++}${f.name.slice(dot)}` : `${f.name}-${index++}`;
    }
    names.add(name);
    zip.file(name, f.blob);
  });
  return await zip.generateAsync({ type: "blob" });
}

export const fmtSize = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`);

async function loadPdf(file: File) {
  const { PDFDocument } = await import("pdf-lib");
  try { return { PDFDocument, doc: await PDFDocument.load(await file.arrayBuffer()) }; }
  catch (e) {
    if (e instanceof Error && /encrypt/i.test(e.message)) throw new Error(`"${file.name}" is password-protected. Choose an unlocked copy.`);
    throw new Error(`"${file.name}" could not be opened. Check that it is a valid PDF.`);
  }
}

export async function mergePdfs(files: File[]) {
  if (files.length < 2) throw new Error("Choose at least 2 PDF files to merge.");
  const { PDFDocument } = await import("pdf-lib");
  const merged = await PDFDocument.create();
  for (const f of files) {
    const { doc } = await loadPdf(f);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  const data = await merged.save();
  return out("merged.pdf", new Blob([data as BlobPart], { type: "application/pdf" }));
}

/** Parses "1-3, 5" into zero-based page indices; throws on invalid input. */
export function parseRanges(text: string, total: number): number[][] {
  const groups: number[][] = [];
  for (const part of text.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!m) throw new Error(`"${part}" is not a valid page range. Use e.g. 1-3, 5`);
    const a = Number(m[1]), b = Number(m[2] ?? m[1]);
    if (a < 1 || b < a || b > total) throw new Error(`Pages must be between 1 and ${total}.`);
    groups.push(Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i));
  }
  return groups;
}

export async function splitPdf(file: File, ranges: string) {
  const { PDFDocument, doc } = await loadPdf(file);
  const total = doc.getPageCount();
  const groups = ranges.trim() ? parseRanges(ranges, total) : doc.getPageIndices().map((i) => [i]);
  if (!groups.length) throw new Error("Enter pages to extract.");
  const result: OutFile[] = [];
  for (const g of groups) {
    const part = await PDFDocument.create();
    (await part.copyPages(doc, g)).forEach((p) => part.addPage(p));
    const first = g[0]! + 1, last = g[g.length - 1]! + 1;
    const label = first === last ? `page-${first}` : `pages-${first}-${last}`;
    result.push(out(`${base(file.name)}-${label}.pdf`, new Blob([(await part.save()) as BlobPart], { type: "application/pdf" })));
  }
  return result;
}

/** Make a light (white/paper) background transparent — ideal for signatures and logos. */
export async function removeBackground(file: File, strength = 60) {
  const bmp = await loadBitmap(file);
  if (bmp.width * bmp.height > 32000000) { bmp.close(); throw new Error("This image is too large. Choose a smaller image."); }
  const c = document.createElement("canvas");
  c.width = bmp.width; c.height = bmp.height;
  const ctx = c.getContext("2d");
  if (!ctx) { bmp.close(); throw new Error("Not enough memory to process this file."); }
  ctx.drawImage(bmp, 0, 0); bmp.close();
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  // Sample corners to learn the background colour.
  const pts = [0, c.width - 1, (c.height - 1) * c.width, c.height * c.width - 1];
  let br = 0, bg = 0, bb = 0;
  for (const p of pts) { br += d[p * 4]!; bg += d[p * 4 + 1]!; bb += d[p * 4 + 2]!; }
  br /= 4; bg /= 4; bb /= 4;
  // Flood-fill only from the image edges: background connected to the border is removed,
  // while similar colours inside the subject (skin, clothes, ink) stay untouched.
  const hard = 15 + strength * 0.6, soft = hard + 25;
  const W = c.width, H = c.height, seen = new Uint8Array(W * H), stack: number[] = [];
  const near = (p: number) => Math.hypot(d[p * 4]! - br, d[p * 4 + 1]! - bg, d[p * 4 + 2]! - bb);
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop()!;
    if (seen[p]) continue;
    seen[p] = 1;
    const dist = near(p);
    if (dist >= soft) continue;
    d[p * 4 + 3] = dist < hard ? 0 : Math.round(255 * ((dist - hard) / (soft - hard)));
    if (dist >= hard) continue;
    const x = p % W;
    if (x > 0) stack.push(p - 1);
    if (x < W - 1) stack.push(p + 1);
    if (p >= W) stack.push(p - W);
    if (p < (H - 1) * W) stack.push(p + W);
  }
  ctx.putImageData(img, 0, 0);
  try { return out(`${base(file.name)}-no-bg.png`, await canvasToBlob(c, "image/png")); }
  finally { c.width = 0; c.height = 0; }
}
