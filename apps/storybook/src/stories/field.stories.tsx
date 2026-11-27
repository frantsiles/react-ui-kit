import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Input } from '@my-ui/components';

const meta = {
  title: 'Inputs/Field',
  component: Field,
  args: {
    label: 'Correo electrónico',
    description: 'Te enviaremos la confirmación aquí',
    required: false,
    optional: false,
    disabled: false,
    hideLabel: false,
    size: 'md',
    children: null,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'text' },
    children: { control: false },
  },
  render: ({ children: _children, ...args }) => (
    <Field {...args}>
      <Input type="email" autoComplete="email" />
    </Field>
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** El error dice cómo corregir, lleva ícono y marca el control con aria-invalid. */
export const ConError: Story = {
  args: { required: true, error: 'Ingresa un correo como nombre@dominio.com' },
};

export const Opcional: Story = {
  args: { label: 'Teléfono', optional: true, description: undefined },
};

/** La etiqueta sigue existiendo para lectores de pantalla. Úsalo solo si el contexto visual es obvio. */
export const EtiquetaOculta: Story = {
  args: { label: 'Buscar en el sitio', hideLabel: true, description: undefined },
};

/** Ocupa el ancho de su contenedor: prueba el viewport móvil o el zoom al 200%. */
export const Responsivo: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Nombre" required>
        <Input autoComplete="given-name" />
      </Field>
      <Field label="Apellido" required>
        <Input autoComplete="family-name" />
      </Field>
      <Field label="Teléfono" optional className="sm:col-span-2">
        <Input type="tel" inputMode="tel" autoComplete="tel" />
      </Field>
    </div>
  ),
};
