import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Field, NativeSelect } from '@my-ui/components';

const countries = (
  <>
    <option value="ar">Argentina</option>
    <option value="cl">Chile</option>
    <option value="co">Colombia</option>
    <option value="cr">Costa Rica</option>
    <option value="es">España</option>
    <option value="mx">México</option>
  </>
);

const meta = {
  title: 'Inputs/NativeSelect',
  component: NativeSelect,
  args: {
    size: 'md',
    placeholder: 'Elige un país',
    disabled: false,
    invalid: false,
    onChange: fn(),
    children: countries,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  render: (args) => (
    <Field label="País" size={args.size} className="max-w-xs">
      <NativeSelect autoComplete="country" {...args} />
    </Field>
  ),
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ args, canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', { name: 'País' });
    await expect(select).toHaveValue('');
    await userEvent.selectOptions(select, 'cl');
    await expect(select).toHaveValue('cl');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    // Vuelve al estado inicial para la captura
    await userEvent.selectOptions(select, '');
  },
};

export const Tamanos: Story = {
  render: () => (
    <div className="flex max-w-xs flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} label={`Tamaño ${size}`} size={size}>
          <NativeSelect defaultValue="cr">{countries}</NativeSelect>
        </Field>
      ))}
    </div>
  ),
};

/** Con `<optgroup>` el sistema agrupa las opciones con su título. */
export const ConGrupos: Story = {
  render: () => (
    <Field label="Zona horaria" className="max-w-xs">
      <NativeSelect defaultValue="America/Costa_Rica">
        <optgroup label="América">
          <option value="America/Mexico_City">Ciudad de México</option>
          <option value="America/Costa_Rica">San José</option>
          <option value="America/Bogota">Bogotá</option>
        </optgroup>
        <optgroup label="Europa">
          <option value="Europe/Madrid">Madrid</option>
          <option value="Europe/Lisbon">Lisboa</option>
        </optgroup>
      </NativeSelect>
    </Field>
  ),
};

/** `required` + placeholder: el error aparece al enviar sin elegir. */
export const ConError: Story = {
  render: function Render() {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState(false);
    return (
      <form
        noValidate
        aria-label="Facturación"
        className="flex max-w-xs flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field
          label="País"
          required
          error={submitted && value === '' ? 'Elige el país donde emites tus facturas.' : undefined}
        >
          <NativeSelect
            placeholder="Elige un país"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            {countries}
          </NativeSelect>
        </Field>
        <Button type="submit" className="self-start">
          Continuar
        </Button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    const select = canvas.getByRole('combobox', { name: 'País' });
    await expect(select).toBeInvalid();
    await expect(select).toHaveAccessibleDescription(/Elige el país donde emites tus facturas\./);
  },
};

export const Deshabilitado: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox')).toBeDisabled();
  },
};
