import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { IconLock, IconMail, IconUser } from '@my-ui/icons';
import { Field, ListBoxItem, ListBoxSection, Select, Stack } from '@my-ui/components';

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
  title: 'Colecciones/Select',
  component: Select,
  args: {
    size: 'md',
    disabled: false,
    onChange: fn(),
    children: clientes,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  render: (args) => (
    <Field label="Cliente" description="A quién se le factura." className="max-w-(--container-ui-xs)">
      <Select {...args} />
    </Field>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dentro de un `Field`. Flecha abajo abre, flechas recorren, `Enter` elige y `Escape` cierra. */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const trigger = within(canvasElement).getByRole('button', { name: /Cliente/ });
    await expect(trigger).toHaveTextContent('Elige una opción');
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'Farmacia del Sol' }));
    await expect(args.onChange).toHaveBeenLastCalledWith('sol');
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveTextContent('Farmacia del Sol');
  },
};

/** La lista se abre debajo, con el ancho del botón como mínimo. */
export const Abierto: Story = {
  args: { defaultValue: 'aurora', defaultOpen: true },
  decorators: [
    (Story) => (
      // La lista flota fuera del Field: la captura necesita el alto
      <div className="min-h-80">
        <Story />
      </div>
    ),
  ],
};

/** Opciones con ícono, descripción y secciones: lo que `NativeSelect` no puede mostrar. */
export const SeccionesYDescripcion: Story = {
  args: { defaultValue: 'equipo', defaultOpen: true },
  decorators: [
    (Story) => (
      <div className="min-h-96">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Field label="Compartir con" className="max-w-(--container-ui-xs)">
      <Select {...args}>
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
      </Select>
    </Field>
  ),
};

/** Error, obligatorio y deshabilitado vienen del `Field`. */
export const Estados: Story = {
  render: (args) => (
    <Stack gap="lg" className="max-w-(--container-ui-xs)">
      <Field label="Cliente" required error="Elige a quién se le factura.">
        <Select {...args} />
      </Field>
      <Field label="Moneda" disabled>
        <Select {...args} defaultValue="clavo" />
      </Field>
    </Stack>
  ),
};

/** Los tres tamaños, iguales a los de `Input`. */
export const Tamanos: Story = {
  render: (args) => (
    <Stack gap="md" className="max-w-(--container-ui-xs)">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} label={`Cliente (${size})`} size={size}>
          <Select {...args} size={size} defaultValue="aurora" />
        </Field>
      ))}
    </Stack>
  ),
};
