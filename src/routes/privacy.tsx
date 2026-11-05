import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { pageHead } from "@/components/PdfResult";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("/privacy", "Privacy Policy | ConvertKit", "ConvertKit privacy policy: files are processed on your device and never uploaded."),
  component: () => <InfoPage title="Privacy Policy"><p>Last updated: November 2026.</p><h2>Your files</h2><p>All conversions run in your browser. Files are never uploaded, stored or seen by us.</p><h2>Advertising and cookies</h2><p>We may show ads from third parties such as Google AdSense or Adsterra. These partners may use cookies to show relevant ads. You can control cookies in your browser settings and at google.com/settings/ads.</p><h2>Analytics</h2><p>We may collect anonymous usage statistics to improve the site.</p><h2>Contact</h2><p>Questions? Visit our Contact page.</p></InfoPage>,
});
