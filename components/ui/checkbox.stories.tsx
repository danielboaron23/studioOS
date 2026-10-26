import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox built on `radix-ui`. Supports checked, unchecked, and indeterminate states. Always pair with a visible label or `aria-label`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: { 'aria-label': 'Accept terms' },
};

export const Checked: Story = {
  args: { defaultChecked: true, 'aria-label': 'Accept terms' },
};

export const Indeterminate: Story = {
  args: { checked: 'indeterminate', 'aria-label': 'Select all' },
};

export const WithLabel: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox defaultChecked /> Accept terms and conditions
    </label>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox disabled aria-label="Unchecked, disabled" />
      <Checkbox disabled defaultChecked aria-label="Checked, disabled" />
      <Checkbox disabled checked="indeterminate" aria-label="Indeterminate, disabled" />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox aria-invalid="true" /> Required field
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox defaultChecked aria-invalid="true" /> Invalid selection
      </label>
    </div>
  ),
};
