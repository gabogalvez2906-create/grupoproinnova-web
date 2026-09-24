import MagneticButton from "./MagneticButton";
import ScrollReveal from "./ScrollReveal";
import { CONTACT, telHref } from "./site";

interface ContactBandProps {
  title?: string;
  lead?: string;
  /** Subject pre-filled in the e-mail, so each lead arrives tagged with the page it came from. */
  subject?: string;
}

export default function ContactBand({
  title = "Construyamos juntos tu próximo proyecto.",
  lead = "Construimos relaciones de largo plazo a través de proyectos ejecutados con calidad, responsabilidad y excelencia.",
  subject,
}: ContactBandProps) {
  const mail = `mailto:${CONTACT.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

  return (
    <section className="cta-final" id="contacto">
      <div className="cta-final__inner">
        <ScrollReveal>
          <span className="eyebrow eyebrow--light">Contacto</span>
          <h2 data-split>{title}</h2>
          <p className="cta-final__lead">{lead}</p>
          <MagneticButton href={mail} className="cta-final__btn">
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
            <a href={mail}>{CONTACT.email}</a>
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
  );
}
