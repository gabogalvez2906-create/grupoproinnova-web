import { useState } from "react";

import ScrollReveal from "./ScrollReveal";
import Tilt from "./Tilt";
import { servicePath } from "./services";
import { waHref } from "./site";

import showroomSala from "../../assets/obra/showroom-sala-clientes.webp";
import torreResidencial from "../../assets/obra/torre-residencial.webp";
import excavadora from "../../assets/obra/excavadora-terreno.webp";
import residencia from "../../assets/obra/residencia-fachada-madera.webp";
import oficinaLounge from "../../assets/obra/oficina-lounge.webp";
import estructuraMetalica from "../../assets/obra/estructura-metalica.webp";
import muroGaviones from "../../assets/obra/muro-gaviones.webp";
import oficinaIluminacion from "../../assets/obra/oficina-iluminacion.webp";
import movimientoTierra from "../../assets/obra/movimiento-de-tierra.webp";
import obrerosColado from "../../assets/obra/obreros-colado-losa.webp";
import bodegaMontacargas from "../../assets/obra/bodega-industrial-montacargas.webp";
import estructuraConcreto from "../../assets/obra/estructura-concreto-multinivel.webp";
import oficinaRemodelacion from "../../assets/obra/oficina-remodelacion-tablayeso.webp";
import recepcionCorporativa from "../../assets/obra/recepcion-corporativa.webp";

const services = [
  { page: "remodelaciones", n: "01", title: "Remodelaciones", desc: "Renovación de espacios", img: showroomSala },
  { page: "construccion-de-edificios", n: "02", title: "Construcción", desc: "Obra nueva llave en mano", img: torreResidencial },
  { page: "obra-civil", n: "03", title: "Obra Civil", desc: "Tierras e infraestructura", img: excavadora },
  { page: "diseno-arquitectonico", n: "04", title: "Diseño Arquitectónico", desc: "Planos y permisos", img: residencia },
  { page: "acabados", n: "05", title: "Acabados", desc: "Pisos, muros y detalles", img: oficinaLounge },
  { page: "estructuras-metalicas", n: "06", title: "Estructuras Metálicas", desc: "Fabricación y montaje", img: estructuraMetalica },
  { page: "instalaciones", n: "07", title: "Instalaciones Hidrosanitarias", desc: "Agua potable y drenajes", img: muroGaviones },
  { page: "instalaciones", n: "08", title: "Instalaciones Eléctricas", desc: "Baja y media tensión", img: oficinaIluminacion },
  { page: "obra-civil", n: "09", title: "Movimientos de Tierra", desc: "Corte, relleno y nivelación", img: movimientoTierra },
  { page: "construccion-de-edificios", n: "10", title: "Project Management", desc: "Tiempo, costo y calidad", img: obrerosColado },
  { page: "tablayeso-y-cielos-falsos", n: "11", title: "Tablayeso y Cielos Falsos", desc: "Divisiones, muros y cielos", img: oficinaRemodelacion },
  { page: "construccion-de-bodegas", n: "12", title: "Construcción de Bodegas", desc: "De la terracería al piso", img: bodegaMontacargas },
];

// Lines where a whole project is handed to one team. These used to be a section
// of their own ("Nuestra especialidad") right next to this one.
const especialidades = [
  {
    n: "01",
    page: "construccion-de-edificios",
    title: "Contratista general",
    desc: "Coordinamos toda la obra bajo un solo responsable, de principio a fin.",
    img: estructuraConcreto,
    alt: "Estructura de concreto de varios niveles en construcción",
  },
  {
    n: "02",
    page: "obra-civil",
    title: "Obra civil",
    desc: "Movimiento de tierras, cimentaciones e infraestructura que perdura.",
    img: movimientoTierra,
    alt: "Maquinaria haciendo movimiento de tierras para una obra",
  },
  {
    n: "03",
    page: "remodelaciones",
    title: "Remodelaciones",
    desc: "Transformamos espacios existentes en entornos modernos y funcionales.",
    img: oficinaRemodelacion,
    alt: "Oficina remodelada con divisiones de tablayeso",
  },
  {
    n: "04",
    page: "acabados",
    title: "Acabados",
    desc: "Superficies, detalles y terminaciones de alta gama que definen la calidad.",
    img: recepcionCorporativa,
    alt: "Recepción corporativa con acabados de alta gama",
  },
];

const casas = [
  { title: "Diseño de casas.", desc: "Casas modernas a la medida del terreno, la familia y el presupuesto." },
  { title: "Planos de casas.", desc: "Arquitectura, estructura e instalaciones, listos para construir." },
  { title: "Licencia de construcción.", desc: "Preparamos la documentación y hacemos el trámite en la municipalidad." },
  { title: "Construcción llave en mano.", desc: "De la cimentación a los acabados, con presupuesto desglosado." },
];

export default function ServicesInteractive() {
  const [active, setActive] = useState(0);

  return (
    <section className="services" id="servicios">
      <div className="services__heading">
        <span className="eyebrow">Servicios de construcción</span>
        <h2 data-split>Soluciones integrales</h2>
        <a className="services__all" href="/servicios/">
          Ver todos los servicios →
        </a>
      </div>

      <div className="services__body">
        <ul className="services__list">
          {services.map((s, i) => {
            const cells = (
              <>
                <span className="services__num">{s.n}</span>
                <span className="services__title">{s.title}</span>
                <span className="services__desc">{s.desc}</span>
                {s.page && (
                  <span className="services__arrow" aria-hidden="true">
                    ↗
                  </span>
                )}
              </>
            );
            const state = `services__row ${i === active ? "is-active" : ""}`;
            return (
              <li key={s.n} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                {s.page ? (
                  <a className={state} href={servicePath(s.page)} data-cursor="interactive">
                    {cells}
                  </a>
                ) : (
                  <div className={state} tabIndex={0} data-cursor="interactive">
                    {cells}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="services__preview">
          {services.map((s, i) => (
            <img
              key={s.n}
              src={s.img}
              alt={`${s.title}: ${s.desc.toLowerCase()} por Grupo Proinnova`}
              aria-hidden={i !== active}
              loading="lazy"
              className={`services__preview-img ${i === active ? "is-visible" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="services__extra">
        <ScrollReveal>
          <span className="eyebrow">Nuestra especialidad</span>
          <h3 data-split>Dónde entregamos más valor</h3>
        </ScrollReveal>
        <ScrollReveal stagger className="especialidad-grid">
          {especialidades.map((e) => (
            <Tilt className="especialidad-card" key={e.n}>
              <a className="card-link" href={servicePath(e.page)} data-cursor="interactive">
                <img src={e.img} alt={e.alt} loading="lazy" />
                <div className="especialidad-card__overlay" />
                <div className="especialidad-card__content">
                  <span className="pillar__num">{e.n}</span>
                  <h3 className="on-dark">{e.title}</h3>
                  <p className="on-dark-soft">{e.desc}</p>
                </div>
              </a>
            </Tilt>
          ))}
        </ScrollReveal>
      </div>

      {/* Houses: a block inside Servicios on purpose (he asked for a space, not a page). */}
      <div className="casas" id="casas">
        <figure className="casas__media">
          <img
            src={residencia}
            alt="Casa contemporánea con fachada de madera, diseño y construcción de casas en Guatemala"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <ScrollReveal className="casas__body">
          <span className="eyebrow">Casas a la medida</span>
          <h3 data-split>Diseño y construcción de casas en Guatemala</h3>
          <p>
            También diseñamos y construimos casas para familias: del diseño de la casa y los planos a la
            licencia de construcción y la obra terminada, con el mismo equipo y un solo responsable.
          </p>
          <ul className="casas__list">
            {casas.map((c) => (
              <li key={c.title}>
                <strong>{c.title}</strong> {c.desc}
              </li>
            ))}
          </ul>
          <div className="casas__links">
            <a
              className="services__all"
              href={waHref("Hola, quiero cotizar el diseño y la construcción de una casa.")}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="interactive"
            >
              Cotizar mi casa por WhatsApp →
            </a>
            <a className="services__all" href={servicePath("diseno-arquitectonico")} data-cursor="interactive">
              Ver diseño y planos →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
