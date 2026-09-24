import { useState } from "react";

import PageShell from "./PageShell";
import HeroBuild from "./HeroBuild";
import Marquee from "./Marquee";
import ReachStats from "./ReachStats";
import ScrollReveal from "./ScrollReveal";
import ServicesInteractive from "./ServicesInteractive";
import ProjectsGallery from "./ProjectsGallery";
import ContactBand from "./ContactBand";

import ingenierosPlanos from "../../assets/obra/ingenieros-revisando-planos.webp";

const pillars = [
  { n: "01", title: "Calidad", desc: "Materiales certificados y mano de obra calificada." },
  { n: "02", title: "Cumplimiento", desc: "Cronogramas realistas que sí se cumplen." },
  { n: "03", title: "Innovación", desc: "Procesos constructivos actualizados y eficientes." },
  { n: "04", title: "Transparencia", desc: "Presupuesto desglosado, sin costos ocultos." },
  { n: "05", title: "Seguridad", desc: "Protocolos de seguridad industrial en cada obra." },
  { n: "06", title: "Acompañamiento", desc: "Un interlocutor directo de la idea a la entrega." },
];

export default function ProinnovaHome() {
  const [overHero, setOverHero] = useState(true);

  return (
    <PageShell overHero={overHero} home>
      <HeroBuild onOverHeroChange={setOverHero} />

      <Marquee items={["Innovación", "Calidad", "Confianza", "Excelencia", "Obra civil", "Acabados"]} />

      <ReachStats />

      {/* 1 · Quiénes somos */}
      <section className="about" id="quienes-somos">
        <div className="about__media" data-zoom-reveal>
          <img
            src={ingenierosPlanos}
            alt="Ingenieros de Proinnova revisando planos en obra"
            loading="lazy"
            data-parallax
          />
        </div>
        <div className="about__content">
          <ScrollReveal>
            <span className="eyebrow">Quiénes somos</span>
            <h2 data-split>Somos la constructora que entrega lo que promete.</h2>
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
            <blockquote className="about__quote">
              No vendemos únicamente construcción. <span>Creamos valor.</span>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* 2 · Valores */}
      <section className="values" id="valores">
        <div className="values__inner">
          <span className="eyebrow eyebrow--light">Valores</span>
          <h2 data-split>Lo que nos define</h2>
          <ScrollReveal stagger className="pillars">
            {pillars.map((p) => (
              <div className="pillar" key={p.n} data-spot>
                <span className="pillar__num">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* 3 · Servicios (incluye Nuestra especialidad) */}
      <ServicesInteractive />

      {/* 4 · Casos de éxito (incluye clientes) */}
      <ProjectsGallery />

      {/* 5 · Contacto */}
      <ContactBand subject="Contacto desde grupoproinnova.com" />
    </PageShell>
  );
}
