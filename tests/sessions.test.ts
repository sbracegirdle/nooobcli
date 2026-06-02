import assert from 'node:assert/strict';
import test from 'node:test';

import {adjacentSession} from '../source/sessions.ts';
import type {Session} from '../source/types.ts';

const sessions: Session[] = [
  {id: 1, name: 'main', status: 'running'},
  {id: 2, name: 'work', status: 'running'},
  {id: 3, name: 'logs', status: 'running'}
];

test('adjacentSession returns undefined when there are no sessions', () => {
  assert.equal(adjacentSession([], 1, 1), undefined);
});

test('adjacentSession wraps forward and backward from the active session', () => {
  assert.deepEqual(adjacentSession(sessions, 1, 1), sessions[1]);
  assert.deepEqual(adjacentSession(sessions, 1, -1), sessions[2]);
  assert.deepEqual(adjacentSession(sessions, 3, 1), sessions[0]);
});

test('adjacentSession falls back to the first session when the active id is missing', () => {
  assert.deepEqual(adjacentSession(sessions, 99, 1), sessions[1]);
  assert.deepEqual(adjacentSession(sessions, undefined, -1), sessions[2]);
});
