import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("pdf-to-jpg");

export const Route = createFileRoute("/pdf-to-jpg")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
