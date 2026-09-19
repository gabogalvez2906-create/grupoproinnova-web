import ScrollReveal from "./ScrollReveal";

import edificioComercial from "../../assets/obra/edificio-comercial-obra-gris.jpg";
import showroomAutomotriz from "../../assets/obra/showroom-automotriz.jpg";
import naveIndustrial from "../../assets/obra/nave-industrial-tragaluces.jpg";
import plantaIndustrial from "../../assets/obra/planta-industrial.jpg";
import pizzaHut from "../../assets/obra/pizza-hut-fachada.jpg";
import bodegaIndustrial from "../../assets/obra/bodega-industrial-montacargas.jpg";
import oficinaLounge from "../../assets/obra/oficina-lounge.jpg";
import edificioAndamios from "../../assets/obra/edificio-andamios-malla.jpg";
import estructuraConcreto from "../../assets/obra/estructura-concreto-multinivel.jpg";
import interiorObraGris from "../../assets/obra/interior-obra-gris-atardecer.jpg";
import logoElValle from "../../assets/obra/logo-centro-educativo-el-valle.jpg";
import logoPremium from "../../assets/obra/logo-premium-restaurants.jpg";

// Captions describe what each catalog photo shows; swap in real project names when available.
const projects = [
  { img: edificioComercial, title: "Edificio comercial en obra gris", tag: "Construcción", span: "tall" },
  { img: showroomAutomotriz, title: "Showroom automotriz", tag: "Acabados", span: "wide" },
  { img: naveIndustrial, title: "Nave industrial", tag: "Estructuras metálicas", span: "" },
  { img: plantaIndustrial, title: "Planta industrial", tag: "Construcción", span: "" },
  { img: pizzaHut, title: "Restaurante Pizza Hut", tag: "Construcción", span: "tall" },
  { img: bodegaIndustrial, title: "Bodega industrial", tag: "Obra civil", span: "" },
  { img: oficinaLounge, title: "Oficinas corporativas", tag: "Acabados", span: "wide" },
  { img: edificioAndamios, title: "Edificio en ejecución", tag: "Project management", span: "" },
  { img: estructuraConcreto, title: "Estructura de concreto", tag: "Obra civil", span: "" },
  { img: interiorObraGris, title: "Interiores en obra gris", tag: "Construcción", span: "" },
];

export default function ProjectsGallery() {
  return (
    <section className="gallery" id="casos">
      <div className="gallery__heading">
        <ScrollReveal>
          <span className="eyebrow">Casos de éxito</span>
          <h2>De la estructura al detalle</h2>
        </ScrollReveal>
      </div>

      <ScrollReveal stagger className="gallery__grid">
        {projects.map((p) => (
          <figure className={`gallery__item ${p.span}`} key={p.title} tabIndex={0}>
            <img src={p.img} alt={p.title} loading="lazy" />
            <figcaption>
              <span className="gallery__tag">{p.tag}</span>
              <span className="gallery__title">{p.title}</span>
            </figcaption>
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
