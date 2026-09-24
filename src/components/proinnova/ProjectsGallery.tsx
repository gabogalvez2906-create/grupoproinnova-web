import ScrollReveal from "./ScrollReveal";
import { servicePath } from "./services";

import edificioComercial from "../../assets/obra/edificio-comercial-obra-gris.webp";
import showroomAutomotriz from "../../assets/obra/showroom-automotriz.webp";
import naveIndustrial from "../../assets/obra/nave-industrial-tragaluces.webp";
import plantaIndustrial from "../../assets/obra/planta-industrial.webp";
import pizzaHut from "../../assets/obra/pizza-hut-fachada.webp";
import bodegaIndustrial from "../../assets/obra/bodega-industrial-montacargas.webp";
import oficinaLounge from "../../assets/obra/oficina-lounge.webp";
import edificioAndamios from "../../assets/obra/edificio-andamios-malla.webp";
import estructuraConcreto from "../../assets/obra/estructura-concreto-multinivel.webp";
import interiorObraGris from "../../assets/obra/interior-obra-gris-atardecer.webp";
import logoElValle from "../../assets/obra/logo-centro-educativo-el-valle.webp";
import logoPremium from "../../assets/obra/logo-premium-restaurants.webp";

// Captions describe what each catalog photo shows; swap in real project names when available.
const projects = [
  { img: edificioComercial, title: "Edificio comercial en obra gris", page: "locales-comerciales", tag: "Construcción", span: "tall" },
  { img: showroomAutomotriz, title: "Showroom automotriz", page: "locales-comerciales", tag: "Acabados", span: "wide" },
  { img: naveIndustrial, title: "Nave industrial", page: "naves-industriales", tag: "Estructuras metálicas", span: "" },
  { img: plantaIndustrial, title: "Planta industrial", page: "naves-industriales", tag: "Construcción", span: "" },
  { img: pizzaHut, title: "Restaurante Pizza Hut", page: "locales-comerciales", tag: "Construcción", span: "tall" },
  { img: bodegaIndustrial, title: "Bodega industrial", page: "naves-industriales", tag: "Obra civil", span: "" },
  { img: oficinaLounge, title: "Oficinas corporativas", page: "remodelaciones", tag: "Acabados", span: "wide" },
  { img: edificioAndamios, title: "Edificio en ejecución", page: "construccion-de-edificios", tag: "Project management", span: "" },
  { img: estructuraConcreto, title: "Estructura de concreto", page: "construccion-de-edificios", tag: "Obra civil", span: "" },
  { img: interiorObraGris, title: "Interiores en obra gris", page: "construccion-de-edificios", tag: "Construcción", span: "" },
];

export default function ProjectsGallery() {
  return (
    <section className="gallery" id="casos">
      <div className="gallery__heading">
        <ScrollReveal>
          <span className="eyebrow">Casos de éxito · Proyectos en Guatemala</span>
          <h2 data-split>De la estructura al detalle</h2>
        </ScrollReveal>
      </div>

      <ScrollReveal stagger className="gallery__grid">
        {projects.map((p) => (
          <figure className={`gallery__item ${p.span}`} key={p.title}>
            <a href={servicePath(p.page)} className="gallery__link" data-cursor="interactive">
              <img src={p.img} alt={p.title} loading="lazy" data-parallax />
              <figcaption>
                <span className="gallery__tag">{p.tag}</span>
                <span className="gallery__title">{p.title}</span>
              </figcaption>
            </a>
          </figure>
        ))}
      </ScrollReveal>

      <div className="casos__clients">
        <ScrollReveal>
          <span className="eyebrow">Clientes</span>
        </ScrollReveal>
        <ScrollReveal stagger className="clients">
          <img src={logoElValle} alt="Centro Educativo El Valle" loading="lazy" />
          <img src={logoPremium} alt="Premium Restaurants of America" loading="lazy" />
        </ScrollReveal>
      </div>
    </section>
  );
}
