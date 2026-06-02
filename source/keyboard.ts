import type {KeyInput} from './types.ts';

export function createSessionName(index: number): string {
  return index === 0 ? 'main' : `term-${index + 1}`;
}

export function keyToSequence(input: string, key: KeyInput): string {
  if (key.upArrow) {
    return '\u001B[A';
  }

  if (key.downArrow) {
    return '\u001B[B';
  }

  if (key.rightArrow) {
    return '\u001B[C';
  }

  if (key.leftArrow) {
    return '\u001B[D';
  }

  if (key.backspace) {
    return '\u007F';
  }

  if (key.delete) {
    return '\u001B[3~';
  }

  if (key.return) {
    return '\r';
  }

  if (key.tab) {
    return '\t';
  }

  if (key.escape) {
    return '\u001B';
  }

  if (key.ctrl && input.length === 1) {
    return String.fromCharCode(input.toLowerCase().charCodeAt(0) - 96);
  }

  return input;
}
