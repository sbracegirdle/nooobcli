export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function fitText(value: string, width: number): string {
  if (width <= 0) {
    return '';
  }

  if (value.length <= width) {
    return value.padEnd(width);
  }

  if (width === 1) {
    return value.slice(0, 1);
  }

  return `${value.slice(0, width - 1)}…`;
}
