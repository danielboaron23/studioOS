import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  Field,
  FieldContent,
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
          'Field composition for forms. Includes `Field`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldSet`, `FieldLegend`, `FieldGroup`, and `FieldSeparator`. Wire `id`, `htmlFor`, `aria-describedby`, `aria-invalid`, and `aria-errormessage` explicitly on controls.',
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
        <FieldContent>
          <FieldLabel htmlFor={id}>Email</FieldLabel>
          <Input
            id={id}
            type="email"
            placeholder="you@example.com"
            aria-describedby={descriptionId}
          />
          <FieldDescription id={descriptionId}>We&apos;ll never share your email.</FieldDescription>
        </FieldContent>
      </Field>
    );
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="email"]') as HTMLInputElement;
    if (!input) throw new Error('Input not found');
    const describedby = input.getAttribute('aria-describedby');
    if (!describedby?.includes('email-field-description')) {
      throw new Error(`Expected aria-describedby to contain 'email-field-description', got: ${describedby}`);
    }
  },
};

export const WithError: Story = {
  render: () => {
    const id = 'username-field';
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;
    return (
      <Field data-invalid="true">
        <FieldContent>
          <FieldLabel htmlFor={id}>Username</FieldLabel>
          <Input
            id={id}
            defaultValue="a"
            aria-invalid="true"
            aria-describedby={`${descriptionId} ${errorId}`}
            aria-errormessage={errorId}
          />
          <FieldDescription id={descriptionId}>At least 3 characters.</FieldDescription>
          <FieldError id={errorId}>Username must be at least 3 characters.</FieldError>
        </FieldContent>
      </Field>
    );
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    if (!input) throw new Error('Input not found');
    if (input.getAttribute('aria-invalid') !== 'true') {
      throw new Error('Expected aria-invalid="true"');
    }
    const describedby = input.getAttribute('aria-describedby');
    if (!describedby?.includes('username-field-description') || !describedby?.includes('username-field-error')) {
      throw new Error(`Expected aria-describedby to contain both description and error IDs, got: ${describedby}`);
    }
  },
};

export const WithTextarea: Story = {
  render: () => {
    const id = 'bio-field';
    const descriptionId = `${id}-description`;
    return (
      <Field>
        <FieldContent>
          <FieldLabel htmlFor={id}>Bio</FieldLabel>
          <Textarea
            id={id}
            placeholder="Tell us about yourself…"
            aria-describedby={descriptionId}
          />
          <FieldDescription id={descriptionId}>Brief description for your profile.</FieldDescription>
        </FieldContent>
      </Field>
    );
  },
  play: async ({ canvasElement }) => {
    const textarea = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) throw new Error('Textarea not found');
    const describedby = textarea.getAttribute('aria-describedby');
    if (!describedby?.includes('bio-field-description')) {
      throw new Error(`Expected aria-describedby to contain 'bio-field-description', got: ${describedby}`);
    }
  },
};

export const WithCheckbox: Story = {
  render: () => {
    const id = 'terms-checkbox-field';
    const descriptionId = `${id}-description`;
    return (
      <Field>
        <FieldLabel htmlFor={id}>
          <Checkbox id={id} aria-describedby={descriptionId} />
          Accept terms and conditions
        </FieldLabel>
        <FieldDescription id={descriptionId}>You must agree to continue.</FieldDescription>
      </Field>
    );
  },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('[role="checkbox"]') as HTMLElement;
    if (!checkbox) throw new Error('Checkbox not found');
    const describedby = checkbox.getAttribute('aria-describedby');
    if (!describedby?.includes('terms-checkbox-field-description')) {
      throw new Error(`Expected aria-describedby to contain 'terms-checkbox-field-description', got: ${describedby}`);
    }
  },
};

export const WithRadioGroup: Story = {
  render: () => {
    const groupId = 'notify-method';
    const descriptionId = `${groupId}-description`;
    return (
      <FieldSet>
        <FieldLegend>Notify me via</FieldLegend>
        <FieldGroup>
          <RadioGroup defaultValue="email" aria-describedby={descriptionId}>
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
          <FieldDescription id={descriptionId}>Choose how you want to be notified.</FieldDescription>
        </FieldGroup>
      </FieldSet>
    );
  },
  play: async ({ canvasElement }) => {
    const radiogroup = canvasElement.querySelector('[role="radiogroup"]') as HTMLElement;
    if (!radiogroup) throw new Error('RadioGroup not found');
    const describedby = radiogroup.getAttribute('aria-describedby');
    if (!describedby?.includes('notify-method-description')) {
      throw new Error(`Expected aria-describedby to contain 'notify-method-description', got: ${describedby}`);
    }
    const radios = canvasElement.querySelectorAll('[role="radio"]');
    if (radios.length !== 3) {
      throw new Error(`Expected 3 radio buttons, found ${radios.length}`);
    }
  },
};

export const MultipleFields: Story = {
  render: () => (
    <form className="space-y-6">
      <Field>
        <FieldContent>
          <FieldLabel htmlFor="name-field">Name</FieldLabel>
          <Input id="name-field" placeholder="John Doe" />
        </FieldContent>
      </Field>

      <Field>
        <FieldContent>
          <FieldLabel htmlFor="email-multi-field">Email</FieldLabel>
          <Input
            id="email-multi-field"
            type="email"
            placeholder="john@example.com"
            aria-describedby="email-multi-field-description"
          />
          <FieldDescription id="email-multi-field-description">We&apos;ll never share your email.</FieldDescription>
        </FieldContent>
      </Field>

      <Field>
        <FieldContent>
          <FieldLabel htmlFor="message-field">Message</FieldLabel>
          <Textarea id="message-field" placeholder="Your message…" />
        </FieldContent>
      </Field>
    </form>
  ),
};
