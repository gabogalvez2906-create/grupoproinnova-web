import { createFileRoute } from "@tanstack/react-router";

import ProinnovaHome from "../components/proinnova/ProinnovaHome";
import heroImg from "../assets/obra/hero-proinnova.jpg";

const TITLE = "Constructora en Guatemala | Grupo Proinnova";
const DESCRIPTION =
  "Grupo Proinnova, constructora en Guatemala: construcción comercial e industrial, obra civil, estructuras metálicas, remodelaciones y acabados. Cotice su obra.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProinnovaHome,
});
