export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function fitText(value, width) {
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
