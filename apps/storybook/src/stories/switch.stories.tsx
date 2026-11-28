import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Divider, Switch, Text } from '@my-ui/components';

const meta = {
  title: 'Selección/Switch',
  component: Switch,
  args: {
    children: 'Notificaciones por correo',
    size: 'md',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    description: { control: 'text' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Notificaciones por correo' });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(toggle).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Switch>Apagado</Switch>
      <Switch defaultChecked>Encendido</Switch>
      <Switch disabled>Deshabilitado</Switch>
      <Switch disabled defaultChecked>
        Deshabilitado y encendido
      </Switch>
    </div>
  ),
};

export const Tamanos: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Switch size="sm" defaultChecked>
        Pequeño
      </Switch>
      <Switch size="md" defaultChecked>
        Mediano
      </Switch>
      <Switch size="lg" defaultChecked>
        Grande
      </Switch>
    </div>
  ),
};

export const ConAyuda: Story = {
  args: { description: 'Te avisamos cuando llegue una factura nueva.' },
};

/** Ajustes que se aplican al instante: el cambio se ve (o se anuncia) sin botón de guardar. */
export const Ajustes: Story = {
  render: function Render() {
    const [compact, setCompact] = useState(false);
    return (
      <section aria-labelledby="ajustes" className="flex max-w-md flex-col gap-3">
        <h3 id="ajustes" className="text-ui-heading-sm">
          Preferencias
        </h3>
        <Switch
          checked={compact}
          onChange={(event) => setCompact(event.target.checked)}
          description="Muestra más filas en las tablas."
        >
          Vista compacta
        </Switch>
        <Divider decorative />
        <Text variant="body-sm" tone="muted" role="status">
          Vista {compact ? 'compacta' : 'normal'} activada.
        </Text>
      </section>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Vista compacta' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Vista compacta activada.');
    await userEvent.click(canvas.getByRole('switch', { name: 'Vista compacta' }));
  },
};
