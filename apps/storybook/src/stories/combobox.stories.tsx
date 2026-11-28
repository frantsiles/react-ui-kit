import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Combobox, Field, ListBoxItem, ListBoxSection, Stack } from '@my-ui/components';

const clientes = (
  <>
    <ListBoxItem value="clavo">Ferretería El Clavo</ListBoxItem>
    <ListBoxItem value="aurora">Panadería La Aurora</ListBoxItem>
    <ListBoxItem value="cerrada" disabled>
      Librería Cerrada
    </ListBoxItem>
    <ListBoxItem value="sol">Farmacia del Sol</ListBoxItem>
    <ListBoxItem value="mar">Pescadería Mar Azul</ListBoxItem>
    <ListBoxItem value="luna">Verdulería La Luna</ListBoxItem>
  </>
);

const meta = {
  title: 'Colecciones/Combobox',
  component: Combobox,
  // Sin `disabled` ni `size` fijos: dentro de un Field los toma de él
  args: {
    onChange: fn(),
    children: clientes,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    openOn: { control: 'inline-radio', options: ['input', 'focus'] },
    disabled: { control: 'boolean' },
    allowCustomValue: { control: 'boolean' },
    children: { control: false },
  },
  render: (args) => (
    <Field label="Cliente" description="Escribe para buscar." className="max-w-(--container-ui-xs)">
      <Combobox {...args} />
    </Field>
  ),
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dentro de un `Field`. Escribir filtra; flechas recorren, `Enter` elige y `Escape` cierra. */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Cliente' });
    await userEvent.type(input, 'sol');
    await userEvent.click(await screen.findByRole('option', { name: 'Farmacia del Sol' }));
    await expect(args.onChange).toHaveBeenLastCalledWith('sol');
    await expect(input).toHaveValue('Farmacia del Sol');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  },
};

/** Abierto mientras se escribe: solo quedan las opciones que contienen el texto. */
export const Filtrando: Story = {
  decorators: [
    (Story) => (
      // La lista flota fuera del Field: la captura necesita el alto
      <div className="min-h-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('combobox', { name: 'Cliente' }), 'ería');
    await expect(await screen.findAllByRole('option')).toHaveLength(5);
  },
};

/** Si nada coincide, la lista lo dice en vez de desaparecer. */
export const SinResultados: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-40">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    await userEvent.type(within(canvasElement).getByRole('combobox', { name: 'Cliente' }), 'xyz');
    await expect(await screen.findByText('Sin resultados')).toBeInTheDocument();
  },
};

/** Con `allowCustomValue` se puede dejar un texto que no está en la lista (un cliente nuevo). */
export const ValorLibre: Story = {
  args: { allowCustomValue: true, onInputChange: fn() },
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Cliente' });
    await userEvent.type(input, 'Taller Don Pepe');
    await userEvent.tab();
    await expect(input).toHaveValue('Taller Don Pepe');
    await expect(args.onInputChange).toHaveBeenLastCalledWith('Taller Don Pepe');
  },
};

/** Opciones agrupadas bajo un título, como en `Select`. */
export const Secciones: Story = {
  render: (args) => (
    <Field label="País" className="max-w-(--container-ui-xs)">
      <Combobox {...args}>
        <ListBoxSection title="América">
          <ListBoxItem value="ar">Argentina</ListBoxItem>
          <ListBoxItem value="cl">Chile</ListBoxItem>
          <ListBoxItem value="mx">México</ListBoxItem>
        </ListBoxSection>
        <ListBoxSection title="Europa">
          <ListBoxItem value="es">España</ListBoxItem>
          <ListBoxItem value="pt">Portugal</ListBoxItem>
        </ListBoxSection>
      </Combobox>
    </Field>
  ),
};

/** Error, obligatorio y deshabilitado vienen del `Field`. */
export const Estados: Story = {
  render: (args) => (
    <Stack gap="lg" className="max-w-(--container-ui-xs)">
      <Field label="Cliente" required error="Elige un cliente de la lista.">
        <Combobox {...args} />
      </Field>
      <Field label="Proveedor" disabled>
        <Combobox {...args} defaultValue="clavo" />
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
          <Combobox {...args} size={size} defaultValue="aurora" />
        </Field>
      ))}
    </Stack>
  ),
};
