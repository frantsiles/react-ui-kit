import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Field, PasswordInput } from '@my-ui/components';

const meta = {
  title: 'Inputs/PasswordInput',
  component: PasswordInput,
  args: { autoComplete: 'current-password', size: 'md', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    autoComplete: { control: 'inline-radio', options: ['current-password', 'new-password'] },
  },
  render: (args) => (
    <Field label="Contraseña">
      <PasswordInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Mostrar contraseña' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  },
};

/** En registro o cambio de contraseña: el gestor de contraseñas propone una segura. */
export const ContrasenaNueva: Story = {
  render: () => (
    <Field label="Contraseña nueva" description="Mínimo 12 caracteres. Puedes pegarla desde tu gestor.">
      <PasswordInput autoComplete="new-password" />
    </Field>
  ),
};
