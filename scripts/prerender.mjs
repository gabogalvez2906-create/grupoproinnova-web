// Injects the server-rendered page into dist-static/index.html.
// Run after both builds (see scripts/build-static.sh).
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(root, "dist-static/index.html");
const ssrDir = resolve(root, "dist-ssr");

const { render } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);
const app = render();
const html = readFileSync(htmlPath, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("root placeholder not found");
writeFileSync(htmlPath, html.replace('<div id="root"></div>', `<div id="root">${app}</div>`));
rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${Math.round(app.length / 1024)} KB of HTML`);
