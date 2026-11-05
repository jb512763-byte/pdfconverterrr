import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { pageHead } from "@/components/PdfResult";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("/contact", "Contact Us | ConvertKit", "Get in touch with ConvertKit for feedback, bug reports or partnership questions."),
  component: () => <InfoPage title="Contact Us"><p>Found a bug or have a feature idea? We would love to hear from you.</p><h2>Email</h2><p>support@convertkit.example (replace with your real address)</p><p>We usually reply within 2 working days.</p></InfoPage>,
});
