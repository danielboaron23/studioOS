import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          'Binary toggle built on `radix-ui`. Two sizes via `size="sm" | "default"`. Always pair with a visible label or `aria-label`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = { args: { 'aria-label': 'Strict' } };

export const Checked: Story = { args: { defaultChecked: true, 'aria-label': 'Strict' } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch size="sm" defaultChecked aria-label="Small" />
      <Switch defaultChecked aria-label="Default" />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm">
      <Switch defaultChecked /> Use agent ID
    </label>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled aria-label="Off, disabled" />
      <Switch disabled defaultChecked aria-label="On, disabled" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <Switch aria-invalid="true" /> Required setting
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Switch defaultChecked aria-invalid="true" /> Invalid configuration
      </label>
    </div>
  ),
};
