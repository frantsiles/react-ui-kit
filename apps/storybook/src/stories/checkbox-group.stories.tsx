import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Checkbox, CheckboxGroup } from '@my-ui/components';

const meta = {
  title: 'Selección/CheckboxGroup',
  component: CheckboxGroup,
  args: {
    label: '¿Por dónde quieres recibir avisos?',
    description: 'Puedes elegir varios.',
    name: 'canales',
    orientation: 'vertical',
    size: 'md',
    disabled: false,
    defaultValue: ['correo'],
    onChange: fn(),
    children: (
      <>
        <Checkbox value="correo">Correo</Checkbox>
        <Checkbox value="sms">SMS</Checkbox>
        <Checkbox value="push" description="Solo en la app móvil.">
          Notificaciones
        </Checkbox>
      </>
    ),
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'text' },
    children: { control: false },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('group', { name: '¿Por dónde quieres recibir avisos?' }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'SMS' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(['correo', 'sms']);
    // Vuelve al estado inicial para la captura
    await userEvent.click(canvas.getByRole('checkbox', { name: 'SMS' }));
  },
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', description: undefined },
};

/** El error queda conectado al grupo y marca todas las casillas como inválidas. */
export const ConError: Story = {
  args: { defaultValue: [], error: 'Elige al menos un canal.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group')).toHaveAccessibleDescription(
      /Elige al menos un canal\./,
    );
  },
};

export const Deshabilitado: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    for (const checkbox of within(canvasElement).getAllByRole('checkbox')) {
      await expect(checkbox).toBeDisabled();
    }
  },
};

/** Controlado: el estado vive afuera. */
export const Controlado: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['sms']);
    return (
      <div className="flex flex-col gap-3">
        <CheckboxGroup {...args} value={value} onChange={setValue} />
        <p className="text-ui-body-sm text-ui-fg-muted">
          Marcados: {value.length > 0 ? value.join(', ') : 'ninguno'}
        </p>
      </div>
    );
  },
};
