import { FileImage, FileText, Images, Minimize2, Scaling, Check, Combine, Scissors, Eraser, Type, FileUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, type Tool } from "@/lib/tools";

const icons = { "pdf-to-img": FileImage, "img-to-pdf": FileText, convert: Images, compress: Minimize2, resize: Scaling, merge: Combine, split: Scissors, "bg-remove": Eraser };
const EXTRA = [{ href: "/text-to-pdf", label: "Text to PDF", Icon: Type, kind: "text" }, { href: "/resume-maker", label: "Resume Maker", Icon: FileUser, kind: "resume" }];
export const toolLabel = (tool: Tool) => tool.kind === "img-to-pdf" ? "Image to PDF" : tool.name;
export function ToolSelector({ selected, onSelect }: { selected: string; onSelect?: (slug: string) => void }) {
  const ordered = [...TOOLS].sort((a, b) => Number(b.slug === "jpg-to-pdf") - Number(a.slug === "jpg-to-pdf"));
  return <nav aria-label="Converter tools" className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
    {ordered.map((tool) => {
      const Icon = icons[tool.kind];
      const active = tool.slug === selected;
      const content = <><span className={`tool-symbol tool-symbol-${tool.kind}`}><Icon aria-hidden="true" /></span><span className="w-full whitespace-normal">{toolLabel(tool)}</span>{active && <Check className="absolute right-2 top-2 size-3" aria-hidden="true" />}</>;
      const props = { variant: "outline" as const, className: `tool-option relative h-auto min-h-28 flex-col gap-2 px-2 py-3 text-sm font-semibold leading-snug sm:min-h-32 sm:text-base ${active ? "tool-option-selected" : ""}` };
      return onSelect ? <Button key={tool.slug} {...props} aria-pressed={active} onClick={() => onSelect(tool.slug)}>{content}</Button> : <Button key={tool.slug} {...props} asChild><a href={`/${tool.slug}`} aria-current={active ? "page" : undefined}>{content}</a></Button>;
    })}
    {EXTRA.map(({ href, label, Icon, kind }) => <Button key={href} variant="outline" asChild className="tool-option relative h-auto min-h-28 flex-col gap-2 px-2 py-3 text-sm font-semibold leading-snug sm:min-h-32 sm:text-base"><a href={href}><span className={`tool-symbol tool-symbol-${kind}`}><Icon aria-hidden="true" /></span><span className="w-full whitespace-normal">{label}</span></a></Button>)}
  </nav>;
}