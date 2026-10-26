import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Primitives/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text field matching `Input` (border, radius, focus ring). Auto-grows with `field-sizing-content`. Set `aria-invalid` for the error ring.',
      },
    },
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { placeholder: 'Describe desired model behavior…' } };

export const WithValue: Story = {
  args: { defaultValue: 'You are a concise research assistant. Answer in 2-3 sentences.' },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, placeholder: 'Required' },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled' },
};
