import { createFileRoute } from "@tanstack/react-router";

import ProinnovaHome from "../components/proinnova/ProinnovaHome";
import heroImg from "../assets/obra/hero-proinnova.jpg";

const TITLE = "Proinnova · Construcción e Innovación en Guatemala";
const DESCRIPTION =
  "Constructora en Guatemala: diseño, obra civil, estructuras metálicas, remodelaciones y acabados de alta gama bajo un solo responsable.";

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
