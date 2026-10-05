import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("jpg-to-pdf");

export const Route = createFileRoute("/jpg-to-pdf")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
