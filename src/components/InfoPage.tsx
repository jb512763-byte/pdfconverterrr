import type { ReactNode } from "react";
import { SiteShell } from "./SiteShell";

export function InfoPage({ title, children }: { title: string; children: ReactNode }) {
  return <SiteShell><article className="mx-auto max-w-2xl space-y-4 px-4 py-8 text-base leading-relaxed text-muted-foreground [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground">
    <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
    {children}
  </article></SiteShell>;
}
