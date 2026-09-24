// Static build of the same site Lovable serves, for hosts without a server
// (GitHub Pages). Components, styles and assets come straight from src/.
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

import "../src/styles.css";
import { PageById } from "./pages";

const root = document.getElementById("root");
// Written by scripts/prerender.mjs; a plain `vite build` has none and shows the home page.
const id = document.body.dataset["page"] ?? "home";

const app = (
  <StrictMode>
    <PageById id={id} />
  </StrictMode>
);

// Deployed pages are pre-rendered: hydrate them. Without the prerender step #root is empty.
if (root) {
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
