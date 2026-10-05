export type ToolKind = "pdf-to-img" | "img-to-pdf" | "convert" | "compress" | "resize";

export interface Tool {
  slug: string;
  name: string;
  short: string;
  title: string;
  description: string;
  kind: ToolKind;
  accept: string;
  target?: "image/jpeg" | "image/png" | "image/webp";
  steps: string[];
  faqs: { q: string; a: string }[];
}

const privacyFaq = {
  q: "Are my files uploaded to a server?",
  a: "No. Every conversion runs 100% inside your browser. Your files never leave your device, so they stay completely private.",
};
const freeFaq = {
  q: "Is it free? Is there a file limit?",
  a: "Yes, it is completely free with no sign-up and no watermark. Limits only depend on your device's memory.",
};

export const TOOLS: Tool[] = [
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    short: "Turn every PDF page into a high-quality JPG image.",
    title: "PDF to JPG Converter – Free, Fast & Private | ConvertKit",
    description: "Convert PDF to JPG online for free. Every page becomes a sharp JPG image. Runs in your browser – no upload, no sign-up.",
    kind: "pdf-to-img",
    accept: "application/pdf",
    target: "image/jpeg",
    steps: ["Choose or drop your PDF file.", "Pages are rendered to JPG right in your browser.", "Download images one by one or all as a ZIP."],
    faqs: [privacyFaq, { q: "What quality are the JPG images?", a: "Pages are rendered at 2x scale for crisp, print-friendly images." }, freeFaq],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    short: "Combine JPG, PNG or WebP images into one PDF.",
    title: "JPG to PDF Converter – Merge Images into PDF Free | ConvertKit",
    description: "Convert JPG, PNG and WebP images to a single PDF online. Free, instant and private – files never leave your browser.",
    kind: "img-to-pdf",
    accept: "image/jpeg,image/png,image/webp",
    steps: ["Add one or more images.", "Each image becomes a page in the PDF.", "Download your PDF instantly."],
    faqs: [privacyFaq, { q: "Can I add many images at once?", a: "Yes. Select multiple images and they are added in the order you chose them." }, freeFaq],
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    short: "Convert PNG images to smaller JPG files.",
    title: "PNG to JPG Converter – Free Online, No Upload | ConvertKit",
    description: "Convert PNG to JPG online in seconds. Transparent areas become white. 100% browser-based, private and free.",
    kind: "convert",
    accept: "image/png",
    target: "image/jpeg",
    steps: ["Drop your PNG images.", "They are converted to JPG instantly.", "Download individually or as a ZIP."],
    faqs: [privacyFaq, { q: "What happens to transparency?", a: "JPG does not support transparency, so transparent areas are filled with white." }, freeFaq],
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    short: "Convert JPG photos to lossless PNG.",
    title: "JPG to PNG Converter – Free & Lossless | ConvertKit",
    description: "Convert JPG to PNG online for free. Lossless output, batch support, and no file uploads – everything runs in your browser.",
    kind: "convert",
    accept: "image/jpeg",
    target: "image/png",
    steps: ["Drop your JPG images.", "They are converted to PNG instantly.", "Download individually or as a ZIP."],
    faqs: [privacyFaq, freeFaq],
  },
  {
    slug: "webp-converter",
    name: "WebP Converter",
    short: "Convert JPG/PNG to WebP for faster websites.",
    title: "WebP Converter – JPG & PNG to WebP Free | ConvertKit",
    description: "Convert JPG and PNG to WebP online. Smaller images for faster websites. Free, private, in-browser conversion.",
    kind: "convert",
    accept: "image/jpeg,image/png",
    target: "image/webp",
    steps: ["Drop your JPG or PNG images.", "They are converted to WebP instantly.", "Download individually or as a ZIP."],
    faqs: [privacyFaq, { q: "Why use WebP?", a: "WebP files are typically 25–35% smaller than JPG at similar quality, which makes websites load faster." }, freeFaq],
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG",
    short: "Convert WebP images to widely supported JPG.",
    title: "WebP to JPG Converter – Free Online | ConvertKit",
    description: "Convert WebP to JPG online for free. Works with every app and device. No upload – runs in your browser.",
    kind: "convert",
    accept: "image/webp",
    target: "image/jpeg",
    steps: ["Drop your WebP images.", "They are converted to JPG instantly.", "Download individually or as a ZIP."],
    faqs: [privacyFaq, freeFaq],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    short: "Shrink JPG, PNG and WebP file size.",
    title: "Image Compressor – Reduce Image Size Online Free | ConvertKit",
    description: "Compress JPG, PNG and WebP images online. Reduce file size up to 80% while keeping quality. Private, browser-based, free.",
    kind: "compress",
    accept: "image/jpeg,image/png,image/webp",
    steps: ["Drop your images.", "Pick a quality level with the slider.", "Download the smaller files."],
    faqs: [privacyFaq, { q: "How much smaller will my images be?", a: "Usually 40–80% smaller depending on the image and quality setting." }, freeFaq],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    short: "Resize images to any width and height.",
    title: "Image Resizer – Resize Photos Online Free | ConvertKit",
    description: "Resize images to exact pixel dimensions or by percentage. Free, fast and private – no upload needed.",
    kind: "resize",
    accept: "image/jpeg,image/png,image/webp",
    steps: ["Drop your images.", "Enter a new width (height keeps the ratio) or a percentage.", "Download the resized images."],
    faqs: [privacyFaq, freeFaq],
  },
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug)!;
