import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Radio, RadioGroup } from '@my-ui/components';

const meta = {
  title: 'Selección/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  args: {
    label: 'Frecuencia de facturación',
    description: 'Puedes cambiarla cuando quieras.',
    orientation: 'vertical',
    size: 'md',
    disabled: false,
    required: false,
    defaultValue: 'mensual',
    onChange: fn(),
    children: (
      <>
        <Radio value="mensual">Mensual</Radio>
        <Radio value="anual" description="Dos meses gratis.">
          Anual
        </Radio>
        <Radio value="unico">Pago único</Radio>
      </>
    ),
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    error: { control: 'text' },
    children: { control: false },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tab entra en la opción elegida; las flechas mueven y eligen. */
export const Basico: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('radiogroup', { name: 'Frecuencia de facturación' }),
    ).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'Mensual' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Anual' })).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith('anual');
    // Vuelve al estado inicial para la captura
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('radio', { name: 'Mensual' })).toBeChecked();
  },
};

export const Horizontal: Story = {
  args: {
    label: 'Tamaño',
    description: undefined,
    orientation: 'horizontal',
    defaultValue: 'm',
    children: (
      <>
        <Radio value="s">Chico</Radio>
        <Radio value="m">Mediano</Radio>
        <Radio value="l">Grande</Radio>
      </>
    ),
  },
};

export const Tamanos: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <RadioGroup key={size} {...args} label={`Tamaño ${size}`} size={size} description={undefined} />
      ))}
    </div>
  ),
};

/** Sin valor inicial y `required`: el error aparece al enviar sin elegir. */
export const ConError: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    return (
      <form
        noValidate
        aria-label="Suscripción"
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <RadioGroup
          {...args}
          defaultValue={undefined}
          required
          value={value}
          onChange={setValue}
          error={submitted && value === null ? 'Elige una frecuencia para continuar.' : undefined}
        />
        <Button type="submit" className="self-start">
          Continuar
        </Button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    const group = canvas.getByRole('radiogroup');
    await expect(group).toHaveAttribute('aria-invalid', 'true');
    await expect(group).toHaveAccessibleDescription(/Elige una frecuencia para continuar\./);
  },
};

export const Deshabilitado: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    for (const radio of within(canvasElement).getAllByRole('radio')) {
      await expect(radio).toBeDisabled();
    }
  },
};
