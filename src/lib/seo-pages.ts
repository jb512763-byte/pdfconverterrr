// Programmatic SEO landing pages. Each page reuses one real converter tool
// with a preset, so every URL is a working tool — not a thin doorway page.
import type { Tool } from "./tools";

export interface WorkspacePreset {
  kb?: number;
  quality?: number;
  resizeMode?: "percent" | "width";
  resizeValue?: string;
}

export type SeoCluster = "compress" | "resize" | "jpg-to-pdf" | "pdf-to-jpg" | "convert" | "merge" | "split";

export interface SeoPage {
  slug: string;
  toolSlug: Tool["slug"];
  cluster: SeoCluster;
  title: string;
  description: string;
  h1: string;
  sub: string;
  angle: string[];
  preset?: WorkspacePreset;
}

const BRAND = " | ConvertKit";

function kbLabel(kb: number) {
  return kb >= 1024 ? `${kb % 1024 === 0 ? kb / 1024 : (kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

function compressPage(slug: string, kb: number, phrase: string, angle: string): SeoPage {
  const label = kbLabel(kb);
  return {
    slug,
    toolSlug: "image-compressor",
    cluster: "compress",
    title: `${phrase} – Free Online, No Upload${BRAND}`,
    description: `${phrase} online for free. Your photo shrinks right inside your browser — no upload, no sign-up, no watermark. Perfect for exam and government forms.`,
    h1: phrase,
    sub: `Shrink any photo to under ${label} in seconds — it all happens on your device.`,
    angle: [angle, "Because the work runs on your own device, even a heavy camera photo is ready in seconds and your original never leaves your phone."],
    preset: { kb },
  };
}

function resizePage(slug: string, mode: "width" | "percent", value: string, phrase: string, sub: string, angle: string): SeoPage {
  return {
    slug,
    toolSlug: "image-resizer",
    cluster: "resize",
    title: `${phrase} – Free Online, No Upload${BRAND}`,
    description: `${phrase} online for free. Set the exact size and download instantly — everything runs in your browser, no upload, no sign-up.`,
    h1: phrase,
    sub,
    angle: [angle, "The height follows automatically so your photo never stretches, and the resized image downloads straight to your device."],
    preset: mode === "width" ? { resizeMode: "width", resizeValue: value } : { resizeMode: "percent", resizeValue: value },
  };
}

function toolPage(slug: string, toolSlug: SeoPage["toolSlug"], cluster: SeoCluster, phrase: string, sub: string, angle: string[]): SeoPage {
  return {
    slug,
    toolSlug,
    cluster,
    title: `${phrase} – Free Online, No Upload${BRAND}`,
    description: `${phrase} online for free. Fast, private and watermark-free — files never leave your browser, and there is no sign-up.`,
    h1: phrase,
    sub,
    angle,
  };
}

export const SEO_PAGES: SeoPage[] = [
  // ---------- Compress to a KB limit (govt & exam forms) ----------
  compressPage("compress-image-to-10kb", 10, "Compress Image to 10KB", "A 10 KB limit is the strictest one, used by a few portal forms. This page scales your photo down step by step until it fits — small file, face still recognisable."),
  compressPage("compress-image-to-20kb", 20, "Compress Image to 20KB", "Many SSC, banking and school forms reject photos above 20 KB. This page shrinks your photo to under 20 KB while keeping the face clear enough to pass verification."),
  compressPage("compress-image-to-25kb", 25, "Compress Image to 25KB", "Some state exam portals cap uploads at 25 KB. The trick is lowering resolution, not just quality — this tool scales your photo down in steps until it fits."),
  compressPage("compress-image-to-30kb", 30, "Compress Image to 30KB", "Need a photo under 30 KB? The compressor tries several quality levels automatically and keeps the sharpest one that fits the limit."),
  compressPage("compress-image-to-40kb", 40, "Compress Image to 40KB", "A 40 KB limit is common for passport photo uploads on job application forms. Drop your picture and get a clean JPG under the limit."),
  compressPage("compress-image-to-50kb", 50, "Compress Image to 50KB", "50 KB is the most common photo limit on Indian exam and scholarship forms. This page is tuned for exactly that: a clear face in a tiny file."),
  compressPage("compress-image-to-60kb", 60, "Compress Image to 60KB", "If your form allows up to 60 KB, you get noticeably more detail than a 20 KB upload — enough for a crisp passport-style photo."),
  compressPage("compress-image-to-80kb", 80, "Compress Image to 80KB", "80 KB leaves room for detail while staying tiny enough for almost any upload box that rejects heavy files."),
  compressPage("compress-image-to-100kb", 100, "Compress Image to 100KB", "100 KB is a very common upload limit for admission, recruitment and ID photos. Compress here and the result stays sharp at that size."),
  compressPage("compress-image-to-150kb", 150, "Compress Image to 150KB", "150 KB suits college admission portals that reject multi-megabyte camera photos but allow a little more detail than the usual 50 KB."),
  compressPage("compress-image-to-200kb", 200, "Compress Image to 200KB", "200 KB is typical for signature plus photo uploads on university and recruitment portals. Shrink here without visibly losing quality."),
  compressPage("compress-image-to-500kb", 500, "Compress Image to 500KB", "Some portals allow up to 500 KB but reject heavy camera files. Get a shareable, upload-friendly size without wrecking the image."),
  compressPage("compress-image-to-1mb", 1024, "Compress Image to 1MB", "Bring a heavy camera photo under 1 MB for email attachments, upload limits and faster sharing — the compressor picks the best quality that fits."),
  compressPage("compress-jpeg-to-50kb", 50, "Compress JPEG to 50KB", "Already have a JPEG that is slightly too big? Re-compress it to under 50 KB — the tool only shrinks when it makes the file smaller."),
  compressPage("compress-jpeg-to-100kb", 100, "Compress JPEG to 100KB", "Turn any oversized JPEG into a portal-ready file under 100 KB, with quality chosen automatically for the clearest result."),
  compressPage("compress-photo-to-20kb", 20, "Compress Photo to 20KB", "Phone photos are often 50–100 times bigger than form limits. This page brings any photo under 20 KB in one tap."),
  compressPage("compress-photo-to-50kb", 50, "Compress Photo to 50KB", "Compress a gallery photo to under 50 KB for exam, scholarship and ID form uploads — free, instant and private."),
  compressPage("compress-photo-to-100kb", 100, "Compress Photo to 100KB", "Shrink a gallery photo to under 100 KB while keeping it sharp for admission forms, ID cards and online verification."),
  compressPage("compress-png-to-100kb", 100, "Compress PNG to 100KB", "PNG screenshots are huge. Compress a PNG to under 100 KB — the output is a JPG, which every form and app accepts."),
  compressPage("signature-compress-to-20kb", 20, "Compress Signature to 20KB", "Forms often ask for a signature image under 20 KB. Compress your signature scan or photo here so the strokes stay readable at a tiny size."),

  // ---------- Resize to exact dimensions ----------
  resizePage("resize-image-to-300px", "width", "300", "Resize Image to 300px", "Make any photo exactly 300 pixels wide — height follows automatically.", "300 px wide is perfect for avatars, thumbnails and small form uploads, and it keeps the file light."),
  resizePage("resize-image-to-600px", "width", "600", "Resize Image to 600px", "Set any photo to 600 pixels wide in one tap — free and instant.", "600 pixels wide fits most online forms, blogs and product listings without wasting data."),
  resizePage("resize-image-to-720px", "width", "720", "Resize Image to 720px", "Resize any photo to 720 pixels wide — instant, private and free.", "720 px matches HD-ready previews and most chat or status image limits."),
  resizePage("resize-image-to-800px", "width", "800", "Resize Image to 800px", "Resize any photo to 800 pixels wide right in your browser.", "800 px is a sweet spot for websites and email — a light file that still looks sharp."),
  resizePage("resize-image-to-1000px", "width", "1000", "Resize Image to 1000px", "Resize any photo to exactly 1000 pixels wide, no upload needed.", "1000 px wide is a common marketplace and listing size, big enough for detail yet easy to upload."),
  resizePage("resize-image-to-1080px", "width", "1080", "Resize Image to 1080px", "Resize any photo to 1080 pixels wide — the size social platforms expect.", "1080 px is the standard width for feed posts, so your photo uploads crisp instead of being re-compressed by the app."),
  resizePage("resize-image-to-1200px", "width", "1200", "Resize Image to 1200px", "Resize any photo to 1200 pixels wide instantly, in your browser.", "1200 px wide suits presentation slides, banners and full-width website images."),
  resizePage("resize-image-to-2000px", "width", "2000", "Resize Image to 2000px", "Resize any photo to 2000 pixels wide — free and private.", "2000 px keeps enough resolution for prints and large screens while cutting the file size of heavy camera photos."),
  resizePage("resize-photo-to-25-percent", "percent", "25", "Resize Photo to 25%", "Shrink any photo to a quarter of its size in one tap.", "Quarter size cuts megapixels and file size dramatically — ideal when a form rejects large images."),
  resizePage("resize-photo-to-50-percent", "percent", "50", "Resize Photo to 50%", "Shrink any photo to half its size instantly, without uploading it.", "Half size halves both dimensions, which usually cuts the file size to a quarter — great for quick sharing."),
  resizePage("resize-photo-to-75-percent", "percent", "75", "Resize Photo to 75%", "Shrink any photo to 75% of its size right on your device.", "A gentle 75% resize trims file size while keeping the photo visually identical."),
  resizePage("resize-signature-for-form", "width", "200", "Resize Signature for Online Forms", "Make your signature the exact width your form asks for.", "Set the width your form requires — the height follows automatically, so pen strokes stay natural instead of stretched."),

  // ---------- JPG / images to PDF ----------
  toolPage("multiple-jpg-to-one-pdf", "jpg-to-pdf", "jpg-to-pdf", "Multiple JPG to One PDF", "Combine many JPG photos into a single PDF, in your chosen order.", ["Add as many photos as you need — each becomes one page, in the order you add them. Re-order or remove any photo before creating the PDF.", "Everything is assembled on your device, so even dozens of photos take only seconds."]),
  toolPage("convert-jpg-to-pdf", "jpg-to-pdf", "jpg-to-pdf", "Convert JPG to PDF", "Turn JPG photos into a PDF document instantly, free and private.", ["Drop your JPG and download a PDF in seconds. There is no upload, no watermark and no page limit beyond your device's memory."]),
  toolPage("photo-to-pdf", "jpg-to-pdf", "jpg-to-pdf", "Photo to PDF Converter", "Convert phone photos into one clean PDF document.", ["Photograph documents with your camera, add the shots here, and get a single tidy PDF — the way scan apps do it, without an account."]),
  toolPage("png-to-pdf", "jpg-to-pdf", "jpg-to-pdf", "PNG to PDF Converter", "Turn PNG screenshots and images into a PDF document.", ["PNG screenshots convert at full quality. Transparent areas are flattened onto white, so the pages print cleanly."]),
  toolPage("webp-to-pdf", "jpg-to-pdf", "jpg-to-pdf", "WebP to PDF Converter", "Convert WebP images from the web or chats into a PDF.", ["WebP photos from websites, WhatsApp or downloads are converted to PDF pages automatically — no extra software needed."]),
  toolPage("convert-images-to-pdf", "jpg-to-pdf", "jpg-to-pdf", "Convert Images to PDF", "Combine JPG, PNG or WebP images into one PDF file.", ["Mix formats freely: JPG, PNG and WebP all become pages of one PDF, in the order you choose, converted entirely on your device."]),
  toolPage("jpg-to-pdf-high-quality", "jpg-to-pdf", "jpg-to-pdf", "JPG to PDF in High Quality", "Create a PDF that keeps every pixel of your original images.", ["Images are embedded at their full original resolution, so the PDF keeps all the detail — no re-compression, no blur."]),
  toolPage("jpg-to-pdf-without-upload", "jpg-to-pdf", "jpg-to-pdf", "JPG to PDF Without Upload", "Make a PDF from JPG photos without uploading anything.", ["Every step happens inside your browser tab. Your photos are never sent to any server — safe for ID proofs and personal documents."]),

  // ---------- PDF to JPG ----------
  toolPage("pdf-to-jpeg", "pdf-to-jpg", "pdf-to-jpg", "PDF to JPEG Converter", "Turn every PDF page into a JPEG image, right in your browser.", ["Each page becomes a sharp JPEG, ready for forms, chats and printing. Download images one by one or grab them all as a ZIP."]),
  toolPage("convert-pdf-to-image", "pdf-to-jpg", "pdf-to-jpg", "Convert PDF to Image", "Convert PDF pages into image files without uploading anything.", ["The PDF is rendered on your own device, so confidential documents stay confidential. You get one image per page, in order."]),
  toolPage("pdf-to-jpg-hd", "pdf-to-jpg", "pdf-to-jpg", "PDF to JPG in HD", "Render PDF pages as high-quality JPG images.", ["Pages render at 2x scale, so text, signatures and lines stay crisp even when you zoom in or print the image."]),
  toolPage("pdf-pages-to-images", "pdf-to-jpg", "pdf-to-jpg", "PDF Pages to Images", "Split a PDF into one image per page, instantly.", ["Every page of your PDF becomes its own image file, named by page number, with a ZIP download when there are many pages."]),
  toolPage("pdf-to-jpg-without-upload", "pdf-to-jpg", "pdf-to-jpg", "PDF to JPG Without Upload", "Convert a PDF to JPG images without uploading the file.", ["No server ever sees your document. The conversion runs in your browser, which makes it safe for contracts, marksheets and ID proofs."]),
  toolPage("pdf-page-to-jpg", "pdf-to-jpg", "pdf-to-jpg", "PDF Page to JPG", "Need just one page as an image? Convert the whole PDF and pick it.", ["Convert the PDF once, then download only the page you need — every page is rendered as a ready JPG, so nothing extra to install."]),

  // ---------- Format conversion ----------
  toolPage("jpg-to-webp", "webp-converter", "convert", "Convert JPG to WebP", "Turn JPG photos into smaller WebP files for faster websites.", ["WebP files are typically 25–35% smaller than JPG at the same visual quality, which makes pages and apps load faster."]),
  toolPage("png-to-webp", "webp-converter", "convert", "Convert PNG to WebP", "Shrink heavy PNG screenshots into tiny WebP images.", ["WebP keeps transparency where JPG cannot, so logos and screenshots stay clean while the file size drops sharply."]),
  toolPage("convert-webp-to-jpg", "webp-to-jpg", "convert", "Convert WebP to JPG", "Open WebP images everywhere by converting them to JPG.", ["JPG opens in every gallery, editor and form. Transparent WebP areas are filled with white so nothing looks broken."]),
  toolPage("jpeg-to-png", "jpg-to-png", "convert", "Convert JPEG to PNG", "Convert JPG photos into lossless PNG images.", ["PNG is lossless, so the image survives future edits and re-saves without quality loss — ideal for logos, art and editing."]),

  // ---------- Merge PDF ----------
  toolPage("merge-two-pdf", "merge-pdf", "merge", "Merge Two PDF Files", "Combine two PDF files into one, in your order.", ["Drop both PDFs, arrange the order with the arrows, and download a single combined file. It takes about ten seconds, entirely on your device."]),
  toolPage("merge-pdf-files-online", "merge-pdf", "merge", "Merge PDF Files Online", "Join any number of PDF files into one document, free.", ["There is no page or file limit — merge two files or twenty. Order them, merge them, download the result as one PDF."]),
  toolPage("combine-pdf-files", "merge-pdf", "merge", "Combine PDF Files", "Combine several PDFs into a single clean document.", ["Certificates, invoices or chapter scans — combine them into one file for printing, emailing or uploading."]),
  toolPage("merge-multiple-pdfs", "merge-pdf", "merge", "Merge Multiple PDFs into One", "Merge many PDF documents into one file in seconds.", ["Add all your PDFs at once, set the order, and get one merged document. Nothing is uploaded, so private files stay private."]),
  toolPage("merge-pdf-pages", "merge-pdf", "merge", "Merge PDF Pages", "Bring PDF pages together into one continuous document.", ["Every page of every file is copied in order, so the merged PDF reads like one continuous document."]),
  toolPage("pdf-merge-without-upload", "merge-pdf", "merge", "PDF Merge Without Upload", "Merge PDFs without uploading them to any server.", ["The merge happens inside your browser tab. Your documents never touch the internet — ideal for confidential papers."]),

  // ---------- Split / extract PDF ----------
  toolPage("extract-pages-from-pdf", "split-pdf", "split", "Extract Pages from PDF", "Pull specific pages out of a PDF as new files.", ["Type ranges like 1-3, 5 and each range becomes its own PDF. Perfect for sending only the relevant pages of a long document."]),
  toolPage("split-pdf-into-single-pages", "split-pdf", "split", "Split PDF into Single Pages", "Turn every page of a PDF into its own file.", ["Leave the page box empty and every page becomes a separate PDF, named by page number — with a ZIP download for convenience."]),
  toolPage("split-pdf-by-page-range", "split-pdf", "split", "Split PDF by Page Range", "Cut a PDF into parts using page ranges like 1-4, 5-8.", ["Each range you type becomes its own PDF file, so one big scan can be split into chapters or sections in seconds."]),
  toolPage("split-pdf-in-two", "split-pdf", "split", "Split a PDF in Two", "Divide a PDF into two parts with one simple range.", ["Type a range such as 1-2 and the pages before and after become two separate PDFs — handy for contracts and long scans."]),
  toolPage("separate-pdf-pages", "split-pdf", "split", "Separate PDF Pages", "Separate a multi-page PDF into individual files.", ["Separate every page, or only the ranges you choose. The splitting runs on your device, so the original file never leaves it."]),
  toolPage("split-pdf-without-upload", "split-pdf", "split", "Split PDF Without Upload", "Split a PDF into parts without uploading it anywhere.", ["No server receives your document — the browser does all the work. Safe for marksheets, agreements and personal records."]),

  // ---------- Privacy ----------
  toolPage("compress-image-without-upload", "image-compressor", "compress", "Compress Images Without Upload", "Shrink photos to a size limit without uploading them.", ["Compression runs fully in your browser: pick a KB limit or quality, and download the smaller file. Your originals stay on your device."]),
];

export const RESERVED_SLUGS = new Set(["about", "privacy-policy", "terms-of-use", "contact", "sitemap.xml", "favicon.ico", "robots.txt"]);

export function getSeoPage(slug: string | undefined): SeoPage | undefined {
  if (!slug || RESERVED_SLUGS.has(slug)) return undefined;
  return SEO_PAGES.find((p) => p.slug === slug);
}

export function relatedSeoPages(slug: string, limit = 8): SeoPage[] {
  const page = getSeoPage(slug);
  if (!page) return [];
  const same = SEO_PAGES.filter((p) => p.cluster === page.cluster && p.slug !== slug);
  const others = SEO_PAGES.filter((p) => p.cluster !== page.cluster && p.slug !== slug);
  return [...same, ...others].slice(0, limit);
}

export const CLUSTER_HEADINGS: Record<SeoCluster, string> = {
  compress: "More photo size limits",
  resize: "Other resize presets",
  "jpg-to-pdf": "More ways to make a PDF",
  "pdf-to-jpg": "More PDF to image pages",
  convert: "Other format converters",
  merge: "More ways to combine PDFs",
  split: "More ways to split a PDF",
};
