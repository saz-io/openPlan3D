/** A compass is a text annotation: north label, up arrow, shaft, down arrow, south label. */
const COMPASS_TEXT = /^([^\n]*)\n▲\n(?:│\n)?▼\n([^\n]*)$/;

export function compassLabels(text: string): { north: string; south: string } {
  const match = COMPASS_TEXT.exec(text);
  return match ? { north: match[1], south: match[2] } : { north: 'N', south: 'S' };
}

export function compassText(north: string, south: string): string {
  return `${north.replace(/\n/g, ' ')}\n▲\n│\n▼\n${south.replace(/\n/g, ' ')}`;
}
