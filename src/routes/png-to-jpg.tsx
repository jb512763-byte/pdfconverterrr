import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("png-to-jpg");

export const Route = createFileRoute("/png-to-jpg")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
