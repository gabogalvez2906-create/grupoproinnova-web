// Build-time render of every page to plain HTML (scripts/prerender.mjs), so search
// engines and link previews get the full content without running JavaScript.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";

import { PageById } from "./pages";

export { pageMetas, headHtml } from "../src/components/proinnova/seo";

export function render(id: string) {
  return renderToString(
    <StrictMode>
      <PageById id={id} />
    </StrictMode>,
  );
}
