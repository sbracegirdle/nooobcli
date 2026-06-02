import assert from 'node:assert/strict';
import test from 'node:test';

import {clamp, fitText} from '../source/text.ts';

test('clamp keeps values inside the provided bounds', () => {
  assert.equal(clamp(5, 1, 10), 5);
  assert.equal(clamp(-3, 1, 10), 1);
  assert.equal(clamp(12, 1, 10), 10);
});

test('fitText pads short text to the requested width', () => {
  assert.equal(fitText('abc', 5), 'abc  ');
});

test('fitText truncates long text with an ellipsis', () => {
  assert.equal(fitText('abcdef', 4), 'abc…');
  assert.equal(fitText('abcdef', 1), 'a');
  assert.equal(fitText('abcdef', 0), '');
});
