import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
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
          'Field composition for forms. Automatically wires `id`, `aria-describedby`, `aria-invalid`, and `aria-errormessage`. Includes `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldSet`, `FieldLegend`, and `FieldGroup`.',
      },
    },
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => {
    const id = 'email-field';
    const descriptionId = `${id}-description`;
    return (
      <Field>
        <FieldLabel htmlFor={id}>Email</FieldLabel>
        <Input 
          id={id}
          type="email" 
          placeholder="you@example.com"
          aria-describedby={descriptionId}
        />
        <FieldDescription id={descriptionId}>We&apos;ll never share your email.</FieldDescription>
      </Field>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const id = 'username-field';
    const errorId = `${id}-error`;
    return (
      <Field>
        <FieldLabel htmlFor={id}>Username</FieldLabel>
        <Input 
          id={id}
          defaultValue="a"
          aria-invalid="true"
          aria-errormessage={errorId}
        />
        <FieldError id={errorId}>Username must be at least 3 characters.</FieldError>
      </Field>
    );
  },
};

export const WithTextarea: Story = {
  render: () => {
    const id = 'bio-field';
    const descriptionId = `${id}-description`;
    return (
      <Field>
        <FieldLabel htmlFor={id}>Bio</FieldLabel>
        <Textarea 
          id={id}
          placeholder="Tell us about yourself…"
          aria-describedby={descriptionId}
        />
        <FieldDescription id={descriptionId}>Brief description for your profile.</FieldDescription>
      </Field>
    );
  },
};

export const WithCheckbox: Story = {
  render: () => {
    const id = 'terms-checkbox';
    return (
      <Field>
        <div className="flex items-center gap-2">
          <Checkbox id={id} />
          <FieldLabel htmlFor={id} className="!mt-0">Accept terms and conditions</FieldLabel>
        </div>
        <FieldDescription>You must agree to continue.</FieldDescription>
      </Field>
    );
  },
};

export const WithRadioGroup: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Notify me via</FieldLegend>
      <FieldGroup>
        <RadioGroup defaultValue="email">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="email" id="notify-email" />
            <Label htmlFor="notify-email">Email</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="sms" id="notify-sms" />
            <Label htmlFor="notify-sms">SMS</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="none" id="notify-none" />
            <Label htmlFor="notify-none">None</Label>
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
        <FieldLabel htmlFor="name-field">Name</FieldLabel>
        <Input id="name-field" placeholder="John Doe" />
      </Field>

      <Field>
        <FieldLabel htmlFor="email-multi-field">Email</FieldLabel>
        <Input 
          id="email-multi-field" 
          type="email" 
          placeholder="john@example.com"
          aria-describedby="email-multi-field-description"
        />
        <FieldDescription id="email-multi-field-description">We&apos;ll never share your email.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="message-field">Message</FieldLabel>
        <Textarea id="message-field" placeholder="Your message…" />
      </Field>
    </form>
  ),
};
