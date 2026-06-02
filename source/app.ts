import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, Text, useApp, useInput, useStdin, useStdout, useWindowSize} from 'ink';
import pty from 'node-pty';
import xterm from '@xterm/headless';
import type {Terminal as XtermTerminal} from '@xterm/headless';
import {DEFAULT_SESSIONS, shell} from './constants.ts';
import {createSessionName, keyToSequence} from './keyboard.ts';
import {getLayout, getPaneHeader, getViewportSize} from './layout.ts';
import SessionList from './session-list.ts';
import {adjacentSession} from './sessions.ts';
import TerminalPane from './terminal-pane.ts';
import type {Session} from './types.ts';

const {Terminal} = xterm;

export default function App() {
  const {exit} = useApp();
  const {isRawModeSupported} = useStdin();
  const {stdout} = useStdout();
  const windowSize = useWindowSize();
  const ptysRef = useRef(new Map<number, pty.IPty>());
  const terminalsRef = useRef(new Map<number, XtermTerminal>());
  const nextIdRef = useRef(1);
  const [renderTick, setRenderTick] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const viewport = getViewportSize({
    stdout,
    windowSize: {height: windowSize.rows, width: windowSize.columns}
  });
  const layout = getLayout(viewport);

  const stopSession = useCallback((id: number) => {
    const terminal = ptysRef.current.get(id);
    const screen = terminalsRef.current.get(id);

    if (terminal) {
      terminal.kill();
      ptysRef.current.delete(id);
    }

    if (screen) {
      screen.dispose();
      terminalsRef.current.delete(id);
    }
  }, []);

  const startSession = useCallback(
    (name: string, {activate = true}: {activate?: boolean} = {}) => {
      const id = nextIdRef.current++;
      const screen = new Terminal({
        allowProposedApi: true,
        cols: layout.terminalCols,
        rows: layout.terminalRows,
        scrollback: 1000
      });
      const terminal = pty.spawn(shell, [], {
        cols: layout.terminalCols,
        cwd: process.cwd(),
        env: process.env,
        name: 'xterm-256color',
        rows: layout.terminalRows
      });

      ptysRef.current.set(id, terminal);
      terminalsRef.current.set(id, screen);

      setSessions(current => [
        ...current,
        {
          id,
          name,
          status: 'running'
        }
      ]);

      terminal.onData(data => {
        screen.write(data, () => {
          setRenderTick(tick => tick + 1);
        });
      });

      terminal.onExit(({exitCode}) => {
        ptysRef.current.delete(id);

        setSessions(current =>
          current.map(session =>
            session.id === id
              ? {
                  ...session,
                  status: `exited ${exitCode}`
                }
              : session
          )
        );
      });

      if (activate) {
        setActiveId(id);
      }

      return id;
    },
    [layout.terminalCols, layout.terminalRows]
  );

  useEffect(() => {
    if (!isRawModeSupported || sessions.length > 0) {
      return;
    }

    const ids = DEFAULT_SESSIONS.map(name => startSession(name, {activate: false}));

    if (ids[0]) {
      setActiveId(ids[0]);
    }
  }, [isRawModeSupported, sessions.length, startSession]);

  useEffect(() => {
    if (!isRawModeSupported) {
      return;
    }

    for (const terminal of ptysRef.current.values()) {
      terminal.resize(layout.terminalCols, layout.terminalRows);
    }

    for (const screen of terminalsRef.current.values()) {
      screen.resize(layout.terminalCols, layout.terminalRows);
    }
  }, [isRawModeSupported, layout.terminalCols, layout.terminalRows]);

  useEffect(
    () => () => {
      for (const id of ptysRef.current.keys()) {
        stopSession(id);
      }
    },
    [stopSession]
  );

  const activeSession = useMemo(
    () => sessions.find(session => session.id === activeId) ?? sessions[0],
    [activeId, sessions]
  );
  const activeTerminal = useMemo(
    () => (activeSession ? terminalsRef.current.get(activeSession.id) : undefined),
    [activeSession, renderTick]
  );
  const paneHeader = getPaneHeader({
    cols: layout.terminalCols,
    rows: layout.terminalRows,
    session: activeSession
  });

  useEffect(() => {
    if (!activeSession && sessions.length > 0) {
      setActiveId(sessions[0].id);
    }
  }, [activeSession, sessions]);

  useInput(
    (input, key) => {
      if (key.ctrl && input === 'q') {
        exit();
        return;
      }

      if (key.ctrl && input === 'n') {
        startSession(createSessionName(sessions.length));
        return;
      }

      if (key.ctrl && input === 'w' && activeSession) {
        const index = sessions.findIndex(session => session.id === activeSession.id);
        stopSession(activeSession.id);

        const remaining = sessions.filter(session => session.id !== activeSession.id);
        setSessions(remaining);
        setActiveId(remaining[Math.max(0, index - 1)]?.id ?? remaining[0]?.id ?? null);
        return;
      }

      if (key.ctrl && input === 'o') {
        setActiveId(adjacentSession(sessions, activeSession?.id, 1)?.id ?? null);
        return;
      }

      if (key.ctrl && input === 'p') {
        setActiveId(adjacentSession(sessions, activeSession?.id, -1)?.id ?? null);
        return;
      }

      if (key.ctrl && /^[1-9]$/.test(input)) {
        const selected = sessions[Number(input) - 1];

        if (selected) {
          setActiveId(selected.id);
        }

        return;
      }

      if (key.ctrl && key.tab) {
        const index = sessions.findIndex(session => session.id === activeSession?.id);
        const next = sessions[(index + 1) % sessions.length];

        if (next) {
          setActiveId(next.id);
        }

        return;
      }

      const terminal = activeSession ? ptysRef.current.get(activeSession.id) : undefined;

      if (terminal) {
        terminal.write(keyToSequence(input, key));
      }
    },
    {isActive: Boolean(isRawModeSupported)}
  );

  if (!isRawModeSupported) {
    return React.createElement(
      Box,
      {flexDirection: 'column', paddingX: 1},
      React.createElement(Text, {color: 'red'}, 'This app needs an interactive TTY.'),
      React.createElement(Text, {dimColor: true}, 'Run it directly in a terminal with npm start.')
    );
  }

  return React.createElement(
    Box,
    {flexDirection: 'column', height: layout.viewportHeight, width: layout.viewportWidth},
    React.createElement(
      Box,
      {height: layout.headerHeight, width: layout.viewportWidth},
      React.createElement(Text, {inverse: true}, ' nooobcli '),
      React.createElement(
        Text,
        {dimColor: true},
        '  Ctrl+o/p switch  Ctrl+n new  Ctrl+w close  Ctrl+q quit'
      )
    ),
    React.createElement(
      Box,
      {height: layout.bodyHeight},
      React.createElement(SessionList, {
        activeId: activeSession?.id,
        bodyHeight: layout.bodyHeight,
        sessions,
        width: layout.sidebarWidth
      }),
      React.createElement(
        Box,
        {
          borderStyle: 'single',
          flexDirection: 'column',
          height: layout.bodyHeight,
          paddingX: 1,
          width: layout.paneBoxWidth
        },
        React.createElement(Text, {dimColor: true}, paneHeader),
        React.createElement(TerminalPane, {rows: layout.terminalRows, terminal: activeTerminal})
      )
    )
  );
}
