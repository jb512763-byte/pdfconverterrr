import { FileImage, FileText, Images, Minimize2, Scaling, Check, Combine, Scissors, Eraser, Type, FileUser, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOLS, type Tool } from "@/lib/tools";

const icons: Record<string, LucideIcon> = { "pdf-to-img": FileImage, "img-to-pdf": FileText, convert: Images, compress: Minimize2, resize: Scaling, merge: Combine, split: Scissors, "bg-remove": Eraser };
export const toolLabel = (tool: Tool) => tool.kind === "img-to-pdf" ? "Image to PDF" : tool.name;

type Item = { slug?: string; href: string; label: string; kind: string; Icon: LucideIcon };
const fromTool = (slug: string, label?: string): Item => {
  const t = TOOLS.find((x) => x.slug === slug)!;
  return { slug, href: `/${slug}`, label: label ?? toolLabel(t), kind: t.kind, Icon: icons[t.kind] ?? FileText };
};

/** Four clear groups, like big PDF suites: PDF, Image, Govt exam, Career. */
export const CATEGORIES: { title: string; items: Item[] }[] = [
  { title: "PDF tools", items: [fromTool("jpg-to-pdf"), fromTool("pdf-to-jpg"), fromTool("merge-pdf"), fromTool("split-pdf"), { href: "/text-to-pdf", label: "Text to PDF", kind: "text", Icon: Type }] },
  { title: "Image tools", items: [fromTool("png-to-jpg"), fromTool("jpg-to-png"), fromTool("webp-converter"), fromTool("webp-to-jpg"), fromTool("image-resizer")] },
  { title: "Govt exam & form photos", items: [fromTool("image-compressor", "Photo to 20/50 KB"), fromTool("remove-background", "Signature Cleaner")] },
  { title: "Career", items: [{ href: "/resume-maker", label: "Resume Maker", kind: "resume", Icon: FileUser }] },
];

export function ToolSelector({ selected, onSelect }: { selected: string; onSelect?: (slug: string) => void }) {
  return <nav aria-label="Converter tools" className="space-y-5">
    {CATEGORIES.map((cat) => <section key={cat.title}>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{cat.title}</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {cat.items.map(({ slug, href, label, kind, Icon }) => {
          const active = slug === selected;
          const content = <><span className={`tool-symbol tool-symbol-${kind}`}><Icon aria-hidden="true" /></span><span className="w-full whitespace-normal">{label}</span>{active && <Check className="absolute right-2 top-2 size-3" aria-hidden="true" />}</>;
          const cls = `tool-option relative h-auto min-h-24 flex-col gap-1.5 px-2 py-3 text-xs font-semibold leading-snug sm:min-h-28 sm:text-sm ${active ? "tool-option-selected" : ""}`;
          return onSelect && slug
            ? <Button key={href} variant="outline" className={cls} aria-pressed={active} onClick={() => onSelect(slug)}>{content}</Button>
            : <Button key={href} variant="outline" className={cls} asChild><a href={href} aria-current={active ? "page" : undefined}>{content}</a></Button>;
        })}
      </div>
    </section>)}
  </nav>;
}
