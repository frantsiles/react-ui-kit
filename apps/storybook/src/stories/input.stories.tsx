import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Field, Input, PasswordInput, SearchInput, Textarea } from '@my-ui/components';
import { IconMail, IconUser } from '@my-ui/icons';

const meta = {
  title: 'Inputs/Input',
  component: Input,
  args: { size: 'md', placeholder: 'nombre@dominio.com' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  render: (args) => (
    <Field label="Correo electrónico" description="Te enviaremos la confirmación aquí" size={args.size}>
      <Input type="email" autoComplete="email" startIcon={<IconMail />} {...args} />
    </Field>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

export const Tamanos: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} label={`Tamaño ${size}`} size={size}>
          <Input startIcon={<IconUser />} />
        </Field>
      ))}
    </div>
  ),
};

export const ConError: Story = {
  render: () => (
    <Field label="Correo electrónico" required error="Ingresa un correo como nombre@dominio.com">
      <Input type="email" autoComplete="email" defaultValue="ana@" startIcon={<IconMail />} />
    </Field>
  ),
};

export const DeshabilitadoYSoloLectura: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Field label="Deshabilitado" disabled description="No se envía con el formulario">
        <Input defaultValue="No editable" />
      </Field>
      <Field label="Solo lectura" description="Se puede seleccionar y sí se envía">
        <Input readOnly defaultValue="ID-2026-0042" />
      </Field>
    </div>
  ),
};

export const Contrasena: Story = {
  render: () => (
    <Field label="Contraseña nueva" description="Mínimo 12 caracteres. Puedes pegarla desde tu gestor.">
      <PasswordInput autoComplete="new-password" />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Mostrar contraseña' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(toggle);
  },
};

export const Busqueda: Story = {
  render: () => (
    <Field label="Buscar productos" hideLabel>
      <SearchInput placeholder="Buscar productos" defaultValue="zapatillas" />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar búsqueda' }));
    await expect(canvas.getByRole('searchbox')).toHaveValue('');
    await expect(canvas.getByRole('searchbox')).toHaveFocus();
  },
};

export const AreaDeTexto: Story = {
  render: () => (
    <Field label="Comentario" optional description="Máximo 500 caracteres">
      <Textarea maxLength={500} />
    </Field>
  ),
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
