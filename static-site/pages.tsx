// Which component each pre-rendered page hydrates. The id comes from
// <body data-page="…">, written by scripts/prerender.mjs from seo.ts.
import ProinnovaHome from "../src/components/proinnova/ProinnovaHome";
import ServicesHub from "../src/components/proinnova/ServicesHub";
import ServicePage from "../src/components/proinnova/ServicePage";
import NotFound from "../src/components/proinnova/NotFound";

export function PageById({ id }: { id: string }) {
  if (id === "servicios") return <ServicesHub />;
  if (id.startsWith("servicio:")) return <ServicePage slug={id.slice("servicio:".length)} />;
  if (id === "404") return <NotFound />;
  return <ProinnovaHome />;
}
