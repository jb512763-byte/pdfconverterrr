import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("split-pdf");

export const Route = createFileRoute("/split-pdf")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
