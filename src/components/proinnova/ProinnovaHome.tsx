import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Cursor from "./Cursor";
import SmoothScroll from "./SmoothScroll";
import Logo from "./Logo";
import HeroBuild from "./HeroBuild";
import MagneticButton from "./MagneticButton";
import Marquee from "./Marquee";
import ScrollReveal from "./ScrollReveal";
import ServicesInteractive from "./ServicesInteractive";
import ProcessTimeline from "./ProcessTimeline";
import ProjectsGallery from "./ProjectsGallery";
import { CONTACT, telHref } from "./site";

import ingenierosPlanos from "../../assets/obra/ingenieros-revisando-planos.jpg";
import estructuraConcreto from "../../assets/obra/estructura-concreto-multinivel.jpg";
import movimientoTierra from "../../assets/obra/movimiento-de-tierra.jpg";
import oficinaRemodelacion from "../../assets/obra/oficina-remodelacion-tablayeso.jpg";
import recepcionCorporativa from "../../assets/obra/recepcion-corporativa.jpg";
import logoElValle from "../../assets/obra/logo-centro-educativo-el-valle.jpg";
import logoPremium from "../../assets/obra/logo-premium-restaurants.jpg";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  { n: "01", title: "Calidad", desc: "Materiales certificados y mano de obra calificada." },
  { n: "02", title: "Cumplimiento", desc: "Cronogramas realistas que sí se cumplen." },
  { n: "03", title: "Innovación", desc: "Procesos constructivos actualizados y eficientes." },
  { n: "04", title: "Transparencia", desc: "Presupuesto desglosado, sin costos ocultos." },
  { n: "05", title: "Seguridad", desc: "Protocolos de seguridad industrial en cada obra." },
  { n: "06", title: "Acompañamiento", desc: "Un interlocutor directo de la idea a la entrega." },
];

const especialidades = [
  {
    n: "01",
    title: "Contratista general",
    desc: "Coordinamos toda la obra bajo un solo responsable, de principio a fin.",
    img: estructuraConcreto,
  },
  {
    n: "02",
    title: "Obra civil",
    desc: "Movimiento de tierras, cimentaciones e infraestructura que perdura.",
    img: movimientoTierra,
  },
  {
    n: "03",
    title: "Remodelaciones",
    desc: "Transformamos espacios existentes en entornos modernos y funcionales.",
    img: oficinaRemodelacion,
  },
  {
    n: "04",
    title: "Acabados",
    desc: "Superficies, detalles y terminaciones de alta gama que definen la calidad.",
    img: recepcionCorporativa,
  },
];

const certeza = [
  { n: "01", title: "Presupuesto desglosado", desc: "Cada costo y cada actividad, a la vista." },
  { n: "02", title: "Alcance definido", desc: "Lo que entra y lo que no, por escrito." },
  { n: "03", title: "Planificación a su medida", desc: "Adaptada a sus recursos y tiempos." },
  { n: "04", title: "Un solo interlocutor", desc: "Atención directa durante todo el proyecto." },
];

const alcance = [
  { title: "Idea", desc: "Damos forma al concepto y validamos qué es posible en su terreno." },
  { title: "Prefactibilidad", desc: "Costos estimados, tramitología y control de calidad." },
  { title: "Diseño", desc: "Arquitectura, estructuras, hidráulica, eléctrica y climatización integradas." },
  { title: "Ejecución", desc: "Obra completa con supervisión técnica." },
];

export default function ProinnovaHome() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Web fonts and lazy images change page height after first layout, which
      // would leave every pinned section's scroll range stale.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready?.then(refresh);
      window.addEventListener("load", refresh);
      const pendingImages = Array.from(document.images).filter((img) => !img.complete);
      let pending = pendingImages.length;
      if (pending === 0) refresh();
      pendingImages.forEach((img) =>
        img.addEventListener(
          "load",
          () => {
            pending -= 1;
            if (pending === 0) refresh();
          },
          { once: true },
        ),
      );

      return () => window.removeEventListener("load", refresh);
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <SmoothScroll />
      <Cursor />

      <header className="nav">
        <div className="nav__inner">
          <a className="nav__logo" href="#inicio" aria-label="Proinnova, ir al inicio">
            <Logo />
          </a>
          <nav className="nav__links" aria-label="Principal">
            <a href="#servicios">Servicios</a>
            <a href="#proceso">Proceso</a>
            <a href="#proyectos">Proyectos</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <MagneticButton href="#contacto" variant="outline" className="nav__cta">
            Hablemos
          </MagneticButton>
        </div>
      </header>

      <main>
        <HeroBuild />

        <Marquee items={["Innovación", "Calidad", "Confianza", "Excelencia"]} />

        <section className="split" id="quienes-somos">
          <div className="split__media">
            <img src={ingenierosPlanos} alt="Ingenieros de Proinnova revisando planos en obra" loading="lazy" />
          </div>
          <div className="split__content">
            <ScrollReveal>
              <span className="eyebrow">Quiénes somos</span>
              <h2>Somos la constructora que entrega lo que promete.</h2>
              <p>
                Un solo equipo responsable de diseño, obra y acabados en Guatemala. Un estándar,
                una fecha, cero excusas.
              </p>
              <p>
                Diseñamos espacios funcionales, modernos y duraderos que hacen crecer a nuestros
                clientes. Cada diseño integra estructuras, instalaciones hidrosanitarias,
                eléctricas y climatización desde el primer plano — garantizando estética y
                eficiencia, sin cambios costosos en obra.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="statement">
          <ScrollReveal className="statement__inner">
            <h2>
              No vendemos únicamente construcción.
              <br />
              <span className="statement__accent">Creamos valor.</span>
            </h2>
          </ScrollReveal>
        </section>

        <section className="section" id="por-que">
          <ScrollReveal>
            <span className="eyebrow">Por qué Proinnova</span>
            <h2>Lo que nos define</h2>
          </ScrollReveal>
          <ScrollReveal stagger className="pillars">
            {pillars.map((p) => (
              <div className="pillar" key={p.n}>
                <span className="pillar__num">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <section className="section section--dark" id="especialidad">
          <ScrollReveal>
            <span className="eyebrow eyebrow--light">Nuestra especialidad</span>
            <h2 className="on-dark">Donde entregamos más valor</h2>
          </ScrollReveal>
          <ScrollReveal stagger className="especialidad-grid">
            {especialidades.map((e) => (
              <div className="especialidad-card" key={e.n}>
                <img src={e.img} alt="" loading="lazy" />
                <div className="especialidad-card__overlay" />
                <div className="especialidad-card__content">
                  <span className="pillar__num">{e.n}</span>
                  <h3 className="on-dark">{e.title}</h3>
                  <p className="on-dark-soft">{e.desc}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <ServicesInteractive />

        <ProcessTimeline />

        <section className="section" id="certeza">
          <div className="certeza">
            <ScrollReveal className="certeza__intro">
              <span className="eyebrow">Certeza</span>
              <h2>Construir no debería ser una apuesta.</h2>
              <p>
                La incertidumbre en costos, plazos y calidad es el mayor riesgo de cualquier obra.
                Nuestro trabajo es eliminarla antes de que empiece la construcción.
              </p>
            </ScrollReveal>
            <ScrollReveal stagger className="certeza__list">
              {certeza.map((c) => (
                <div className="certeza__item" key={c.n}>
                  <span className="pillar__num">{c.n}</span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section className="section section--dark" id="alcance">
          <ScrollReveal>
            <span className="eyebrow eyebrow--light">Alcance</span>
            <h2 className="on-dark">Entramos en cualquier fase</h2>
            <p className="on-dark-soft alcance__lead">
              Desde una idea en servilleta hasta una obra que ya está en marcha. Usted decide dónde
              empieza nuestra participación.
            </p>
          </ScrollReveal>
          <ScrollReveal stagger className="alcance">
            {alcance.map((a, i) => (
              <div className="alcance__item" key={a.title}>
                <span className="alcance__index">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="on-dark">{a.title}</h3>
                <p className="on-dark-soft">{a.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </section>

        <ProjectsGallery />

        <section className="section section--tight" id="clientes">
          <ScrollReveal>
            <span className="eyebrow">Clientes</span>
            <h2>Empresas que confían en nosotros</h2>
          </ScrollReveal>
          <ScrollReveal stagger className="clients">
            <img src={logoElValle} alt="Centro Educativo El Valle" loading="lazy" />
            <img src={logoPremium} alt="Premium Restaurants of America" loading="lazy" />
          </ScrollReveal>
        </section>

        <section className="statement statement--compromiso">
          <ScrollReveal className="statement__inner">
            <span className="eyebrow">Nuestro compromiso</span>
            <h2>
              Construimos relaciones de largo plazo a través de proyectos ejecutados con calidad,
              responsabilidad y excelencia.
            </h2>
          </ScrollReveal>
        </section>

        <section className="cta-final" id="contacto">
          <div className="cta-final__inner">
            <ScrollReveal>
              <h2>
                Construyamos juntos
                <br />
                tu próximo proyecto.
              </h2>
              <MagneticButton href={`mailto:${CONTACT.email}`} className="cta-final__btn">
                Escríbenos
              </MagneticButton>
            </ScrollReveal>

            <ScrollReveal stagger className="cta-final__info">
              <div>
                <span className="eyebrow eyebrow--light">Teléfono</span>
                {CONTACT.phones.map((phone) => (
                  <a key={phone} href={telHref(phone)}>
                    {phone}
                  </a>
                ))}
              </div>
              <div>
                <span className="eyebrow eyebrow--light">Correo</span>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </div>
              <div>
                <span className="eyebrow eyebrow--light">Sitio web</span>
                <p>{CONTACT.website}</p>
              </div>
              <div>
                <span className="eyebrow eyebrow--light">Ubicación</span>
                <p>{CONTACT.location}</p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>PROINNOVA · Construcción e Innovación</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
