/**
 * Per-page <head> for the pre-rendered static site: title, description, canonical,
 * Open Graph and JSON-LD. Used only at build time (static-site/entry-server.tsx).
 */
import { CONTACT, SITE_URL } from "./site";
import { HUB, SERVICES, servicePath, type Service } from "./services";

export const HOME_TITLE = "Constructora en Guatemala | Grupo Proinnova";
export const HOME_DESCRIPTION =
  "Grupo Proinnova, constructora en Guatemala: construcción comercial e industrial, obra civil, estructuras metálicas, remodelaciones y acabados. Cotice su obra.";

export interface PageMeta {
  /** Matches `data-page` on <body>, which tells the client what to hydrate. */
  id: string;
  path: string;
  title: string;
  description: string;
  image: string;
  /** Hero image to preload (the page's largest paint). */
  preload?: string;
  jsonLd: object;
  noindex?: boolean;
}

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

const ORG_ID = `${SITE_URL}/#empresa`;

const organization = {
  "@type": "GeneralContractor",
  "@id": ORG_ID,
  name: "Grupo Proinnova",
  alternateName: "Proinnova",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.svg`,
  image: `${SITE_URL}/og-image.jpg`,
  description: HOME_DESCRIPTION,
  telephone: CONTACT.phones[0],
  email: CONTACT.email,
  address: { "@type": "PostalAddress", addressLocality: "Ciudad de Guatemala", addressCountry: "GT" },
  areaServed: { "@type": "Country", name: "Guatemala" },
  knowsLanguage: "es",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de construcción",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: abs(servicePath(s.slug)) },
    })),
  },
};

const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

function serviceMeta(s: Service): PageMeta {
  const url = abs(servicePath(s.slug));
  return {
    id: `servicio:${s.slug}`,
    path: servicePath(s.slug),
    title: s.seoTitle,
    description: s.seoDescription,
    image: abs(s.heroJpg),
    preload: s.hero.src,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        organization,
        {
          "@type": "Service",
          "@id": `${url}#servicio`,
          name: s.h1,
          serviceType: s.name,
          description: s.seoDescription,
          url,
          image: abs(s.heroJpg),
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "Country", name: "Guatemala" },
        },
        breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios/" },
          { name: s.name, path: servicePath(s.slug) },
        ]),
        {
          "@type": "FAQPage",
          mainEntity: s.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ],
    },
  };
}

export function pageMetas(): PageMeta[] {
  return [
    {
      id: "home",
      path: "/",
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      image: `${SITE_URL}/og-image.jpg`,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          organization,
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#sitio`,
            url: `${SITE_URL}/`,
            name: "Grupo Proinnova",
            inLanguage: "es-GT",
            publisher: { "@id": ORG_ID },
          },
        ],
      },
    },
    {
      id: "servicios",
      path: "/servicios/",
      title: HUB.seoTitle,
      description: HUB.seoDescription,
      image: abs(HUB.heroJpg),
      preload: HUB.hero.src,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          organization,
          {
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/servicios/#pagina`,
            url: `${SITE_URL}/servicios/`,
            name: HUB.h1,
            description: HUB.seoDescription,
            isPartOf: { "@id": `${SITE_URL}/#sitio` },
            about: { "@id": ORG_ID },
          },
          breadcrumbs([
            { name: "Inicio", path: "/" },
            { name: "Servicios", path: "/servicios/" },
          ]),
        ],
      },
    },
    ...SERVICES.map(serviceMeta),
    {
      id: "404",
      path: "/404.html",
      title: "Página no encontrada | Grupo Proinnova",
      description: HOME_DESCRIPTION,
      image: `${SITE_URL}/og-image.jpg`,
      jsonLd: { "@context": "https://schema.org", "@graph": [organization] },
      noindex: true,
    },
  ];
}

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The block that replaces `<!--seo-->…<!--/seo-->` in the built index.html. */
export function headHtml(m: PageMeta): string {
  const url = abs(m.path);
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    m.noindex
      ? `<meta name="robots" content="noindex, follow" />`
      : `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    m.noindex ? "" : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="Grupo Proinnova" />`,
    `<meta property="og:locale" content="es_GT" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${esc(m.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    m.preload ? `<link rel="preload" as="image" href="${esc(m.preload)}" fetchpriority="high" />` : "",
    // `</` inside JSON would close the script tag early.
    `<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.filter(Boolean).join("\n    ");
}
