import type { Point, TextAnnotation } from '$lib/models/types';
import { compassLabels } from './compassText';

/** Local, unrotated shape of a compass: a four-pointed star in a ring with N/S/E/W labels. */
export interface CompassShape {
  /** Star points as triangles from the tip to the centre; `shaded` halves give the star depth. */
  triangles: Array<{ points: [Point, Point, Point]; shaded: boolean }>;
  ringRadius: number;
  labels: Array<{ text: string; x: number; y: number; anchor: 'start' | 'middle' | 'end' }>;
  labelSize: number;
  /** Radius of a circle that contains the star and its labels at any rotation. */
  radius: number;
}

/** Sizes are proportional to the annotation's fontSize (the compass "size"). */
export function compassShape(note: Pick<TextAnnotation, 'fontSize' | 'text'>): CompassShape {
  const u = Math.max(4, note.fontSize);
  const long = 2.2 * u, short = 1.6 * u, half = 0.28 * u, gap = 0.35 * u, labelSize = 0.9 * u;
  const labels = compassLabels(note.text);
  const arms: Array<[number, number, number]> = [[0, -1, long], [1, 0, short], [0, 1, long], [-1, 0, short]];
  const centre = { x: 0, y: 0 };
  const triangles = arms.flatMap(([ux, uy, length]) => {
    const tip = { x: ux * length, y: uy * length };
    const side = { x: -uy * half, y: ux * half };
    return [
      { points: [tip, centre, side] as [Point, Point, Point], shaded: true },
      { points: [tip, centre, { x: -side.x, y: -side.y }] as [Point, Point, Point], shaded: false },
    ];
  });
  return {
    triangles,
    ringRadius: 0.8 * u,
    labelSize,
    labels: [
      { text: labels.north, x: 0, y: -(long + gap + labelSize / 2), anchor: 'middle' },
      { text: labels.south, x: 0, y: long + gap + labelSize / 2, anchor: 'middle' },
      { text: labels.east, x: short + gap, y: 0, anchor: 'start' },
      { text: labels.west, x: -(short + gap), y: 0, anchor: 'end' },
    ],
    radius: long + gap + labelSize,
  };
}

/** Rotates a local point by the compass rotation (degrees) and moves it to the note position. */
export function compassPoint(note: Pick<TextAnnotation, 'x' | 'y' | 'rotation'>, p: Point): Point {
  const angle = note.rotation * Math.PI / 180, c = Math.cos(angle), s = Math.sin(angle);
  return { x: note.x + p.x * c - p.y * s, y: note.y + p.x * s + p.y * c };
}
