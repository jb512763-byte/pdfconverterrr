import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("image-resizer");

export const Route = createFileRoute("/image-resizer")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
