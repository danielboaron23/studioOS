import type { Preview } from '@storybook/nextjs-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';

import '../app/globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Colors', 'Typography', 'Radius', 'Spacing', 'Icons'],
          'Primitives',
          [
            'Button',
            'Card',
            'Input',
            'Textarea',
            'Select',
            'Checkbox',
            'RadioGroup',
            'Switch',
            'Label',
            'Field',
            'Tabs',
            'Avatar',
            'Badge',
            'Separator',
            'Sheet',
            'Sidebar',
            'Skeleton',
            'Tooltip',
            'Toast',
            'Chart',
          ],
          'Features',
          '*',
        ],
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
    (Story) => (
      <div
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground p-6`}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
