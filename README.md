# Proinnova · grupoproinnova.com

Sitio web de Proinnova, constructora en Guatemala.

## Estructura

- `src/components/proinnova/` — secciones del sitio (hero 3D que se construye con el scroll, servicios, proceso, galería, contacto).
- `src/components/proinnova/site.ts` — datos de contacto y número de niveles del edificio.
- `src/assets/obra/` — fotos de obra extraídas del perfil corporativo.
- `src/styles.css` — tokens de marca (dorado Proinnova) y estilos.

## Dos formas de compilar

| Uso | Comando | Salida |
| --- | --- | --- |
| Lovable (TanStack Start, render en servidor) | `bun run build` | `.output/` |
| Sitio estático para GitHub Pages | `npx vite build --config vite.config.static.ts` | `dist-static/` |

Ambas usan los mismos componentes, estilos e imágenes.

## Publicación actual

`grupoproinnova.com` se sirve desde GitHub Pages (rama `gh-pages`). El DNS está en Hostinger:
registros `A`/`AAAA` de la raíz hacia GitHub Pages y `www` como `CNAME`. Los registros de correo
(MX, SPF, DKIM, DMARC) no se tocan.
