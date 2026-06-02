import assert from 'node:assert/strict';
import test from 'node:test';

import {getLayout, getPaneHeader, getViewportSize} from '../source/layout.ts';

test('getViewportSize prefers stdout dimensions and enforces minimums', () => {
  assert.deepEqual(
    getViewportSize({
      stdout: {columns: 120, rows: 40},
      windowSize: {height: 24, width: 80}
    }),
    {height: 40, width: 120}
  );

  assert.deepEqual(
    getViewportSize({
      stdout: {columns: 10, rows: 2},
      windowSize: {height: 24, width: 80}
    }),
    {height: 8, width: 40}
  );
});

test('getLayout derives pane and terminal dimensions from the viewport', () => {
  assert.deepEqual(getLayout({height: 30, width: 100}), {
    bodyHeight: 29,
    headerHeight: 1,
    paneBoxWidth: 78,
    sidebarWidth: 22,
    terminalCols: 74,
    terminalRows: 26,
    viewportHeight: 30,
    viewportWidth: 100
  });
});

test('getPaneHeader right-aligns dimensions when there is room', () => {
  assert.equal(
    getPaneHeader({
      cols: 20,
      rows: 5,
      session: {id: 1, name: 'main', status: 'running'}
    }),
    'main running    20x5'
  );
});

test('getPaneHeader truncates when metadata and title exceed the width', () => {
  assert.equal(
    getPaneHeader({
      cols: 8,
      rows: 3,
      session: {id: 1, name: 'very-long-session', status: 'running'}
    }),
    'very-lo…'
  );
});
