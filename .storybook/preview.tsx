import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'

import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  initialGlobals: {
    theme: 'light',
  },

  globalTypes: {
    theme: {
      description: 'Studio OS color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light'
      return (
        <div
          className={theme === 'dark' ? 'dark' : ''}
          style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            padding: '2rem',
            minHeight: '100vh',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
};

export default preview;
