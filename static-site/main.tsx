// Static build of the same site Lovable serves, for hosts without a server
// (GitHub Pages). Components, styles and assets come straight from src/.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/styles.css";
import ProinnovaHome from "../src/components/proinnova/ProinnovaHome";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ProinnovaHome />
    </StrictMode>,
  );
}
