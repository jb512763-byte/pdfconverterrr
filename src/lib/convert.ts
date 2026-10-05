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
  c.width = width ?? bmp.width;
  c.height = height ?? bmp.height;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Not enough memory to process this file. Try a smaller file.");
  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await canvasToBlob(c, mime, mime === "image/png" ? undefined : quality);
  bmp.close(); c.width = 0; c.height = 0;
  if (blob.type !== mime) throw new Error("Your browser does not support this output format.");
  return out(`${base(file.name)}.${extFor(mime)}`, blob);
}

export async function compressImage(file: File, quality: number) {
  // PNG has no quality knob in canvas; output WebP-free JPG for PNG unless transparency matters → use webp.
  const mime = fileMime(file) === "image/png" ? "image/webp" : fileMime(file);
  const r = await convertImage(file, mime, quality);
  if (r.blob.size >= file.size) { URL.revokeObjectURL(r.url); return out(file.name, file); }
  return r;
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
  files.forEach((f) => zip.file(f.name, f.blob));
  return await zip.generateAsync({ type: "blob" });
}

export const fmtSize = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`);
