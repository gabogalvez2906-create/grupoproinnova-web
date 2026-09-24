/** Canonical origin of the published site (GitHub Pages custom domain). */
export const SITE_URL = "https://grupoproinnova.com";

/** Single source of truth for company details shown across the site. */
export const CONTACT = {
  // Alias on Hostinger that delivers to ggalvez@grupoproinnova.com.
  email: "contacto@grupoproinnova.com",
  phones: ["+502 4142 0285", "+502 4214 1321"],
  // The first number takes WhatsApp (confirmed by Gabo, 2026-09-23).
  whatsapp: "50241420285",
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
