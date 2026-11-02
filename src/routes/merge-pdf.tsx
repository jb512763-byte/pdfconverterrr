import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("merge-pdf");

export const Route = createFileRoute("/merge-pdf")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
