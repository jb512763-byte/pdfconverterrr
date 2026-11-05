import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { pageHead } from "@/components/PdfResult";

export const Route = createFileRoute("/about")({
  head: () => pageHead("/about", "About ConvertKit | ConvertKit", "ConvertKit offers free PDF and image tools that run fully in your browser – private, fast and free."),
  component: () => <InfoPage title="About ConvertKit"><p>ConvertKit is a free set of PDF and image tools: convert, compress, resize, merge, split, remove backgrounds, write PDFs and build resumes.</p><h2>Private by design</h2><p>Every tool runs on your own device. Your files are never uploaded to any server.</p><h2>Free for everyone</h2><p>No sign-up, no watermark. The site is supported by ads.</p></InfoPage>,
});
