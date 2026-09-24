const stats = [
  {
    n: 50,
    plus: true,
    featured: true,
    label: "Proyectos entregados",
    note: "Más de cincuenta clientes creyeron en nosotros. Hoy operan, venden y viven en espacios que levantamos.",
  },
  {
    n: 8,
    plus: true,
    featured: false,
    label: "Obras en simultáneo",
    note: "Capacidad para sostener varios frentes a la vez sin que ninguno pierda supervisión.",
  },
  {
    n: 10,
    plus: false,
    featured: false,
    label: "Especialidades integradas",
    note: "Diseño, obra civil, estructuras, instalaciones y acabados bajo un solo contrato.",
  },
];

interface ReachStatsProps {
  eyebrow?: string;
  title?: string;
}

/**
 * The company's reach in three numbers (home page and every service page).
 * The HTML carries the real figures, so crawlers and no-JS readers see them;
 * ScrollEffects resets them to 0 and counts up on screen.
 */
export default function ReachStats({
  eyebrow = "Trayectoria y alcance",
  title = "Más alcance. El mismo estándar en cada obra.",
}: ReachStatsProps) {
  return (
    <section className="stats" aria-labelledby="stats-title">
      <div className="stats__intro">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="stats-title" data-split>
          {title}
        </h2>
      </div>
      <div className="stats__grid">
        {stats.map((s) => (
          <div className={`stats__item ${s.featured ? "stats__item--featured" : ""}`} key={s.label}>
            <span className="stats__rule" aria-hidden="true">
              <i data-line />
            </span>
            <span className="stats__num">
              {s.plus && <span className="stats__plus">+</span>}
              <span data-count={s.n}>{s.n}</span>
            </span>
            <span className="stats__label">{s.label}</span>
            <p className="stats__note">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
