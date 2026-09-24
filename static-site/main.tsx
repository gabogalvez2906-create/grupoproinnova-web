// Static build of the same site Lovable serves, for hosts without a server
// (GitHub Pages). Components, styles and assets come straight from src/.
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import "../src/styles.css";
import ProinnovaHome from "../src/components/proinnova/ProinnovaHome";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <ProinnovaHome />
  </StrictMode>
);
// The deployed HTML is pre-rendered (scripts/prerender.mjs): hydrate it. A plain
// `vite build` without the prerender step leaves #root empty, so render instead.
if (root) {
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
