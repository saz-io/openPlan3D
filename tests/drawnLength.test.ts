import { describe, expect, it } from 'vitest';
import { lengthFromFields, parseDrawnLength, snapLengthAlong, snapStepOptions } from '$lib/utils/drawnLength';

describe('parseDrawnLength', () => {
  it('reads a bare number as feet in imperial projects and cm in metric ones', () => {
    expect(parseDrawnLength('10', 'imperial')).toBeCloseTo(304.8);
    expect(parseDrawnLength('10.5', 'imperial')).toBeCloseTo(320.04);
    expect(parseDrawnLength('250', 'metric')).toBe(250);
  });
  it('accepts feet and inches marks', () => {
    expect(parseDrawnLength("10'6", 'imperial')).toBeCloseTo(320.04);
    expect(parseDrawnLength('10\'6"', 'imperial')).toBeCloseTo(320.04);
    expect(parseDrawnLength('6"', 'imperial')).toBeCloseTo(15.24);
    expect(parseDrawnLength('3m', 'metric')).toBe(300);
  });
  it('rejects empty, zero and malformed input', () => {
    for (const text of ['', ' ', '.', '0', '0.0', "'", 'abc', '-5']) expect(parseDrawnLength(text, 'imperial')).toBeNull();
  });
});

describe('lengthFromFields', () => {
  it('adds feet and inches, or metres and centimetres', () => {
    expect(lengthFromFields('imperial', '10', '6')).toBeCloseTo(320.04);
    expect(lengthFromFields('imperial', '', '6')).toBeCloseTo(15.24);
    expect(lengthFromFields('metric', '3', '25')).toBe(325);
  });
  it('is null when empty, zero or invalid', () => {
    expect(lengthFromFields('imperial', '', '')).toBeNull();
    expect(lengthFromFields('imperial', '0', '0')).toBeNull();
    expect(lengthFromFields('imperial', 'x', '1')).toBeNull();
    expect(lengthFromFields('metric', '-1', '0')).toBeNull();
  });
});

describe('snapLengthAlong', () => {
  it('snaps the length (not x and y) to the step and keeps the direction', () => {
    const end = snapLengthAlong({ x: 0, y: 0 }, { x: 70, y: 70 }, 25);
    expect(Math.hypot(end.x, end.y)).toBeCloseTo(100);
    expect(end.x).toBeCloseTo(end.y);
  });
  it('never collapses a wall to zero length', () => {
    expect(Math.hypot(...Object.values(snapLengthAlong({ x: 0, y: 0 }, { x: 3, y: 0 }, 25)) as [number, number])).toBeCloseTo(25);
  });
  it('offers imperial and metric presets', () => {
    expect(snapStepOptions('imperial').map(o => o.label)).toEqual(['1"', '3"', '6"', "1'"]);
    expect(snapStepOptions('metric')[3].cm).toBe(25);
  });
});
