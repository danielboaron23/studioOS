import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldControl,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from './field';
import { Input } from './input';
import { Textarea } from './textarea';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

const meta: Meta<typeof Field> = {
  title: 'Primitives/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          'Field composition for forms. Automatically wires `id`, `aria-describedby`, `aria-invalid`, and `aria-errormessage`. Includes `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldControl`, `FieldSet`, `FieldLegend`, and `FieldGroup`.',
      },
    },
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl asChild>
        <Input type="email" placeholder="you@example.com" />
      </FieldControl>
      <FieldDescription>We&apos;ll never share your email.</FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field>
      <FieldLabel>Username</FieldLabel>
      <FieldControl asChild>
        <Input defaultValue="a" />
      </FieldControl>
      <FieldError>Username must be at least 3 characters.</FieldError>
    </Field>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <Field>
      <FieldLabel>Bio</FieldLabel>
      <FieldControl asChild>
        <Textarea placeholder="Tell us about yourself…" />
      </FieldControl>
      <FieldDescription>Brief description for your profile.</FieldDescription>
    </Field>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <Field>
      <FieldControl className="flex items-center gap-2">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms" className="!mt-0">Accept terms and conditions</FieldLabel>
      </FieldControl>
      <FieldDescription>You must agree to continue.</FieldDescription>
    </Field>
  ),
};

export const WithRadioGroup: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Notify me via</FieldLegend>
      <FieldGroup>
        <RadioGroup defaultValue="email">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="sms" id="sms" />
            <Label htmlFor="sms">SMS</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">None</Label>
          </div>
        </RadioGroup>
      </FieldGroup>
      <FieldDescription>Choose how you want to be notified.</FieldDescription>
    </FieldSet>
  ),
};

export const MultipleFields: Story = {
  render: () => (
    <form className="space-y-6">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldControl asChild>
          <Input placeholder="John Doe" />
        </FieldControl>
      </Field>

      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl asChild>
          <Input type="email" placeholder="john@example.com" />
        </FieldControl>
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel>Message</FieldLabel>
        <FieldControl asChild>
          <Textarea placeholder="Your message…" />
        </FieldControl>
      </Field>
    </form>
  ),
};
