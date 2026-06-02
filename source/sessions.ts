import type {Session} from './types.ts';

export function adjacentSession(
  sessions: Session[],
  activeId: number | null | undefined,
  offset: number
): Session | undefined {
  if (sessions.length === 0) {
    return undefined;
  }

  const activeIndex = Math.max(0, sessions.findIndex(session => session.id === activeId));
  return sessions[(activeIndex + offset + sessions.length) % sessions.length];
}
