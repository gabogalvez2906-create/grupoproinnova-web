import ScrollReveal from "./ScrollReveal";

// Six steps laid out across the page: the old pinned vertical list burned four
// screens of scroll for the same content.
const steps = [
  { n: "01", title: "Reunión", desc: "Objetivos, alcance y presupuesto." },
  { n: "02", title: "Planificación", desc: "Cronograma y recursos." },
  { n: "03", title: "Diseño", desc: "Planos e ingeniería." },
  { n: "04", title: "Construcción", desc: "Supervisión técnica en obra." },
  { n: "05", title: "Entrega", desc: "Validación y entrega final." },
  { n: "06", title: "Seguimiento", desc: "Mantenimiento y garantía." },
];

const fases = [
  { title: "Idea", desc: "Damos forma al concepto y validamos qué es posible en su terreno." },
  { title: "Prefactibilidad", desc: "Costos estimados, tramitología y control de calidad." },
  { title: "Diseño", desc: "Arquitectura, estructuras, hidráulica, eléctrica y climatización." },
  { title: "Ejecución", desc: "Obra completa con supervisión técnica." },
];

const certeza = [
  { title: "Presupuesto desglosado", desc: "Cada costo y cada actividad, a la vista." },
  { title: "Alcance definido", desc: "Lo que entra y lo que no, por escrito." },
  { title: "Planificación a su medida", desc: "Adaptada a sus recursos y tiempos." },
  { title: "Un solo interlocutor", desc: "Atención directa durante todo el proyecto." },
];

export default function MethodSection() {
  return (
    <section className="method" id="metodologia">
      <div className="method__inner">
        <ScrollReveal>
          <span className="eyebrow eyebrow--light">Metodología</span>
          <h2 className="on-dark" data-split>Un método ordenado</h2>
          <p className="on-dark-soft method__lead">
            Seis pasos que convierten una idea en una obra entregada, con un solo interlocutor de
            principio a fin.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger>
          <ol className="method__steps">
            <li className="method__track" aria-hidden="true">
              <i data-line />
            </li>
            {steps.map((step) => (
              <li className="method__step" key={step.n}>
                <span className="method__num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </ScrollReveal>

        <div className="method__band">
          <ScrollReveal>
            <div>
              <h3 className="on-dark">Entramos en cualquier fase</h3>
              <p className="method__band-lead">
                Desde una idea en servilleta hasta una obra que ya está en marcha. Usted decide
                dónde empieza nuestra participación.
              </p>
              <ul className="method__list">
                {fases.map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h3 className="on-dark">Construir no debería ser una apuesta</h3>
              <p className="method__band-lead">
                La incertidumbre en costos, plazos y calidad es el mayor riesgo de cualquier obra.
                Nuestro trabajo es eliminarla antes de que empiece la construcción.
              </p>
              <ul className="method__list">
                {certeza.map((c) => (
                  <li key={c.title}>
                    <strong>{c.title}</strong>
                    <p>{c.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
