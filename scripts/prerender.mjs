// Writes one pre-rendered HTML file per page (plus 404.html and sitemap.xml) into
// dist-static, from the built index.html template and the SSR bundle in dist-ssr.
// Run by scripts/build-static.sh after both builds.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist-static");
const ssrDir = resolve(root, "dist-ssr");
const SITE = "https://grupoproinnova.com";

const { render, pageMetas, headHtml } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);
const template = readFileSync(resolve(dist, "index.html"), "utf8");

const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/;
for (const marker of [SEO_BLOCK, /<body>/, /<div id="root"><\/div>/]) {
  if (!marker.test(template)) throw new Error(`template is missing ${marker}`);
}

const pages = pageMetas();
const ids = new Set();
for (const page of pages) {
  if (ids.has(page.id)) throw new Error(`duplicate page id ${page.id}`);
  ids.add(page.id);

  const html = template
    .replace(SEO_BLOCK, () => headHtml(page))
    .replace("<body>", () => `<body data-page="${page.id}">`)
    .replace('<div id="root"></div>', () => `<div id="root">${render(page.id)}</div>`);

  // "/servicios/x/" -> dist/servicios/x/index.html ; "/404.html" -> dist/404.html
  const file = page.path.endsWith(".html")
    ? resolve(dist, "." + page.path)
    : resolve(dist, "." + page.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`  ${page.path.padEnd(42)} ${Math.round(html.length / 1024)} KB`);
}

const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .filter((p) => !p.noindex)
  .map((p) => `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join("\n");
writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${pages.length} pages + sitemap.xml`);
