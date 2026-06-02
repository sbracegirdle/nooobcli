import React from 'react';
import {Text} from 'ink';

const ANSI_COLORS = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright'
];

function colorFromCell(cell, type) {
  const isPalette = type === 'foreground' ? cell.isFgPalette() : cell.isBgPalette();
  const isRgb = type === 'foreground' ? cell.isFgRGB() : cell.isBgRGB();
  const color = type === 'foreground' ? cell.getFgColor() : cell.getBgColor();

  if (isPalette) {
    return ANSI_COLORS[color] ?? undefined;
  }

  if (isRgb) {
    return `#${color.toString(16).padStart(6, '0')}`;
  }

  return undefined;
}

function cellStyle(cell, cursor = false) {
  const inverse = Boolean(cell.isInverse()) || cursor;

  return {
    backgroundColor: colorFromCell(cell, inverse ? 'foreground' : 'background'),
    bold: Boolean(cell.isBold()),
    color: colorFromCell(cell, inverse ? 'background' : 'foreground'),
    dimColor: Boolean(cell.isDim()),
    inverse: cursor && !cell.isInverse(),
    italic: Boolean(cell.isItalic()),
    underline: Boolean(cell.isUnderline())
  };
}

function styleKey(style) {
  return JSON.stringify(style);
}

function terminalLineRuns(terminal, row) {
  const buffer = terminal.buffer.active;
  const line = buffer.getLine(buffer.viewportY + row);
  const cell = buffer.getNullCell();
  const runs = [];

  if (!line) {
    return [{style: {}, text: ''}];
  }

  for (let column = 0; column < terminal.cols; column++) {
    line.getCell(column, cell);

    if (cell.getWidth() === 0) {
      continue;
    }

    const isCursor = row === buffer.cursorY && column === buffer.cursorX;
    const style = cellStyle(cell, isCursor);
    const text = cell.getChars() || ' ';
    const previous = runs.at(-1);
    const key = styleKey(style);

    if (previous && previous.key === key) {
      previous.text += text;
      continue;
    }

    runs.push({
      key,
      style,
      text
    });
  }

  while (runs.length > 0 && runs.at(-1).text.trimEnd() === '') {
    runs.pop();
  }

  return runs.length > 0 ? runs : [{style: {}, text: ''}];
}

export default function TerminalPane({terminal, rows}) {
  if (!terminal) {
    return React.createElement(Text, {dimColor: true}, 'Starting shell...');
  }

  return Array.from({length: rows}, (_, row) =>
    React.createElement(
      Text,
      {key: row},
      terminalLineRuns(terminal, row).map((run, index) =>
        React.createElement(Text, {...run.style, key: `${row}-${index}`}, run.text)
      )
    )
  );
}
