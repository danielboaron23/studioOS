import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RadioGroup, RadioGroupItem } from './radio-group';

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
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <label htmlFor="r1" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Default
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <label htmlFor="r2" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Comfortable
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <label htmlFor="r3" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Compact
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="card" className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="card" id="h1" />
        <label htmlFor="h1" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Card
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="paypal" id="h2" />
        <label htmlFor="h2" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          PayPal
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="apple" id="h3" />
        <label htmlFor="h3" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Apple Pay
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="enabled">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="enabled" id="d1" />
        <label htmlFor="d1" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Enabled
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="disabled" id="d2" disabled />
        <label htmlFor="d2" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Disabled
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <RadioGroup>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="inv1" aria-invalid="true" />
        <label htmlFor="inv1" className="text-sm leading-none">
          Required option
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="inv2" aria-invalid="true" />
        <label htmlFor="inv2" className="text-sm leading-none">
          Another option
        </label>
      </div>
    </RadioGroup>
  ),
};
