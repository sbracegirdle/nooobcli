import {MAX_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH} from './constants.js';
import {clamp, fitText} from './text.js';

export function getViewportSize({stdout, windowSize}) {
  const reportedWidth = stdout?.columns ?? process.stdout.columns ?? windowSize.width;
  const reportedHeight = stdout?.rows ?? process.stdout.rows ?? windowSize.height;
  const width = Number.isFinite(reportedWidth) ? reportedWidth : 80;
  const height = Number.isFinite(reportedHeight) ? reportedHeight : 24;

  return {
    height: Math.max(8, height),
    width: Math.max(40, width)
  };
}

export function getLayout(viewport) {
  const headerHeight = 1;
  const bodyHeight = viewport.height - headerHeight;
  const sidebarWidth = clamp(Math.floor(viewport.width * 0.22), MIN_SIDEBAR_WIDTH, MAX_SIDEBAR_WIDTH);
  const paneBoxWidth = Math.max(20, viewport.width - sidebarWidth);
  const paneInnerHeight = Math.max(3, bodyHeight - 2);
  const terminalCols = Math.max(20, paneBoxWidth - 4);
  const terminalRows = Math.max(2, paneInnerHeight - 1);

  return {
    bodyHeight,
    headerHeight,
    paneBoxWidth,
    sidebarWidth,
    terminalCols,
    terminalRows,
    viewportHeight: viewport.height,
    viewportWidth: viewport.width
  };
}

export function getPaneHeader({cols, rows, session}) {
  const width = Math.max(1, cols);
  const title = `${session?.name ?? 'none'} ${session?.status ?? ''}`;
  const meta = `${cols}x${rows}`;

  if (title.length + meta.length + 1 < width) {
    return `${title}${' '.repeat(width - title.length - meta.length)}${meta}`;
  }

  return fitText(`${title} ${meta}`, width);
}
