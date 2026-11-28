import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, Checkbox } from '@my-ui/components';

const meta = {
  title: 'Selección/Checkbox',
  component: Checkbox,
  args: {
    children: 'Recordarme en este dispositivo',
    size: 'md',
    disabled: false,
    indeterminate: false,
    onChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    description: { control: 'text' },
    error: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ args, canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Recordarme en este dispositivo',
    });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(checkbox).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(2);
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox>Sin marcar</Checkbox>
      <Checkbox defaultChecked>Marcada</Checkbox>
      <Checkbox indeterminate readOnly>
        Mixta
      </Checkbox>
      <Checkbox disabled>Deshabilitada</Checkbox>
      <Checkbox disabled defaultChecked>
        Deshabilitada y marcada
      </Checkbox>
    </div>
  ),
};

export const Tamanos: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox size="sm" defaultChecked>
        Pequeña
      </Checkbox>
      <Checkbox size="md" defaultChecked>
        Mediana
      </Checkbox>
      <Checkbox size="lg" defaultChecked>
        Grande
      </Checkbox>
    </div>
  ),
};

/** Ayuda y error se alinean con el texto. El error dice cómo corregir. */
export const ConAyudaYError: Story = {
  render: function Render() {
    const [accepted, setAccepted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    return (
      <form
        noValidate
        className="flex max-w-md flex-col gap-4"
        aria-label="Registro"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <Checkbox
          name="terminos"
          required
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          description="Incluye el tratamiento de tus datos para emitir facturas."
          error={submitted && !accepted ? 'Acepta los términos para crear la cuenta.' : undefined}
        >
          Acepto los términos del servicio
        </Checkbox>
        <Button type="submit" className="self-start">
          Crear cuenta
        </Button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Crear cuenta' }));
    const checkbox = canvas.getByRole('checkbox');
    await expect(checkbox).toBeInvalid();
    await expect(checkbox).toHaveAccessibleDescription(/Acepta los términos para crear la cuenta/);
  },
};

const items = ['Facturas', 'Recibos', 'Notas de crédito'];

/** La casilla "todas" queda mixta cuando solo algunas están marcadas. */
export const SeleccionarTodas: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<string[]>(['Facturas']);
    const all = selected.length === items.length;
    const some = selected.length > 0 && !all;
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          checked={all}
          indeterminate={some}
          onChange={() => setSelected(all ? [] : items)}
        >
          Todos los documentos
        </Checkbox>
        <div className="flex flex-col gap-2 ps-6.5">
          {items.map((item) => (
            <Checkbox
              key={item}
              checked={selected.includes(item)}
              onChange={(event) =>
                setSelected((prev) =>
                  event.target.checked ? [...prev, item] : prev.filter((v) => v !== item),
                )
              }
            >
              {item}
            </Checkbox>
          ))}
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByRole('checkbox', { name: 'Todos los documentos' });
    await expect(parent).toBePartiallyChecked();
    await userEvent.click(parent);
    await expect(parent).toBeChecked();
    for (const item of items) {
      await expect(canvas.getByRole('checkbox', { name: item })).toBeChecked();
    }
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Recibos' }));
    await expect(parent).toBePartiallyChecked();
  },
};
