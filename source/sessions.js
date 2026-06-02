export function adjacentSession(sessions, activeId, offset) {
  if (sessions.length === 0) {
    return undefined;
  }

  const activeIndex = Math.max(0, sessions.findIndex(session => session.id === activeId));
  return sessions[(activeIndex + offset + sessions.length) % sessions.length];
}
