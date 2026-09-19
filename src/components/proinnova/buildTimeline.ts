/**
 * Scroll story for the hero, shared by the 3D scene and the HTML overlay so the
 * level meter and stage label always match what the building is doing.
 * All values are fractions of the hero's pinned scroll (0 → 1).
 */
import { BUILDING_FLOORS } from "./site";

export const TIMELINE = {
  /** Concrete frame rises floor by floor. `head` is how much already stands on the first frame. */
  structure: { from: 0, to: 0.58, head: 0.26 },
  /** Glass curtain wall goes on bottom-up, overlapping the last floors of structure. */
  facade: { from: 0.28, to: 0.84 },
  /** The sun keeps dropping: how dark the scene has gone. */
  dusk: { from: 0.3, to: 1 },
  /** Subtitle and call to action appear. */
  reveal: 0.86,
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
export const duskValue = (p: number) => easeInOutCubic(range(p, TIMELINE.dusk.from, TIMELINE.dusk.to));

/**
 * Progress of floor `i` inside a phase value `v` that walks the floors bottom-up.
 * `overlap` > 1 lets consecutive floors run in parallel; the last floor still ends at v = 1.
 */
export function floorPhase(v: number, i: number, overlap = 1.6) {
  return clamp01((v * (BUILDING_FLOORS - 1 + overlap) - i) / overlap);
}

/** How far floor `i` is into its curtain wall. */
export const floorFacadeAt = (p: number, i: number) => floorPhase(facadeValue(p), i, 1.4);

/**
 * How lit floor `i` is (0 → 1). A floor starts switching its windows on as soon as
 * its glass is half in, so lights climb the tower behind the facade instead of
 * waiting for the end. Dusk only decides how much they read against the sky.
 */
export function floorLightAt(p: number, i: number) {
  return easeInOutCubic(range(floorFacadeAt(p, i), 0.45, 1));
}

/** Overall glow multiplier: faint while the sun is up, full once it is down. */
export const glowGain = (p: number) => 0.16 + 1.22 * duskValue(p);

export function floorsBuiltAt(p: number) {
  const v = structureValue(p);
  let built = 0;
  for (let i = 0; i < BUILDING_FLOORS; i++) if (floorPhase(v, i) >= 0.9) built++;
  return built;
}

/** Windows already lit, for the hero meter. */
export function floorsLitAt(p: number) {
  let lit = 0;
  for (let i = 0; i < BUILDING_FLOORS; i++) if (floorLightAt(p, i) >= 0.5) lit++;
  return lit;
}

export type Stage = "Estructura" | "Fachada" | "Iluminación" | "Entrega";

export function stageAt(p: number): Stage {
  if (p < TIMELINE.facade.from) return "Estructura";
  if (p < TIMELINE.facade.to - 0.14) return "Fachada";
  if (p < 0.95) return "Iluminación";
  return "Entrega";
}
