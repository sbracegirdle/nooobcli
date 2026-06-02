# nooobcli

A small tmux-style terminal multiplexer built with [Ink](https://www.npmjs.com/package/ink), `node-pty`, and `@xterm/headless`.

## Setup

Install dependencies:

```sh
npm install
```

This project runs TypeScript directly through Node's type-stripping runtime support, so it requires Node 22.18 or newer and does not compile before start or test commands.

Run the app in an interactive terminal:

```sh
npm start
```

Run tests:

```sh
npm test
```

The app uses the terminal's alternate screen and expands to the full available viewport.

## Controls

- `Ctrl+o` / `Ctrl+p`: switch sessions
- `Ctrl+1` through `Ctrl+9`: switch sessions when supported by your terminal
- `Ctrl+n`: create a new session
- `Ctrl+w`: close the active session
- `Ctrl+q`: quit

All other input is forwarded to the active shell.

## Scope

This is a basic PTY multiplexer with headless xterm.js parsing. ANSI cursor movement, clears, colors, wrapping, and alternate-screen buffers are interpreted before Ink renders the pane.

It is still not a full tmux replacement: mouse reporting, high-frequency full-screen apps, and exact glyph rendering may need more work.
