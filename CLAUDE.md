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
npx vite build --config vite.config.static.ts       # build estático (~1s)
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

## Estructura de la página (orden pedido por él)

Hero → marquesina → **1 Quiénes somos** (texto justificado + cita "Creamos valor") → **2 Valores** →
**3 Servicios** (incluye "Nuestra especialidad") → **4 Metodología** (6 pasos horizontales + fases +
certeza) → **5 Casos de éxito** (incluye clientes) → **6 Contacto** → footer. El menú refleja ese orden.
Si agregas algo, encájalo en una de esas seis; no crees secciones sueltas.

## Infraestructura

- GitHub Pages sirve `gh-pages` (con CNAME). DNS en Hostinger vía MCP. **No toques los registros de
  correo**: hay 3 buzones y el alias `contacto@` funcionando.
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
