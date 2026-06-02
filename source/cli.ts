#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.ts';

render(React.createElement(App), {
  alternateScreen: true
});
