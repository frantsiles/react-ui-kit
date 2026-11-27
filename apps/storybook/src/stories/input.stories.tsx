import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Input } from '@my-ui/components';
import { IconMail, IconUser } from '@my-ui/icons';

const meta = {
  title: 'Inputs/Input',
  component: Input,
  args: { size: 'md', placeholder: 'nombre@dominio.com', disabled: false, readOnly: false, invalid: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
    endAdornment: { control: false },
  },
  render: (args) => (
    <Field label="Correo electrónico" size={args.size}>
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

/** `type`, `inputMode` y `autoComplete` deciden el teclado en móvil y el autocompletado. */
export const TecladoCorrecto: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Field label="Correo">
        <Input type="email" autoComplete="email" />
      </Field>
      <Field label="Teléfono">
        <Input type="tel" inputMode="tel" autoComplete="tel" />
      </Field>
      <Field label="Código de verificación" description="6 dígitos">
        <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
      </Field>
    </div>
  ),
};
