import { describe, expect, it } from 'vitest';
import { compassLabels, compassText } from '$lib/utils/compassText';
import { compassPoint, compassShape } from '$lib/utils/compassGeometry';
import { hitTestTextAnnotation } from '$lib/utils/hitTesting';
import { textAnnotationBounds } from '$lib/utils/textAnnotationLayout';
import type { Floor, TextAnnotation } from '$lib/models/types';

const compass = (over: Partial<TextAnnotation> = {}): TextAnnotation => ({
  id: 'c', x: 100, y: 50, text: compassText({ north: 'N', south: 'S', east: 'E', west: 'W' }),
  fontSize: 12, color: '#555555', rotation: 0, kind: 'compass', ...over,
});

describe('compass object', () => {
  it('round-trips four labels and reads older "label + arrow" text', () => {
    expect(compassLabels(compassText({ north: 'Norte', south: 'Sul', east: 'Leste', west: 'Oeste' })))
      .toEqual({ north: 'Norte', south: 'Sul', east: 'Leste', west: 'Oeste' });
    expect(compassLabels('Norte\n▲')).toEqual({ north: 'Norte', south: 'S', east: 'E', west: 'W' });
    expect(compassLabels('anything else')).toEqual({ north: 'N', south: 'S', east: 'E', west: 'W' });
  });

  it('scales with its size and has eight star triangles and four labels', () => {
    const small = compassShape({ fontSize: 12, text: compass().text }), large = compassShape({ fontSize: 24, text: compass().text });
    expect(small.triangles).toHaveLength(8);
    expect(small.labels.map(label => label.text)).toEqual(['N', 'S', 'E', 'W']);
    expect(large.radius).toBeCloseTo(small.radius * 2);
  });

  it('rotates local points around the compass centre', () => {
    const p = compassPoint({ x: 100, y: 50, rotation: 90 }, { x: 0, y: -10 });
    expect(p.x).toBeCloseTo(110); expect(p.y).toBeCloseTo(50);
  });

  it('has a round selection area and rotation-independent bounds', () => {
    const note = compass({ rotation: 33 }), { radius } = compassShape(note);
    const floor = { textAnnotations: [note] } as Floor;
    const ctx = {} as CanvasRenderingContext2D;
    expect(hitTestTextAnnotation({ x: 100 + radius - 1, y: 50 }, floor, ctx, 1)).toBe('c');
    expect(hitTestTextAnnotation({ x: 100 + radius + 20, y: 50 }, floor, ctx, 1)).toBeNull();
    expect(textAnnotationBounds(note, ctx)).toEqual({ minX: 100 - radius, maxX: 100 + radius, minY: 50 - radius, maxY: 50 + radius });
  });
});
