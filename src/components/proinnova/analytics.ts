/**
 * Google Analytics 4, client only (static-site/main.tsx calls it after hydration).
 *
 * Answers the question Gabo asked on 2026-11-23: where does each contact come from?
 * Every click on WhatsApp, phone or email sends one event with the page and the block it
 * came from, plus the visit's source (Google, Bing, Instagram, direct…) that GA4 records
 * on its own. Mark the three events as key events in GA4 (Administrar → Eventos clave).
 *
 * Loads only on the real domain, so previews and local builds never count as visits.
 * The CSP in static-site/index.html allows googletagmanager.com and google-analytics.com.
 */
import { GA_ID } from "./site";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const CONTACT_EVENTS: { prefix: string; event: string }[] = [
  { prefix: "https://wa.me/", event: "contacto_whatsapp" },
  { prefix: "tel:", event: "contacto_llamada" },
  { prefix: "mailto:", event: "contacto_correo" },
];

/** Which block of the page the click came from: floating button, footer, a section… */
function blockOf(el: Element): string {
  if (el.closest(".wa-float")) return "boton-flotante";
  if (el.closest("footer")) return "pie";
  if (el.closest("nav, header")) return "menu";
  const section = el.closest("section[id], section[class], div[id]");
  return section?.id || section?.classList[0] || "pagina";
}

export function initAnalytics() {
  if (!GA_ID || window.location.hostname !== "grupoproinnova.com") return;

  window.dataLayer = window.dataLayer || [];
  // gtag must push the `arguments` object itself, not an array (that is how gtag.js reads it).
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const link = target?.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const match = CONTACT_EVENTS.find((c) => href.startsWith(c.prefix));
      if (!match) return;
      window.gtag("event", match.event, {
        pagina: window.location.pathname,
        servicio: document.body.dataset["page"] ?? "home",
        bloque: blockOf(link),
      });
    },
    { capture: true },
  );
}
