import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Textarea } from '@my-ui/components';

const meta = {
  title: 'Inputs/Textarea',
  component: Textarea,
  args: { rows: 3, size: 'md', disabled: false, invalid: false },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <Field label="Comentario" optional description="Máximo 500 caracteres">
      <Textarea maxLength={500} {...args} />
    </Field>
  ),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

export const ConError: Story = {
  render: () => (
    <Field label="Motivo del reclamo" required error="Describe el problema en al menos 20 caracteres">
      <Textarea defaultValue="No funciona" />
    </Field>
  ),
};
