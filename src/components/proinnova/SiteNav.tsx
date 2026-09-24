import Logo from "./Logo";
import MagneticButton from "./MagneticButton";

export default function SiteNav({ overHero, home }: { overHero: boolean; home: boolean }) {
  // On the home page the sections are right there; elsewhere the links go back to them.
  const at = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className={`nav ${overHero ? "nav--over-hero" : ""}`}>
      <div className="nav__inner">
        <a className="nav__logo" href={home ? "#inicio" : "/"} aria-label="Grupo Proinnova, ir al inicio">
          <Logo variant={overHero ? "on-dark" : "on-light"} />
        </a>
        <nav className="nav__links" aria-label="Principal">
          <a href={at("quienes-somos")}>Nosotros</a>
          <a href={at("valores")}>Valores</a>
          <a href={home ? "#servicios" : "/servicios/"}>Servicios</a>
          <a href={at("casos")}>Casos</a>
        </nav>
        <MagneticButton href="#contacto" variant="outline" className="nav__cta">
          Hablemos
        </MagneticButton>
      </div>
    </header>
  );
}
