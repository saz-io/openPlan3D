/**
 * A compass is a text annotation of kind 'compass'. Its text holds the four
 * labels, one per line (north, south, east, west). Earlier compasses stored
 * "<north label>\n▲"; those read back with the default S, E and W labels.
 */
export interface CompassLabels { north: string; south: string; east: string; west: string }

const DEFAULTS: CompassLabels = { north: 'N', south: 'S', east: 'E', west: 'W' };

export function compassLabels(text: string): CompassLabels {
  const lines = text.split('\n');
  if (lines.length === 4) return { north: lines[0], south: lines[1], east: lines[2], west: lines[3] };
  if (lines.length >= 2 && lines[1] === '▲') return { ...DEFAULTS, north: lines[0] };
  return { ...DEFAULTS };
}

export function compassText(labels: CompassLabels): string {
  const clean = (value: string) => value.replace(/\n/g, ' ');
  return [labels.north, labels.south, labels.east, labels.west].map(clean).join('\n');
}
