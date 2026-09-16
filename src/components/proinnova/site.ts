/** Single source of truth for company details shown across the site. */
export const CONTACT = {
  // Alias on Hostinger that delivers to ggalvez@grupoproinnova.com.
  email: "contacto@grupoproinnova.com",
  phones: ["+502 4142 0285", "+502 4214 1321"],
  website: "grupoproinnova.com",
  location: "Ciudad de Guatemala, Guatemala",
} as const;

/** Floors in the hero model. The hero's level meter reads this too, so they stay in sync. */
export const BUILDING_FLOORS = 6;

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
