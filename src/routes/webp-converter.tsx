import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, toolHead } from "@/components/ToolPage";
import { getTool } from "@/lib/tools";

const tool = getTool("webp-converter");

export const Route = createFileRoute("/webp-converter")({
  head: () => toolHead(tool),
  component: () => <ToolPage tool={tool} />,
});
