import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconLock, IconMail, IconUser } from '@my-ui/icons';
import { ListBox, ListBoxItem, ListBoxSection, Stack, Text, type ControlSize } from '@my-ui/components';

/** Args de las historias (las props de ListBox son una unión: nombre y modo de elección). */
interface StoryArgs {
  size: ControlSize;
  onChange: (value: string | null) => void;
}

const clientes = (
  <>
    <ListBoxItem value="clavo">Ferretería El Clavo</ListBoxItem>
    <ListBoxItem value="aurora">Panadería La Aurora</ListBoxItem>
    <ListBoxItem value="cerrada" disabled>
      Librería Cerrada
    </ListBoxItem>
    <ListBoxItem value="sol">Farmacia del Sol</ListBoxItem>
    <ListBoxItem value="mar">Pescadería Mar Azul</ListBoxItem>
  </>
);

const meta = {
  title: 'Colecciones/ListBox',
  args: { size: 'md', onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <Stack gap="xs" className="max-w-(--container-ui-xs)">
      <Text id="cliente-label" variant="label">
        Cliente
      </Text>
      <ListBox aria-labelledby="cliente-label" defaultValue="aurora" {...args}>
        {clientes}
      </ListBox>
    </Stack>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/**
 * Nombrada por el texto visible con `aria-labelledby`. Flechas para moverse
 * (saltan las deshabilitadas), `Enter` o `Espacio` para elegir, letras para buscar.
 */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('listbox', { name: 'Cliente' })).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('option', { name: 'Panadería La Aurora' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Farmacia del Sol' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith('sol');
    await userEvent.keyboard('pe');
    await expect(canvas.getByRole('option', { name: 'Pescadería Mar Azul' })).toHaveFocus();
  },
};

/** `selectionMode="multiple"`: cada opción se marca y desmarca por separado. */
export const Multiple: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(['clavo', 'sol']);
    return (
      <Stack gap="xs" className="max-w-(--container-ui-xs)">
        <Text id="clientes-label" variant="label">
          Clientes del reporte
        </Text>
        <ListBox aria-labelledby="clientes-label" selectionMode="multiple" value={value} onChange={setValue}>
          {clientes}
        </ListBox>
        <Text variant="body-sm" tone="muted">
          Elegidos: {value.length > 0 ? value.join(', ') : 'ninguno'}
        </Text>
      </Stack>
    );
  },
};

/** Opciones agrupadas con `ListBoxSection`, con ícono y descripción. */
export const SeccionesYDescripcion: Story = {
  render: (args) => (
    <ListBox aria-label="Compartir con" defaultValue="equipo" className="max-w-(--container-ui-xs)" {...args}>
      <ListBoxSection title="Personas">
        <ListBoxItem value="equipo" icon={<IconUser />} description="Las 8 personas del equipo">
          Mi equipo
        </ListBoxItem>
        <ListBoxItem value="correo" icon={<IconMail />} description="Por correo, con enlace">
          Alguien más
        </ListBoxItem>
      </ListBoxSection>
      <ListBoxSection title="Privado">
        <ListBoxItem value="solo-yo" icon={<IconLock />} description="Nadie más lo ve">
          Solo yo
        </ListBoxItem>
      </ListBoxSection>
    </ListBox>
  ),
};

/** Los tres tamaños, iguales a los de los controles de formulario. */
export const Tamanos: Story = {
  render: () => (
    <div className="grid items-start gap-ui-lg ui-sm:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ListBox key={size} aria-label={`Cliente (${size})`} size={size} defaultValue="aurora">
          {clientes}
        </ListBox>
      ))}
    </div>
  ),
};

/** Sin opciones muestra un texto (por defecto "Sin opciones"; se cambia con `emptyState`). */
export const Vacia: Story = {
  render: () => (
    <ListBox aria-label="Resultados" emptyState="Ningún cliente coincide" className="max-w-(--container-ui-xs)">
      {null}
    </ListBox>
  ),
};
