// All conversion runs in the browser. Never import this from server code.
export interface OutFile { name: string; blob: Blob; url: string }

const extFor = (mime: string) => (mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg");
const base = (n: string) => n.replace(/\.[^.]+$/, "");

async function loadBitmap(file: Blob): Promise<ImageBitmap> {
  return await createImageBitmap(file);
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
  const ctx = c.getContext("2d")!;
  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await canvasToBlob(c, mime, mime === "image/png" ? undefined : quality);
  return out(`${base(file.name)}.${extFor(mime)}`, blob);
}

export async function compressImage(file: File, quality: number) {
  // PNG has no quality knob in canvas; output WebP-free JPG for PNG unless transparency matters → use webp.
  const mime = file.type === "image/png" ? "image/webp" : file.type;
  const r = await convertImage(file, mime, quality);
  if (r.blob.size >= file.size) return out(file.name, file);
  return r;
}

export async function resizeImage(file: File, opts: { width?: number; percent?: number }) {
  const bmp = await loadBitmap(file);
  let w = bmp.width, h = bmp.height;
  if (opts.percent) { w = Math.round(w * opts.percent / 100); h = Math.round(h * opts.percent / 100); }
  else if (opts.width) { h = Math.round(h * opts.width / w); w = opts.width; }
  const mime = file.type || "image/jpeg";
  return convertImage(file, mime, 0.92, Math.max(1, w), Math.max(1, h));
}

export async function pdfToImages(file: File, onProgress?: (p: number) => void) {
  const pdfjs = await import("pdfjs-dist");
  const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const results: OutFile[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const vp = page.getViewport({ scale: 2 });
    const c = document.createElement("canvas");
    c.width = vp.width; c.height = vp.height;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp, canvas: c } as never).promise;
    results.push(out(`${base(file.name)}-page-${i}.jpg`, await canvasToBlob(c, "image/jpeg", 0.92)));
    onProgress?.(i / doc.numPages);
  }
  return results;
}

export async function imagesToPdf(files: File[]) {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  for (const f of files) {
    let bytes: ArrayBuffer, isPng = f.type === "image/png";
    if (f.type === "image/jpeg" || isPng) bytes = await f.arrayBuffer();
    else { const j = await convertImage(f, "image/jpeg"); bytes = await j.blob.arrayBuffer(); isPng = false; }
    const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  const data = await pdf.save();
  return out(`${base(files[0].name)}.pdf`, new Blob([data as BlobPart], { type: "application/pdf" }));
}

export async function zipAll(files: OutFile[]) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  files.forEach((f) => zip.file(f.name, f.blob));
  return await zip.generateAsync({ type: "blob" });
}

export const fmtSize = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`);
