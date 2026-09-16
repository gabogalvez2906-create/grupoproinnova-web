/**
 * Scroll story for the hero, shared by the 3D scene and the HTML overlay so the
 * level meter and stage label always match what the building is doing.
 * All values are fractions of the hero's pinned scroll (0 → 1).
 */
import { BUILDING_FLOORS } from "./site";

export const TIMELINE = {
  /** Concrete frame rises floor by floor. `head` is how much already stands on the first frame. */
  structure: { from: 0, to: 0.6, head: 0.3 },
  /** Glass curtain wall goes on, bottom to top. */
  facade: { from: 0.56, to: 0.82 },
  /** Interior and city lights come up as the sun drops. */
  lights: { from: 0.78, to: 0.96 },
  /** Subtitle and call to action appear. */
  reveal: 0.84,
} as const;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function structureValue(p: number) {
  const { from, to, head } = TIMELINE.structure;
  return head + (1 - head) * range(p, from, to);
}

export const facadeValue = (p: number) => range(p, TIMELINE.facade.from, TIMELINE.facade.to);
export const lightsValue = (p: number) => range(p, TIMELINE.lights.from, TIMELINE.lights.to);

/**
 * Progress of floor `i` inside a phase value `v` that walks the floors bottom-up.
 * `overlap` > 1 lets consecutive floors run in parallel; the last floor still ends at v = 1.
 */
export function floorPhase(v: number, i: number, overlap = 1.6) {
  return clamp01((v * (BUILDING_FLOORS - 1 + overlap) - i) / overlap);
}

export function floorsBuiltAt(p: number) {
  const v = structureValue(p);
  let built = 0;
  for (let i = 0; i < BUILDING_FLOORS; i++) if (floorPhase(v, i) >= 0.9) built++;
  return built;
}

export type Stage = "Estructura" | "Fachada" | "Iluminación" | "Entrega";

export function stageAt(p: number): Stage {
  if (p < TIMELINE.structure.to) return "Estructura";
  if (p < TIMELINE.facade.to) return "Fachada";
  if (p < TIMELINE.lights.to) return "Iluminación";
  return "Entrega";
}
