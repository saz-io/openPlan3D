import type { Point } from '$lib/models/types';
import { parseLengthInput } from '$lib/stores/settings';

type Units = 'metric' | 'imperial';

const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;

/**
 * Length typed while drawing a wall, in cm. A bare number is feet in imperial
 * projects and cm in metric ones; `10'6`, `10'6"`, `6"`, `3m`, `250cm` also work.
 */
export function parseDrawnLength(text: string, units: Units): number | null {
  const value = text.trim();
  if (!value) return null;
  let cm: number | null;
  if (/^\d*\.?\d*$/.test(value)) {
    const number = Number(value);
    cm = Number.isFinite(number) && value !== '.' ? number * (units === 'imperial' ? CM_PER_FOOT : 1) : null;
  } else {
    // Feet and inches, with the inch mark optional ("10'6").
    cm = parseLengthInput(value, units);
  }
  return cm !== null && cm > 0 ? cm : null;
}

/** Length from the exact-length box fields: feet + inches, or metres + centimetres. */
export function lengthFromFields(units: Units, major: string, minor: string): number | null {
  const a = major.trim() === '' ? 0 : Number(major), b = minor.trim() === '' ? 0 : Number(minor);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) return null;
  const cm = units === 'imperial' ? a * CM_PER_FOOT + b * CM_PER_INCH : a * 100 + b;
  return cm > 0 ? cm : null;
}

export interface SnapStepOption { label: string; cm: number }

/** Snap step presets for the grid and wall lengths. */
export function snapStepOptions(units: Units): SnapStepOption[] {
  return units === 'imperial'
    ? [{ label: '1"', cm: CM_PER_INCH }, { label: '3"', cm: 3 * CM_PER_INCH }, { label: '6"', cm: 6 * CM_PER_INCH }, { label: "1'", cm: CM_PER_FOOT }]
    : [{ label: '1 cm', cm: 1 }, { label: '5 cm', cm: 5 }, { label: '10 cm', cm: 10 }, { label: '25 cm', cm: 25 }];
}

/** Moves `end` along the start→end direction so the wall length is a multiple of `step`. */
export function snapLengthAlong(start: Point, end: Point, step: number): Point {
  const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy);
  if (!(step > 0) || length < 1e-9) return end;
  const snapped = Math.max(step, Math.round(length / step) * step);
  return { x: start.x + (dx / length) * snapped, y: start.y + (dy / length) * snapped };
}
