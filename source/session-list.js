import React from 'react';
import {Box, Text} from 'ink';
import {fitText} from './text.js';

export default function SessionList({activeId, bodyHeight, sessions, width}) {
  const contentWidth = width - 2;
  const roomy = sessions.length * 3 + 2 <= bodyHeight;

  return React.createElement(
    Box,
    {borderStyle: 'single', flexDirection: 'column', height: bodyHeight, width},
    React.createElement(Text, {bold: true}, fitText(' Sessions', contentWidth)),
    sessions.map((session, index) => {
      const active = session.id === activeId;
      const shortcut = `${index + 1}`;
      const title = fitText(`${shortcut} ${session.name}`, contentWidth);
      const status = fitText(`  ${session.status}`, contentWidth);

      if (!roomy) {
        return React.createElement(
          Text,
          {
            color: active ? 'cyan' : undefined,
            inverse: active,
            key: session.id
          },
          title
        );
      }

      return React.createElement(
        Box,
        {flexDirection: 'column', key: session.id},
        React.createElement(
          Text,
          {
            color: active ? 'cyan' : undefined,
            inverse: active
          },
          title
        ),
        React.createElement(Text, {dimColor: !active}, status),
        React.createElement(Text, {dimColor: true}, fitText('', contentWidth))
      );
    })
  );
}
