import assert from 'node:assert/strict';
import test from 'node:test';

import {createSessionName, keyToSequence} from '../source/keyboard.ts';

test('createSessionName uses main for the first session and numbered terms after that', () => {
  assert.equal(createSessionName(0), 'main');
  assert.equal(createSessionName(1), 'term-2');
  assert.equal(createSessionName(4), 'term-5');
});

test('keyToSequence maps navigation and editing keys to terminal escape sequences', () => {
  assert.equal(keyToSequence('', {upArrow: true}), '\u001B[A');
  assert.equal(keyToSequence('', {downArrow: true}), '\u001B[B');
  assert.equal(keyToSequence('', {rightArrow: true}), '\u001B[C');
  assert.equal(keyToSequence('', {leftArrow: true}), '\u001B[D');
  assert.equal(keyToSequence('', {backspace: true}), '\u007F');
  assert.equal(keyToSequence('', {delete: true}), '\u001B[3~');
  assert.equal(keyToSequence('', {return: true}), '\r');
  assert.equal(keyToSequence('', {tab: true}), '\t');
  assert.equal(keyToSequence('', {escape: true}), '\u001B');
});

test('keyToSequence maps ctrl letters and passes ordinary input through', () => {
  assert.equal(keyToSequence('c', {ctrl: true}), '\u0003');
  assert.equal(keyToSequence('C', {ctrl: true}), '\u0003');
  assert.equal(keyToSequence('hello', {}), 'hello');
});
