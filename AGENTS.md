<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Conversions are client-side only (src/lib/convert.ts, dynamically imported); never add server upload — zero server cost & privacy.
- Keep the PDF.js version browser-compatible and bundle its matching worker locally to avoid unsupported new browser APIs and external worker dependencies.
- Reuse the same conversion workspace on the home and dedicated tool pages so validation and download behavior remain consistent.
