import Logo from "./Logo";
import { CONTACT, telHref, waHref } from "./site";
import { SERVICES, servicePath } from "./services";

// Baked into the pre-rendered HTML at build time; the browser may disagree around New Year.
const YEAR = new Date().getFullYear();

/** Site-wide footer. Its service links are the internal links every page shares. */
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo variant="on-dark" tagline className="footer__logo" />
          <p>
            Constructora en Guatemala. Diseño, obra civil, estructuras, instalaciones y acabados
            bajo un solo responsable.
          </p>
        </div>

        <nav className="site-footer__col" aria-label="Servicios">
          <span className="site-footer__title">Servicios</span>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <a href={servicePath(s.slug)}>{s.name}</a>
              </li>
            ))}
            <li>
              <a href="/servicios/">Todos los servicios</a>
            </li>
          </ul>
        </nav>

        <nav className="site-footer__col" aria-label="Empresa">
          <span className="site-footer__title">Empresa</span>
          <ul>
            <li>
              <a href="/#quienes-somos">Quiénes somos</a>
            </li>
            <li>
              <a href="/#valores">Valores</a>
            </li>
            <li>
              <a href="/#casos">Casos de éxito</a>
            </li>
            <li>
              <a href="#contacto">Contacto</a>
            </li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <span className="site-footer__title">Contacto</span>
          <ul>
            {CONTACT.phones.map((phone) => (
              <li key={phone}>
                <a href={telHref(phone)}>{phone}</a>
              </li>
            ))}
            <li>
              <a
                href={waHref("Hola, quiero información sobre un proyecto de construcción.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>{CONTACT.location}</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span suppressHydrationWarning>© {YEAR} Grupo Proinnova</span>
        <span>Constructora en Guatemala</span>
      </div>
    </footer>
  );
}
