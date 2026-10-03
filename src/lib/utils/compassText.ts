/** A compass is a text annotation: a north label above an up arrow. */
const COMPASS_TEXT = /^([^\n]*)\n▲(?:\n.*)?$/;

export function compassLabel(text: string): string {
  const match = COMPASS_TEXT.exec(text);
  return match ? match[1] : 'N';
}

export function compassText(north: string): string {
  return `${north.replace(/\n/g, ' ')}\n▲`;
}
