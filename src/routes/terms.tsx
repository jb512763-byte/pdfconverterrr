import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { pageHead } from "@/components/PdfResult";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("/terms", "Terms of Service | ConvertKit", "Terms of use for ConvertKit free online PDF and image tools."),
  component: () => <InfoPage title="Terms of Service"><p>By using ConvertKit you agree to these terms.</p><h2>Use of the tools</h2><p>The tools are provided free and as-is, without warranty. Keep a copy of your original files.</p><h2>Your content</h2><p>You are responsible for the files you process and must have the right to use them.</p><h2>Changes</h2><p>We may update these terms at any time.</p></InfoPage>,
});
