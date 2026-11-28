import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import { Field, ListBoxItem, Multiselect, Stack } from '@my-ui/components';

const etiquetas = (
  <>
    <ListBoxItem value="urgente">Urgente</ListBoxItem>
    <ListBoxItem value="factura">Factura</ListBoxItem>
    <ListBoxItem value="cliente">Cliente nuevo</ListBoxItem>
    <ListBoxItem value="revisar">Revisar</ListBoxItem>
    <ListBoxItem value="archivo" disabled>
      Archivado
    </ListBoxItem>
    <ListBoxItem value="pago">Pago pendiente</ListBoxItem>
  </>
);

const meta = {
  title: 'Colecciones/Multiselect',
  component: Multiselect,
  // Sin `disabled` ni `size` fijos: dentro de un Field los toma de él
  args: {
    onChange: fn(),
    children: etiquetas,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    openOn: { control: 'inline-radio', options: ['input', 'focus'] },
    disabled: { control: 'boolean' },
    children: { control: false },
  },
  render: (args) => (
    <Field label="Etiquetas" description="Escribe para buscar." className="max-w-(--container-ui-xs)">
      <Multiselect {...args} />
    </Field>
  ),
} satisfies Meta<typeof Multiselect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Escribir filtra; `Enter` elige y la lista sigue abierta para elegir otra. */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Etiquetas' });
    await userEvent.type(input, 'urg');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await userEvent.type(input, 'pago');
    await userEvent.keyboard('{ArrowDown}{Enter}{Escape}');
    await expect(args.onChange).toHaveBeenLastCalledWith(['urgente', 'pago']);
    await expect(within(canvasElement).getByRole('button', { name: 'Quitar Pago pendiente' })).toBeInTheDocument();
  },
};

/** Las elegidas se ven como tags; su botón las quita y el foco vuelve al campo. */
export const ConElegidas: Story = {
  args: { defaultValue: ['urgente', 'factura', 'cliente'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar Factura' }));
    await expect(canvas.queryByText('Factura')).not.toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Etiquetas' })).toHaveFocus();
  },
};

/** Abierta: las elegidas llevan la marca ✓ y se desmarcan al volver a elegirlas. */
export const Abierto: Story = {
  args: { defaultValue: ['factura', 'revisar'] },
  decorators: [
    (Story) => (
      // La lista flota fuera del Field: la captura necesita el alto
      <div className="min-h-96">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Mostrar opciones/ }));
    await expect(await screen.findByRole('option', { name: 'Factura' })).toHaveAttribute('aria-selected', 'true');
  },
};

/** Con muchas elegidas, los tags pasan a la línea siguiente y el campo crece. */
export const Muchas: Story = {
  args: { defaultValue: ['urgente', 'factura', 'cliente', 'revisar', 'pago'] },
};

/** Error, obligatorio y deshabilitado vienen del `Field`. */
export const Estados: Story = {
  render: (args) => (
    <Stack gap="lg" className="max-w-(--container-ui-xs)">
      <Field label="Etiquetas" required error="Elige al menos una etiqueta.">
        <Multiselect {...args} />
      </Field>
      <Field label="Categorías" disabled>
        <Multiselect {...args} defaultValue={['urgente', 'factura']} />
      </Field>
    </Stack>
  ),
};

/** Los tres tamaños, iguales a los de `Input`. */
export const Tamanos: Story = {
  render: (args) => (
    <Stack gap="md" className="max-w-(--container-ui-xs)">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} label={`Etiquetas (${size})`} size={size}>
          <Multiselect {...args} size={size} defaultValue={['urgente', 'factura']} />
        </Field>
      ))}
    </Stack>
  ),
};
