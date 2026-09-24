// Build-time render of the page to plain HTML (scripts/prerender.mjs), so search
// engines and link previews get the full content without running JavaScript.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";

import ProinnovaHome from "../src/components/proinnova/ProinnovaHome";

export function render() {
  return renderToString(
    <StrictMode>
      <ProinnovaHome />
    </StrictMode>,
  );
}
