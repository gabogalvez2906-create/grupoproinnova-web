# Proinnova — sitio web

Sitio corporativo de **Grupo Proinnova** (constructora, Guatemala). **En vivo:** https://grupoproinnova.com

Usuario: Gabriel "Gabo" Galvez. **Escríbele siempre en español.** Juzga el resultado por cómo se ve,
así que muéstrale capturas, no descripciones.

## Dónde está el código

- **Este repo es el canónico.** Rama `main`, remoto `gabogalvez2906-create/grupoproinnova-web`.
- El sitio vive en `src/components/proinnova/`. Es la plantilla TanStack Start de Lovable, pero lo
  que importa son esos componentes + `src/styles.css`.
- `vite.config.static.ts` + `static-site/` compilan **los mismos componentes** a `dist-static/`,
  que es lo que se publica en GitHub Pages.
- `../proinnova-web` es la versión vieja (Vite plano). **No la edites.** Solo se usa porque ahí está
  instalado Playwright para correr los scripts de verificación.

## Comandos

```bash
./node_modules/.bin/tsc --noEmit                    # typecheck (TS estricto, debe salir limpio)
bash scripts/build-static.sh                        # build estático + HTML pre-renderizado (SEO)
bash scripts/deploy-pages.sh                        # publica a gh-pages → grupoproinnova.com
git push origin main                                # el fuente va aparte del deploy
```

No levantes servidores de desarrollo para revisar: compila el build estático y sírvelo
(`npx vite preview --config vite.config.static.ts --port 4185`).

## Verificación — obligatoria antes de decir que algo funciona

El hero es WebGL. **Verificar solo con render por software miente.** El 2026-09-19 la escena se veía
perfecta en SwiftShader y era una **pantalla negra** en su Intel UHD (MSAA + bloom mipmap = frame
vacío en ANGLE-D3D11). Por eso:

```bash
cd ../proinnova-web          # ahí está playwright instalado
FRACS=0,0.6,1 node scripts/shoot-gpu.mjs <url> <dirSalida> <prefijo>   # GPU real (--use-angle=d3d11)
node scripts/perf-gpu.mjs <url>                                        # fps en GPU real
IDS=quienes-somos,valores,servicios,metodologia,casos,contacto \
  node scripts/shoot-sections.mjs <url> <dirSalida> <prefijo> [w] [h]  # secciones
```

Reglas: cualquier cambio al 3D se valida con `shoot-gpu.mjs` **y** se mira la captura. El panel
Browser de la app no compone WebGL (`document.hidden`), no sirve para esto.

## Hero 3D

- `buildTimeline.ts` es la **única fuente** de la historia del scroll (estructura → fachada → luces →
  entrega). El overlay HTML y la escena leen de ahí: cambia tiempos ahí, nunca en dos lados.
- `BuildingScene.tsx`: cielo por shader, ciudad, volcanes, grúa, losas que baja la grúa, fachada de
  vidrio. Cada ventana tiene su propio umbral de encendido horneado en una textura (`uOrder`) que el
  shader compara contra `uLit` → los pisos se encienden cuarto por cuarto.
- **No vuelvas a poner `multisampling` > 0 en el EffectComposer.** El anti-aliasing es `<SMAA />`.
- **Parpadeo negro (2026-09-24):** un solo píxel NaN se vuelve un cuadro entero negro porque el bloom lo
  esparce. En ANGLE-D3D11 `pow()` de base negativa da NaN: en todo shader propio usa
  `pow(max(x, 0.0), n)` / `clamp`. Tras tocar shaders o efectos corre
  `SCROLL=1 node scripts/count-black-frames.mjs <url> 16` (en `../proinnova-web`, guarda cuadros en
  `%TEMP%/flick`) y cuenta cuadros negros: debe dar 0.
- `detectGpuTier()` baja resolución y sombras en GPU integrada. Si tocas calidad, re-mide con
  `perf-gpu.mjs` (objetivo: ≥ 45 fps en la Intel UHD).
- Él rechazó el hero con foto borrosa y el modelo que solo giraba. **Mantén el atardecer 3D.**

## Marca

- Logo vectorial en `Logo.tsx`, **apilado** (marca arriba, `PRO INNOVA` debajo). Al lado, el
  pilarcito y su remate se leen como letras y se comen el ícono — él lo reportó. No lo cambies.
- Paleta: carbón `#3A3A38`, arena `#B5A180`, gris `#898A84`. Tokens `--pi-*` en `src/styles.css`
  (`--pi-tan`, `--pi-accent`, `--pi-logo-*`). No vuelvas al dorado.
- Tipos: Bebas Neue (títulos), Source Sans 3 (texto), Jost (wordmark).
- `CONTACT` en `site.ts` es la única verdad de contacto. El correo real es `contacto@grupoproinnova.com`.
  **WhatsApp = segundo número (+502 4214 1321)**, pedido por él; botón flotante en todas las páginas
  (`WhatsAppButton`), en contacto y en el footer, con mensaje prellenado por página.
- Eslogan del hero: **"La obra no se apaga."** (lo eligió él el 2026-09-23).

## SEO y páginas

- Sitio **multipágina pre-renderizado**: `/`, `/servicios/`, 8 páginas `/servicios/<slug>/` y `404.html`.
  `scripts/prerender.mjs` (dentro de `build-static.sh`) escribe un HTML por página con su `<head>`
  propio y el cuerpo ya renderizado; el cliente hidrata el componente que indica `<body data-page>`.
  Todo componente debe ser SSR-safe: nada de `window`/`document` fuera de efectos.
- **Contenido de servicios: `services.ts`** (textos, fotos, FAQ, relacionados). **Head/JSON-LD: `seo.ts`**
  (GeneralContractor, Service, BreadcrumbList, FAQPage). El sitemap se genera solo desde `seo.ts`.
  Regla del contenido: nada de precios, clientes, años ni certificaciones que la empresa no haya dicho.
- Piezas compartidas: `PageShell` (scroll, cursor, nav, footer), `SiteNav`, `SiteFooter` (enlaza a todos
  los servicios), `ContactBand`, `ReachStats`, `PageHero`.
- **Anti-parpadeo**: el HTML trae el texto visible, así que lo que anima GSAP (`[data-split]`,
  `[data-reveal]`, intro del hero) arranca oculto con `html.js` y cada componente lo destapa al montar su
  tween; si el JS no carga, se muestra a los 2.5 s. Si agregas animaciones de entrada, respeta eso.
- El H1 lleva la palabra clave (eyebrow dentro del H1). Fotos en `.webp`; los `.jpg` quedan para og:image.
- Verificación: `../proinnova-web/scripts/qa-pages.mjs` recorre todas las páginas (desktop + móvil): errores de
  hidratación, imágenes rotas, desbordes, enlaces internos. `scripts/shoot-page-sections.mjs <ruta> <prefijo>` captura por sección
  (en Git Bash usa `MSYS_NO_PATHCONV=1`).

## Estructura de la página (orden pedido por él)

Hero → marquesina fija (no rota) → cifras (+50 proyectos, +8 en simultáneo) → **1 Quiénes somos** (texto justificado + cita "Creamos valor") → **2 Valores** →
**3 Servicios** (incluye "Nuestra especialidad") → **4 Casos de éxito** (incluye clientes) →
**5 Contacto** → footer. Metodología se quitó a pedido suyo (la explica al licitar): no la regreses. El menú refleja ese orden.
Si agregas algo, encájalo en una de esas cinco; no crees secciones sueltas (las páginas de servicio
son páginas aparte, no secciones de la portada).

## Infraestructura

- GitHub Pages sirve `gh-pages` (con CNAME). DNS en Hostinger vía MCP. **No toques los registros de
  correo**: hay 3 buzones y el alias `contacto@` funcionando. En `@` hay dos TXT: el SPF del correo y
  `google-site-verification=…` (verifica Search Console, propiedad de dominio en gabogalvez2906@gmail.com).
  **No borres ninguno**; al agregar TXT usa `overwrite=false`.
- IndexNow (Bing y otros): llave `public/c6c3ed75743f0a4b2c21947ae95dc684.txt`. Tras publicar páginas nuevas,
  envía el sitemap a `https://api.indexnow.org/indexnow` y en Search Console pide indexación de las nuevas.
- Lovable está en plan gratis (sin dominio propio) y Hostinger no tiene plan de hosting. Por eso
  Pages. No propongas migrar sin que él lo pida.

## Cómo trabajar aquí (ahorra créditos)

- El contexto ya está en este archivo y en la memoria del proyecto: **no re-explores el repo** ni
  releas `BuildingScene.tsx` entero para un cambio puntual — usa grep sobre lo que vas a tocar.
- **No lances subagentes** salvo que él lo pida.
- Trabaja directo: edita, `tsc --noEmit`, build, captura, deploy. Un ciclo, no exploración previa.
- Las fotos de obra están en `src/assets/obra/` con nombres descriptivos ya verificados uno por uno.
  16 imágenes del PDF original son capas negras: nunca nombres archivos por posición en un contact
  sheet, ya se enviaron tiles negros a producción por eso.
- Skills instaladas y útiles aquí: `gsap-scrolltrigger`, `threejs-webgl`, `react-three-fiber`,
  `3d-frontend` (su `references/PATTERNS.md` tiene god rays, conos volumétricos, parallax),
  `modern-web-design`.
