import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

const meta: Meta<typeof RadioGroup> = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          'Radio group built on `radix-ui`. Always pair each `RadioGroupItem` with a visible label or wrap them in a label.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="card" className="flex gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="card" id="h1" />
        <Label htmlFor="h1">Card</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="paypal" id="h2" />
        <Label htmlFor="h2">PayPal</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="apple" id="h3" />
        <Label htmlFor="h3">Apple Pay</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="enabled">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="enabled" id="d1" />
        <Label htmlFor="d1">Enabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="disabled" id="d2" disabled />
        <Label htmlFor="d2">Disabled</Label>
      </div>
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option1" id="inv1" aria-invalid="true" />
        <Label htmlFor="inv1">Required option</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option2" id="inv2" aria-invalid="true" />
        <Label htmlFor="inv2">Another option</Label>
      </div>
    </RadioGroup>
  ),
};
