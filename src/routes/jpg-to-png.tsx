import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("jpg-to-png");

export const Route = createFileRoute("/jpg-to-png")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
