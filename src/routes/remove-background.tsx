import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("remove-background");

export const Route = createFileRoute("/remove-background")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
