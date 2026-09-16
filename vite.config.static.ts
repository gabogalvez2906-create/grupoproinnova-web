// Static single-page build for GitHub Pages (grupoproinnova.com).
// Lovable does not use this file; its build is vite.config.ts.
// three.js already lands in its own chunk because the hero scene is lazy-loaded.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "static-site",
  publicDir: "../public",
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../dist-static",
    emptyOutDir: true,
  },
});
