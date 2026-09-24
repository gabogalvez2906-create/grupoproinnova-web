/** Canonical origin of the published site (GitHub Pages custom domain). */
export const SITE_URL = "https://grupoproinnova.com";

/** Single source of truth for company details shown across the site. */
export const CONTACT = {
  // Alias on Hostinger that delivers to ggalvez@grupoproinnova.com.
  email: "contacto@grupoproinnova.com",
  phones: ["+502 4142 0285", "+502 4214 1321"],
  // WhatsApp goes to the second number (Gabo, 2026-09-23). Keep both fields in step.
  whatsapp: "50242141321",
  whatsappLabel: "+502 4214 1321",
  // Attention hours (Gabo, 2026-09-24). Days not confirmed yet, so no weekday is printed.
  hours: "7:00 a. m. a 7:00 p. m.",
  /** Official profiles; also emitted as `sameAs` in the JSON-LD. */
  social: { linkedin: "https://www.linkedin.com/company/grupo-proinnova/" },
  website: "grupoproinnova.com",
  location: "Ciudad de Guatemala, Guatemala",
} as const;

/** Floors in the hero model. The hero's level meter reads this too, so they stay in sync. */
export const BUILDING_FLOORS = 8;

export function waHref(text: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
