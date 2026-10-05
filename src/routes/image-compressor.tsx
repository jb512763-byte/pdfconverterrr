import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("image-compressor");

export const Route = createFileRoute("/image-compressor")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
